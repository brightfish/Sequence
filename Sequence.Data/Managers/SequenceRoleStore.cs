using Application.Data.Entities;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data.Managers
{
    public class SequenceRoleStore : RoleStore<SequenceRole, string, IdentityUserRole>
    {
        public SequenceRoleStore(SequenceContext context)
            : base(context)
        {

        }
    }
}
