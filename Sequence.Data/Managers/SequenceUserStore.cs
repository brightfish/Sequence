using Application.Data.Entities;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data.Managers
{
    public class SequenceUserStore : UserStore<SequenceUser, SequenceRole, string, IdentityUserLogin, IdentityUserRole, IdentityUserClaim>
    {
        public SequenceUserStore(SequenceContext context)
            : base(context)
        {

        }
    }
}
