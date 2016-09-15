using Application.Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data.Entities
{
    public class Sequence
    {
        [Key]
        public int Id { get; set; }

        public int Verion { get; set; }

        public string Name { get; set; }

        public virtual ICollection<Action> Actions { get; set; }

        public virtual ICollection<SequenceState> SequenceStates { get; set; }

        [Index]
        public Guid Signature { get; set; }

        public Sequence()
        {
            Actions = new List<Action>();
        }
    }
}
