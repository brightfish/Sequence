using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;

namespace Application.Web.General
{
    public class GenericEmailService : IIdentityMessageService
    {
        private string _From { get; set; }

        public GenericEmailService(string from)
        {
            _From = from;
        }

        public async System.Threading.Tasks.Task SendAsync(IdentityMessage message)
        {
            using (var client = new SmtpClient())
            {
                var mail = new MailMessage(_From, message.Destination, message.Subject, message.Body);
                client.Send(mail);
            }

            await Task.FromResult(0);
        }
    }
}