using Enwage.Dto;
using Enwage.Interface;
using Enwage.Models;
using Microsoft.EntityFrameworkCore;

namespace Enwage.Repository
{
    public class AttachmentRepository : GenericRepository<Attachment>, IAttachments
    {
        public AttachmentRepository(EnwageContext context) : base(context)
        {

        }
        
        public async Task<Employee> RemoveEmployeeAttachment(Employee myemployee)

        {
            _dbSet.RemoveRange(myemployee.Attachments);
            await _context.SaveChangesAsync(); // Save changes after removing
            return myemployee;
        }
    }
}
