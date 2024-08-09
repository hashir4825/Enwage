namespace Enwage.Dto
{
    public class AllEmployeeResponseDto
    {
        public List<EmployeeDto> Employees { get; set; }

        public int totalNumberOfRows { get; set; }
    }
}
