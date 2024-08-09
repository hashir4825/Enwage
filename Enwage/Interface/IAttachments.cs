using Enwage.Models;

namespace Enwage.Interface
{
    public interface IAttachments
    {
        public Task<Employee> RemoveEmployeeAttachment(Employee myemployee);

    }
}
