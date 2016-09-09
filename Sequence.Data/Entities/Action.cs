using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data.Entities
{
    public class Action
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }
        public Types Type { get; set; }
        public string Value { get; set; }

        public enum Types
        {
            AddContact,
            Voice,
            Email,
            Text,
            Skype,
            Alert,
            Delay,
            Custom,
            Calendar,
            Decision,
            Sequence,
            Trigger
        }
    }
}
