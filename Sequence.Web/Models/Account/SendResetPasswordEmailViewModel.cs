namespace Application.Web.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    public class SendResetPasswordEmailViewModel
    {
        public string Name { get; set; }

        public string Email { get; set; }

        public string ResetUrl { get; set; }
    }
}