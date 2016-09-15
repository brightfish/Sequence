using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data.Entities
{
    public class Permission
    {
        [Key]
        public long Id { get; set; }

        public bool Read { get; set; }

        public bool Write { get; set; }

        public bool Delete { get; set; }

        public bool Grant { get; set; }

        public Guid Object { get; set; }
    }
}
