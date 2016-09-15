using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace Application.Web
{
    [RoutePrefix("api/session")]
    [Authorize]
    public class SessionController : ApiController
    {
        private IAuthenticationManager _authenticationManager
        {
            get
            {
                return HttpContext.Current.GetOwinContext().Authentication;
            }
        }

        [Route("extend")]
        [HttpPost]
        public IHttpActionResult Extend()
        {
            return Ok();
        }

        [Route("end")]
        [HttpPost]
        public IHttpActionResult End()
        {
            _authenticationManager.SignOut();
            return Ok();
        }

        [AllowAnonymous]
        [Route("test")]
        [HttpGet]
        public IHttpActionResult Result()
        {
            HttpResponseMessage message = new HttpResponseMessage();

            message.Headers.AddCookies(new List<CookieHeaderValue>() { new CookieHeaderValue("Test", "Value") { Expires = DateTime.UtcNow.AddDays(-1) } });

            return ResponseMessage(message);
        }
    }
}
