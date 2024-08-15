using System;
using System.Collections.Generic;

namespace Enwage.Models
{
    public partial class State
    {
        public State()
        {
            Employeestates = new HashSet<Employeestate>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<Employeestate> Employeestates { get; set; }
    }
}
