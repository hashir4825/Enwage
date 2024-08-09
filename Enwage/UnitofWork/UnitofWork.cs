using Enwage.Models;
using Enwage.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Enwage.UnitofWork
{
    public class UnitofWork : IUnitofWork
    {
        protected readonly EnwageContext _dbContext;


        public EmployeeRepository _employeeRepository { get; }
        public EmployeestatesRepository _employeestatesRepository { get; }
        public AttachmentRepository _attachmentRepository { get; }
        public ClientRepository _clientRepository { get; }
        public StateRepository _stateRepository { get; }


        public UnitofWork(EnwageContext dbContext)
        {
            _dbContext = dbContext;
            _employeeRepository = new EmployeeRepository(_dbContext);
            _employeestatesRepository = new EmployeestatesRepository(_dbContext);
            _attachmentRepository = new AttachmentRepository(_dbContext);
            _clientRepository = new ClientRepository(_dbContext);
            _stateRepository = new StateRepository(_dbContext);

        }

        public bool save()
        {
           return  _dbContext.SaveChanges() > 0;

        }



    }
}
