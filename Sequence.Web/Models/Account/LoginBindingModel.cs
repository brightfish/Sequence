namespace Application.Web.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    public class LoginBindingModel
    {
        public string Email { get; set; }

        public string Password { get; set; }

        public bool Remember { get; set; }
    }
}