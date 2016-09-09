using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data.Entities.Actions
{
    public class EventAction
    {
        public Types Type { get; set; }

        public enum Types
        {
            OnCallEnded,
            OnEmail
        }
    }
}
