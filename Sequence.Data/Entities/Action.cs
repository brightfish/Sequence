using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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

        [Index]
        public Guid Signature { get; set; }

        public enum Types
        {
            Input,
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
