using Enwage.Models;

namespace Enwage.Dto
{
    public class UpdateDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime Dob { get; set; }
        public DateTime Experiencestart { get; set; }
        public DateTime Experienceend { get; set; }
        public string Yearsofexperience { get; set; } = null!;
        public decimal Rate { get; set; }
        public bool RateFlag { get; set; }
        public string? Gender { get; set; }
        public int ClientId { get; set; }

        public virtual Client Client { get; set; } = null!;
        public virtual ICollection<AttachmentDto> Attachments { get; set; }
        public virtual ICollection<EmployeeStateDto> Employeestates { get; set; }
    }
}
