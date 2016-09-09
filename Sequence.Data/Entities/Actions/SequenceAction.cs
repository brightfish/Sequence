using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data.Entities.Actions
{
    public class SequenceAction
    {
        public ulong Id { get; set; }
        public Sequence Sequence { get; set; }
        public Sequence Target { get; set; }
    }
}
