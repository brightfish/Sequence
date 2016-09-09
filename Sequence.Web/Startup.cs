using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;
using Microsoft.AspNet.Identity;
using System.Data.Entity;
using Application.Data;
using Microsoft.AspNet.Identity.EntityFramework;
using SimpleInjector.Extensions;
using SimpleInjector;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security.DataProtection;
using Application.Web.General;
using System.Web.Http;

[assembly: OwinStartup(typeof(Application.Web.Startup))]

namespace Application.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder builder)
        {
            ConfigureAuth(builder);
            var configuration = new HttpConfiguration();
            ConfigureInjection(builder, configuration);
            WebApiConfig.Register(configuration);

            builder.UseWebApi(configuration);
        }

        protected virtual Container ConfigureInjection(IAppBuilder builder, HttpConfiguration configuration)
        {
            var container = new Container();

            container.RegisterWebApiRequest<IUserTokenProvider<SequenceUser, string>>(() => new DataProtectorTokenProvider<SequenceUser, string>(builder.GetDataProtectionProvider().Create("UserTokenPurpose")));
            container.RegisterWebApiRequest<DbContext>(() => new SequenceContext());
            container.RegisterWebApiRequest<SequenceContext>(() => new SequenceContext());
            container.RegisterWebApiRequest<IUserStore<SequenceUser, string>, UserStore<SequenceUser, IdentityRole, string, IdentityUserLogin, IdentityUserRole, IdentityUserClaim>>();
            container.RegisterWebApiRequest<SequenceUserManager>();
            container.RegisterWebApiRequest<Func<string, IIdentityMessageService>>(() => (email) => new GenericEmailService(email));

            container.RegisterWebApiRequest<IRoleStore<IdentityRole, string>>(() => new RoleStore<IdentityRole>());
            container.RegisterWebApiRequest<RoleManager<IdentityRole>>();
            
            container.RegisterWebApiControllers(configuration);
            configuration.DependencyResolver = new SimpleInjector.Integration.WebApi.SimpleInjectorWebApiDependencyResolver(container);
            container.Verify();

            return container;
        }
    }
}


