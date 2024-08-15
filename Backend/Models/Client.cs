using System;
using System.Collections.Generic;

namespace Enwage.Models
{
    public partial class Client
    {
        public Client()
        {
            Employees = new HashSet<Employee>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<Employee> Employees { get; set; }
    }
}
