namespace Enwage.Dto
{
    public class CreateEmployeeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime Dob { get; set; }
        public DateTime Experiencestart { get; set; }
        public DateTime Experienceend { get; set; }
        public string YearsOfExperience { get; set; } = null!;
        public decimal Rate { get; set; }
        public bool RateFlag { get; set; }
        public string? Gender { get; set; }
        public int ClientId { get; set; }
        public List<EmployeeStateDto> Employeestates { get; set; }
        public List<AttachmentDto>? Attachments { get; set; }
    }


}
