using Enwage.Models;

namespace Enwage.Interface
{
    public interface IEmployee
    {
        //Task<ICollection<Employee>> GetAllEmployees(int pageNumber, int pageRows);

        public Task<Employee> GetEmployeeByIdAsync(int id);

        public int GetTotalEmployeesCount();

        public void UpdateX(Employee employee);

        public Task<List<Employee>> GetAllEmployees(int pageNumber, int pageSize, string? searchQuery = null, string? sortBy = null, string? sortOrder = null);

        public Task<int> CountTotalEmployees(string? searchQuery = null);


    }
}
