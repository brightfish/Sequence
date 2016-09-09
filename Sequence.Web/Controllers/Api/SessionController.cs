using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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
    }
}
