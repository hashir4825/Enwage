using Enwage.Models;

namespace Enwage.Dto
{
    public class EmployeeDto
    {

        public int Id { get; set; }

        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;

        public string Yearsofexperience { get; set; } = null!;
        public decimal Rate { get; set; }
        public string? Gender { get; set; }

        public string ClientName{ get; set; } = null!;

        public bool RateFlag { get; set; }


    }
}
