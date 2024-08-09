using Enwage.Dto;
using Enwage.Models;

namespace Enwage.Properties.Services
{
    public interface IEmployeeService
    {

        //Task<ICollection<Employee>> GetAllEmployeesAsync(int pageNumber, int pageRows);

        public Task<bool> CreateEmployeeAsync(CreateEmployeeDto createEmployeeDto);

        public Task<CreateEmployeeDto> GetEmployeeByIdAsync(int id);

        Task<bool> DeleteEmployeeAsync(int id); // Add this line

        public Task<bool> UpdateEmployeeAsync(CreateEmployeeDto createEmployeeDto);

        public Task<AllEmployeeResponseDto> GetAllEmployees(int pageNumber, int pageSize, string? searchQuery = null, string? sortBy = null, string? sortOrder = null);



        //public Task<Employee> GetEmployeeByIdAsync(int id);



    }
}
