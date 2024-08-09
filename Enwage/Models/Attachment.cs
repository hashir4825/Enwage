using System;
using System.Collections.Generic;

namespace Enwage.Models
{
    public partial class Attachment
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal? Size { get; set; }
        public string? Type { get; set; }
        public byte[]? Basecode { get; set; }
        public int? EmployeeId { get; set; }

        public virtual Employee? Employee { get; set; }
    }
}
