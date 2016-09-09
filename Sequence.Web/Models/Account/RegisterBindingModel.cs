namespace Application.Web.Models
{
    using System.ComponentModel.DataAnnotations;

    public class RegisterBindingModel
    {
        [Required]
        [Display(Name = "First Name")]
        public string GivenName { get; set; }

        [Required]
        [Display(Name = "Last Name")]
        public string Surname { get; set; }

        [Required]
        [Display(Name = "Email")]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Display(Name = "Primary Security Question")]
        public string PrimarySecurityQuestion { get; set; }

        [Required]
        [Display(Name = "Primary Security Answer")]
        public string PrimarySecurityAnswer { get; set; }

        [Required]
        [Display(Name = "Secondary Security Question")]
        public string SecondarySecurityQuestion { get; set; }

        [Required]
        [Display(Name = "Secondary Security Answer")]
        public string SecondarySecurityAnswer { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
}