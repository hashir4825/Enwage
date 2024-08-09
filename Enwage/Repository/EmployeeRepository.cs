using AutoMapper;
using Enwage.Dto;
using Enwage.Interface;
using Enwage.Models;
using Microsoft.EntityFrameworkCore;

namespace Enwage.Repository
{
    public class EmployeeRepository : GenericRepository<Employee> , IEmployee
    {
        //public readonly EnwageContext enwageContext;
        //public readonly IMapper _mapper;
        public EmployeeRepository(EnwageContext context ) : base(context) {
        
            //_mapper = mapper;   
        }

 

        public async Task<Employee> GetEmployeeByIdAsync(int id)
        {
            // Check if the ID is valid
            if (id <= 0)
            {
                throw new ArgumentException("Invalid employee ID.", nameof(id));
            }

            // Fetch the employee including related entities if needed
              var a = await _dbSet
                .Include(e => e.Attachments) // Include related entities if needed
                .Include(e => e.Employeestates)
                .Include(e => e.Client)
                .FirstOrDefaultAsync(e => e.Id == id);

            
            return a;
            //return _mapper.Map<EmployeeDto>(employee);
        }


        //public void detachstate(Employee myemployee)
        //{
        //    _dbSet.Entry(myemployee).State = EntityState.Detached;
        //}
        public void UpdateX(Employee employee)
    {
        _dbSet.Update(employee);
        //await _context.SaveChangesAsync();
    }



        public int GetTotalEmployeesCount()
        {
            return _dbSet.Count();
        }

        //public async Task<ICollection<Employee>> GetAllEmployees(int pageNumber, int pageRows)
        //{
        //    // Calculate the number of rows to skip
        //    int skip = (pageNumber - 1) * pageRows;

        //    // Fetch the required rows for the given page without ordering
            
        //    return await _dbSet
        //        .Include(cli => cli.Client)
        //        .AsQueryable()
        //        .Skip(skip)
        //        .Take(pageRows)
        //        .ToListAsync();
        //}

        public async Task<List<Employee>> GetAllEmployees(int pageNumber, int pageSize, string? searchQuery = null, string? sortBy = null, string? sortOrder = null)

        {

            int toBeMissed = pageSize * (pageNumber - 1);

            var query = _dbSet.Include(cli => cli.Client).AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchQuery))

            {

                query = query.Where(e => e.Name.Contains(searchQuery) || e.Email.Contains(searchQuery) || e.Client.Name.Contains(searchQuery));

            }

            if (!string.IsNullOrWhiteSpace(sortBy))

            {

                if (sortOrder?.ToLower() == "desc")

                {

                    query = query.OrderByDescending(e => EF.Property<object>(e, sortBy));

                }

                else

                {

                    query = query.OrderBy(e => EF.Property<object>(e, sortBy));

                }

            }

            else

            {

                query = query.OrderBy(e => e.Id);

            }

            return await query.Skip(toBeMissed).Take(pageSize).ToListAsync();

        }

        public async Task<int> CountTotalEmployees(string? searchQuery = null)

        {

            var query = _dbSet.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchQuery))

            {

                query = query.Where(e => e.Name.Contains(searchQuery) || e.Email.Contains(searchQuery) || e.Client.Name.Contains(searchQuery));

            }

            return await query.CountAsync();

        }

    }

}
