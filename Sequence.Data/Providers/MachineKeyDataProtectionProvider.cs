using Microsoft.Owin.Security.DataProtection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;

namespace Application.Data
{
    public class MachineKeyDataProtectionProvider : IDataProtectionProvider
    {
        public IDataProtector Create(params string[] purposes)
        {
            return new MachineKeyDataProtector(purposes);
        }

        private class MachineKeyDataProtector : IDataProtector
        {
            private string[] _purposes;

            public MachineKeyDataProtector(params string[] purposes)
            {
                _purposes = purposes;
            }



            public byte[] Protect(byte[] userData)
            {
                return MachineKey.Protect(userData, _purposes);
            }

            public byte[] Unprotect(byte[] protectedData)
            {
                return MachineKey.Unprotect(protectedData, _purposes);
            }
        }
    }

}
