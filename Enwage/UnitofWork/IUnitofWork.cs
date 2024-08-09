using Enwage.Repository;

namespace Enwage.UnitofWork
{
    public interface IUnitofWork
    {
        public EmployeeRepository _employeeRepository { get; }
        public EmployeestatesRepository _employeestatesRepository { get;  }
        public AttachmentRepository _attachmentRepository { get; }
        public ClientRepository _clientRepository { get; }
        public StateRepository _stateRepository { get; }
        public bool save();

    }
}
