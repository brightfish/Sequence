using Application.Data.Entities;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data
{
    public class SequenceUser : IdentityUser
    {
        public ICollection<Sequence> Sequences { get; set; }

        public SequenceUser()
        {
            Sequences = new List<Sequence>();
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<SequenceUser> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }
    }
}
