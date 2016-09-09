using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data.Entities
{
    public class ExecutionContext
    {
        [Key]
        public int Id { get; set; }
        public int Index { get; set; }
        public Sequence Sequence { get; set; }
    }
}
