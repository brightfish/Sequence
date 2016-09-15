using Application.Data.Entities;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data.Managers
{
    public class SequenceRoleManager : RoleManager<SequenceRole>
    {
        public SequenceRoleManager(SequenceRoleStore roleStore)
            : base(roleStore)
        {

        }
    }
}
