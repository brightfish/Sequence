namespace Application.Web.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    public class GetSecurityQuestionsViewModel
    {
        public string PrimarySecurityQuestion { get; set; }

        public string SecondarySecurityQuestion { get; set; }
    }
}