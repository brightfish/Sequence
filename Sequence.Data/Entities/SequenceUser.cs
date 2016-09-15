using Application.Data.Entities;
using Application.Data.Managers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data
{
    public class SequenceUser : IdentityUser<string, IdentityUserLogin, IdentityUserRole, IdentityUserClaim>
    {
        [Index]
        public Guid Signature { get; set; }

        public ICollection<Sequence> Sequences { get; set; }

        public SequenceUser()
        {
            Sequences = new List<Sequence>();
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(SequenceUserManager manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }
    }
}
