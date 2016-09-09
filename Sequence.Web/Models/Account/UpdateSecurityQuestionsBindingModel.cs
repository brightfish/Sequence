namespace Application.Web.Models
{
    public class UpdateSecurityQuestionsBindingModel
    {
        public string PrimarySecurityQuestion { get; set; }

        public string SecondarySecurityQuestion { get; set; }

        public string PrimarySecurityAnswer { get; set; }

        public string SecondarySecurityAnswer { get; set; }
    }
}