using Enwage.Dto;
using Enwage.Interface;
using Enwage.Models;
using Microsoft.EntityFrameworkCore;

namespace Enwage.Repository
{
    public class EmployeestatesRepository : GenericRepository<Employeestate> , IEmployeeState
    {
        private readonly EnwageContext dbContext;
        public EmployeestatesRepository(EnwageContext context) : base(context)
        {
            dbContext = context;
        }
        public async Task<Employee> RemoveEmployeeState(Employee myemployee)
        {
            dbContext.RemoveRange(myemployee.Employeestates);
            await _context.SaveChangesAsync(); // Save changes after removing
            return myemployee;
        }
    }
}
