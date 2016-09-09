using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data.Entities
{
    public class DelayAction
    {
        public TimeSpan TimeSpan { get; set; }
        public DateTime TimeOfDay { get; set; }
    }
}
