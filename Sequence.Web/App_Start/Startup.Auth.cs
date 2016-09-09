using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Microsoft.Owin.Security.OAuth;
using Owin;
using Application.Web.Models;
using Application.Data;

namespace Application.Web
{
    public partial class Startup
    {
        public void ConfigureAuth(IAppBuilder app)
        {
            app.CreatePerOwinContext(SequenceContext.Create);
            app.CreatePerOwinContext<SequenceUserManager>(SequenceUserManager.Create);

            app.UseCookieAuthentication(new CookieAuthenticationOptions());
        }
    }
}
