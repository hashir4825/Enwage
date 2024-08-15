using AutoMapper;
using Enwage.Dto;
using Enwage.Interface;
using Enwage.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

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

        //public async Task<List<Employee>> GetAllEmployees(int pageNumber, int pageSize, string? searchQuery = null, string? sortBy = null, string? sortOrder = null)
        //{
        //    int toBeMissed = pageSize * (pageNumber - 1);

        //    int no_of_states;



        //    // Convert searchQuery to lowercase if it's not null or whitespace
        //    var lowerSearchQuery = searchQuery?.ToLower();

        //    var query = _dbSet.Include(cli => cli.Client).AsQueryable();

        //    if (!string.IsNullOrWhiteSpace(lowerSearchQuery))
        //    {
        //        // Use ToLower() on the fields to make the search case-insensitive
        //        query = query.Where(e =>
        //            e.Name.ToLower().Contains(lowerSearchQuery) ||
        //            e.Email.ToLower().Contains(lowerSearchQuery) ||
        //            e.Client.Name.ToLower().Contains(lowerSearchQuery));
        //    }

        //    if (!string.IsNullOrWhiteSpace(sortBy))
        //    {
        //        if (sortOrder?.ToLower() == "desc")
        //        {
        //            query = query.OrderByDescending(e => EF.Property<object>(e, sortBy));
        //        }
        //        else
        //        {
        //            query = query.OrderBy(e => EF.Property<object>(e, sortBy));
        //        }
        //    }
        //    else
        //    {
        //        query = query.OrderBy(e => e.Id);
        //    }

        //    return await query.Skip(toBeMissed).Take(pageSize).ToListAsync();
        //}


        //public async Task<List<Employee>> GetAllEmployees(int pageNumber, int pageSize, string? searchQuery = null, string? sortBy = null, string? sortOrder = null)
        //{
        //    int toBeMissed = pageSize * (pageNumber - 1);

        //    // Convert searchQuery to lowercase if it's not null or whitespace
        //    var lowerSearchQuery = searchQuery?.ToLower();

        //    // Query to get the base employee data
        //    var query = _dbSet
        //        .Include(e => e.Client) // Include related Client data
        //        .Include(e => e.Attachments) // Include related Attachment data
        //        .AsQueryable();

        //    if (!string.IsNullOrWhiteSpace(lowerSearchQuery))
        //    {
        //        query = query.Where(e =>
        //            e.Name.ToLower().Contains(lowerSearchQuery) ||
        //            e.Email.ToLower().Contains(lowerSearchQuery) ||
        //            e.Client.Name.ToLower().Contains(lowerSearchQuery));
        //    }

        //    if (!string.IsNullOrWhiteSpace(sortBy))
        //    {
        //        if (sortOrder?.ToLower() == "desc")
        //        {
        //            query = query.OrderByDescending(e => EF.Property<object>(e, sortBy));
        //        }
        //        else
        //        {
        //            query = query.OrderBy(e => EF.Property<object>(e, sortBy));
        //        }
        //    }
        //    else
        //    {
        //        query = query.OrderBy(e => e.Id);
        //    }

        //    // Fetch the base employee data with pagination
        //    var employees = await query.Skip(toBeMissed).Take(pageSize).ToListAsync();

        //    // Get the count of states for each employee
        //    var employeeIds = employees.Select(e => e.Id).ToList();
        //    var statesCounts = _dbSet
        //        .Where(e => employeeIds.Contains(e.Id))
        //        .Select(e => new
        //        {
        //            EmployeeId = e.Id,
        //            NoOfStates = e.Employeestates.Count()
        //        })
        //        .ToDictionaryAsync(x => x.EmployeeId, x => x.NoOfStates);

        //    var statesCountsResult = await statesCounts;

        //    // Map the count of states back to the employees
        //    foreach (var employee in employees)
        //    {
        //        employee.NoOfStates = statesCountsResult.ContainsKey(employee.Id)
        //            ? statesCountsResult[employee.Id]
        //            : 0;
        //    }

        //    return employees;
        //}
        public async Task<List<Employee>> GetAllEmployees(int pageNumber, int pageSize, string? searchQuery = null, string? sortBy = null, string? sortOrder = null)
        {
            int toBeMissed = pageSize * (pageNumber - 1);

            // Convert searchQuery to lowercase if it's not null or whitespace
            var lowerSearchQuery = searchQuery?.ToLower();

            // Query to get employee data along with related attachments, client, and employeestates
            var query = _dbSet
                .Include(e => e.Client) // Include related Client data
                .Include(e => e.Attachments) // Include related Attachment data
                .Include(e => e.Employeestates) // Include related Employeestates data
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(lowerSearchQuery))
            {
                // Use ToLower() on the fields to make the search case-insensitive
                query = query.Where(e =>
                    e.Name.ToLower().Contains(lowerSearchQuery) ||
                    e.Email.ToLower().Contains(lowerSearchQuery) ||
                    e.Client.Name.ToLower().Contains(lowerSearchQuery));
            }

            // Apply sorting if specified
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

            // Fetch paginated results
            var employees = await query.Skip(toBeMissed).Take(pageSize).ToListAsync();

            // Map the results to include only NoOfStates in the response
            foreach (var employee in employees)
            {
                // Map NoOfStates to Employeestates.Count
                employee.NoOfStates = employee.Employeestates.Count;
            }

            return employees;
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

        public async Task UpdateEmployeeStateCountsAsync()
        {
            // Fetch all employees with their related states
            var employees = await _dbSet
                .Include(e => e.Employeestates)
                .ToListAsync();

            foreach (var employee in employees)
            {
                // Count the number of states
                int stateCount = employee.Employeestates.Count;

                // Update the employee's NoOfStates field
                employee.NoOfStates = stateCount;

                // Update the employee in the database
                _dbSet.Update(employee);
            }

            // Save changes to the database
            await _context.SaveChangesAsync();
        }


    }

}
