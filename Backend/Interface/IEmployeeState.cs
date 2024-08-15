using Enwage.Models;

namespace Enwage.Interface
{
    public interface IEmployeeState
    {
        public Task<Employee> RemoveEmployeeState(Employee myemployee);
    }
}
