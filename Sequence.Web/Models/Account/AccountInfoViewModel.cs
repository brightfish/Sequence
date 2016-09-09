namespace Application.Web.Models
{
    using System.Collections.Generic;

    public class AccountInfoViewModel
    {
        public AccountInfoViewModel()
        {
            Roles = new HashSet<string>();
        }

        public bool IsAuthenticated { get; set; }

        public ICollection<string> Roles { get; set; }

        public string Email { get; set; }

        public string GivenName { get; set; }

        public string Surname { get; set; }
    }
}