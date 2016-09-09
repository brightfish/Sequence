using Application.Data;
using Application.Web.Models;
using Application.Web.Properties;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using RazorEngine;
using RazorEngine.Templating;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Application.Web.Controllers.Account
{
    [Authorize]
    [RoutePrefix("api/account")]
    public class AccountController : ApiController
    {
        private SequenceUserManager _UserManager { get; set; }
        private SequenceContext _SequenceContext { get; set; }
        public AccountController(SequenceContext sequenceContext, SequenceUserManager userManager, Func<string, IIdentityMessageService> emailServiceFactory, IUserTokenProvider<SequenceUser, string> tokenProvider)
        {
            _SequenceContext = sequenceContext;

            _UserManager = userManager;
            _UserManager.EmailService = emailServiceFactory("no-reply@hawkeslearning.com");

            _UserManager.UserValidator = new UserValidator<SequenceUser>(_UserManager);
            _UserManager.UserTokenProvider = tokenProvider;
            _UserManager.PasswordValidator = new PasswordValidator() { RequireDigit = true, RequiredLength = 6, RequireUppercase = true };

            _UserManager.UserLockoutEnabledByDefault = true;
            _UserManager.MaxFailedAccessAttemptsBeforeLockout = 5;
            _UserManager.DefaultAccountLockoutTimeSpan = new TimeSpan(0, 10, 0);
        }

        private IAuthenticationManager _authenticationManager
        {
            get
            {
                return Request.GetOwinContext().Authentication;
            }
        }

        [Route("signin")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> SignIn(LoginBindingModel model)
        {
            using (var signInManager = new SignInManager<SequenceUser, string>(_UserManager, _authenticationManager))
            {
                var status = await signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

                switch (status)
                {
                    default:
                    case SignInStatus.Failure:
                        var user = _UserManager.FindByEmail(model.Email);
                        if (user != null)
                        {
                            _UserManager.AccessFailed(user.Id);
                        }

                        ModelState.AddModelError("Email", Resources.EmailPasswordIncorrect);
                        return BadRequest(ModelState);
                    case SignInStatus.LockedOut:
                        ModelState.AddModelError("Email", Resources.AccountLockedOut);
                        return BadRequest(ModelState);
                    case SignInStatus.Success:
                        break;
                }
            }

            return Ok();
        }

        // POST api/account/signout
        [Route("signout")]
        [HttpPost]
        public IHttpActionResult SignOut()
        {
            _authenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return Ok();
        }

        [Route("getuserinfo")]
        [AllowAnonymous]
        [HttpGet]
        //[WebApiCacheControl(NoCache = true)]
        public IHttpActionResult GetUserInfo()
        {
            var model = new AccountInfoViewModel();
            model.IsAuthenticated = User.Identity.IsAuthenticated;

            if (model.IsAuthenticated)
            {
                var identity = User.Identity as ClaimsIdentity;
                model.GivenName = identity.FindFirstValue(ClaimTypes.GivenName);
                model.Surname = identity.FindFirstValue(ClaimTypes.Surname);
                model.Roles = _UserManager.GetRoles(identity.GetUserId());
                model.Email = identity.FindFirstValue(ClaimTypes.Name);
            }

            return Ok(model);
        }

        [Route("changepassword")]
        [HttpPut]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            Validate(model);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await _UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        [AllowAnonymous]
        [Route("sendresetpasswordemail")]
        public async Task<IHttpActionResult> SendResetPasswordEmail(SendResetPasswordEmailBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SequenceUser user = await _UserManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                ModelState.AddModelError("Email", Resources.UserDoesNotExist);
                return BadRequest(ModelState);
            }

            if (await _UserManager.IsLockedOutAsync(user.Id))
            {
                ModelState.AddModelError("Email", Resources.AccountLockedOut);
                return BadRequest(ModelState);
            }

            string token = _UserManager.GeneratePasswordResetToken(user.Id);

            string application = Request.RequestUri.Segments.Skip(1).First();
            Uri baseUrl = new Uri(Url.Request.RequestUri.GetComponents(UriComponents.SchemeAndServer, UriFormat.Unescaped) + "/" + application);
            UriTemplate template = new UriTemplate("account/forgot/email/reset?token={token}&email={email}");
            Uri resetUrl = template.BindByPosition(baseUrl, token, model.Email);

            //Todo: Make sure this does not log them in.  
            ClaimsIdentity identity = _UserManager.CreateIdentity(user, DefaultAuthenticationTypes.ApplicationCookie);
            string givenName = identity.FindFirstValue(ClaimTypes.GivenName);

            var viewModel = new SendResetPasswordEmailViewModel()
            {
                Name = givenName,
                Email = user.Email,
                ResetUrl = resetUrl.ToString()
            };

            string body = Engine.Razor.RunCompile(Resources.ResetPasswordEmail, "ResetPasswordEmail", typeof(SendResetPasswordEmailViewModel), viewModel, null);

            await _UserManager.EmailService.SendAsync(new IdentityMessage()
            {
                Body = body,
                Destination = user.Email,
                Subject = "Hawkes Learning Password Reset Request"
            });

            return Ok();
        }

        [AllowAnonymous]
        [Route("resetpassword")]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _UserManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                ModelState.AddModelError("Email", Resources.UserDoesNotExist);
                return BadRequest(ModelState);
            }

            if (await _UserManager.IsLockedOutAsync(user.Id))
            {
                ModelState.AddModelError("Email", Resources.AccountLockedOut);
                return BadRequest(ModelState);
            }

            var result = _UserManager.ResetPassword(user.Id, model.Token, model.Password);

            if (result.Succeeded)
            {
                using (var signInManager = new SignInManager<SequenceUser, string>(_UserManager, _authenticationManager))
                {
                    var status = await signInManager.PasswordSignInAsync(model.Email, model.Password, false, true);
                }
            }
            else
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("getsecurityquestions")]
        public async Task<IHttpActionResult> GetSecurityQuestions(GetSecurityQuestionsBindingModel model)
        {
            var viewModel = new GetSecurityQuestionsViewModel();

            var user = await _UserManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                ModelState.AddModelError("User", Resources.UserDoesNotExist);
                return BadRequest(ModelState);
            }

            //viewModel.PrimarySecurityQuestion = user.PrimarySecurityQuestion;
            //viewModel.SecondarySecurityQuestion = user.SecondarySecurityQuestion;

            return Ok(viewModel);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("answersecurityquestions")]
        public async Task<IHttpActionResult> AnswerSecurityQuestions(AnswerSecurityQuestionsBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _UserManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                ModelState.AddModelError("Email", Resources.UserDoesNotExist);
                return BadRequest(ModelState);
            }

            if (await _UserManager.IsLockedOutAsync(user.Id))
            {
                ModelState.AddModelError("Email", Resources.AccountLockedOut);
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
            {
                await _UserManager.AccessFailedAsync(user.Id);
                return BadRequest(ModelState);
            }

            var removeResult = await _UserManager.RemovePasswordAsync(user.Id);
            if (!removeResult.Succeeded)
            {
                ModelState.AddModelError("Password", Resources.PasswordNotRemoved);
            }

            var addResult = await _UserManager.AddPasswordAsync(user.Id, model.Password);
            if (!addResult.Succeeded)
            {
                ModelState.AddModelError("Password", Resources.PasswordNotAdded);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var signInManager = new SignInManager<SequenceUser, string>(_UserManager, _authenticationManager))
            {
                var status = await signInManager.PasswordSignInAsync(model.Email, model.Password, true, true);
            }

            return Ok();
        }

        [AllowAnonymous]
        [Route("register")]
        [HttpPost]
        public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new SequenceUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = model.Email,
                Email = model.Email,
            };

            IdentityResult result = await _UserManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            _UserManager.AddToRole(user.Id, "Instructor");
            _UserManager.AddClaim(user.Id, new Claim(ClaimTypes.GivenName, model.GivenName));
            _UserManager.AddClaim(user.Id, new Claim(ClaimTypes.Surname, model.Surname));

            using (var manager = new SignInManager<SequenceUser, string>(_UserManager, _authenticationManager))
            {
                manager.SignIn(user, false, false);
            }

            return Ok();
        }

        [Route("updatepersonaldetails")]
        [HttpPut]
        public async Task<IHttpActionResult> UpdatePersonalDetails(UpdatePersonalDetailsBindingModel model)
        {
            string userId = User.Identity.GetUserId();

            SequenceUser user = _UserManager.FindById(userId);

            user.Email = model.Email;
            user.UserName = model.Email;
            var identity = User.Identity as ClaimsIdentity;
            Claim givenNameClaim = identity.FindFirst(ClaimTypes.GivenName);
            Claim surnameClaim = identity.FindFirst(ClaimTypes.Surname);

            ICollection<IdentityUserClaim> claims = user.Claims;
            user.Claims.SingleOrDefault(c => c.ClaimType == ClaimTypes.GivenName).ClaimValue = model.GivenName;
            user.Claims.SingleOrDefault(c => c.ClaimType == ClaimTypes.Surname).ClaimValue = model.Surname;
            var result = await _UserManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }
            else
            {
                var newIdentity = await _UserManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
                _authenticationManager.SignIn(newIdentity);
            }

            return Ok();
        }

        [Route("updatesecurityquestions")]
        [HttpPut]
        public IHttpActionResult UpdateSecurityQuestions(UpdateSecurityQuestionsBindingModel model)
        {
            string userId = User.Identity.GetUserId();

            SequenceUser user = _UserManager.FindById(userId);

            _UserManager.Update(user);

            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _UserManager != null)
            {
                _UserManager.Dispose();
                _UserManager = null;
            }

            base.Dispose(disposing);
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
    }
}
