using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data
{
    public class SequenceUserManager : UserManager<SequenceUser, string>
    {
        public SequenceUserManager(IUserStore<SequenceUser, string> store)
            : base(store)
        {
        }

        public static SequenceUserManager Create(IdentityFactoryOptions<SequenceUserManager> options, IOwinContext context)
        {
            var manager = new SequenceUserManager(new UserStore<SequenceUser>(context.Get<SequenceContext>()));
            // Configure validation logic for usernames
            manager.UserValidator = new UserValidator<SequenceUser>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };
            // Configure validation logic for passwords
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = true,
            };
            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider = new DataProtectorTokenProvider<SequenceUser>(dataProtectionProvider.Create("ASP.NET Identity"));
            }
            return manager;
        }
    }
}
