using System;
using System.Collections.Generic;

namespace Enwage.Models
{
    public partial class Employeestate
    {
        public int Id { get; set; }
        public int StateId { get; set; }
        public int EmployeeId { get; set; }

        public virtual Employee Employee { get; set; } = null!;
        public virtual State State { get; set; } = null!;
    }
}
