namespace Application.Web.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Web;

    public class GetSecurityQuestionsBindingModel
    {
        [Required]
        public string Email { get; set; }
    }
}