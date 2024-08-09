using AutoMapper;
using Enwage.Dto;
using Enwage.Interface;
using Enwage.Models;
using Enwage.Properties.Services;
using Enwage.Repository;
using Enwage.UnitofWork;
using Microsoft.AspNetCore.Mvc;

namespace Enwage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : Controller
    {
        public readonly IEmployeeService _employeeService;
        public readonly IMapper _mapper;
        public EmployeeController(IEmployeeService employeeService, IMapper mapper)
        {
            _employeeService = employeeService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<bool>> CreateEmployee(CreateEmployeeDto createEmployeeDto)
        {
            if (createEmployeeDto == null)
            {
                return BadRequest("Employee data is null.");
            }

            var result = await _employeeService.CreateEmployeeAsync(createEmployeeDto);

            return result;
            //return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<CreateEmployeeDto>> GetEmployee(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid employee ID.");
            }

            var employee = await _employeeService.GetEmployeeByIdAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }


        [HttpDelete("{id}")]
        [ProducesResponseType(204, Type = typeof(bool))]

        public async Task<IActionResult> DeleteEmployee(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid employee ID.");
            }

            var result = await _employeeService.DeleteEmployeeAsync(id);

            if (result)
            {
                return NoContent(); // 204 No Content
            }

            return NotFound(); // 404 Not Found

        }


        [HttpPut]

        public async Task<ActionResult> UpdateEmployee([FromBody] CreateEmployeeDto updateEmployeeDto)
        {
            
            var updated = await _employeeService.UpdateEmployeeAsync(updateEmployeeDto);
            if (!updated)
            {
                ModelState.AddModelError("", "Something went wrong while updating the employee");
                return StatusCode(500, ModelState);
            }
   ;

            return Ok(updated);
        }



        //[HttpGet("{pageNumber}/{pageRows}")]
        //[ProducesResponseType(200, Type = typeof(IEnumerable<EmployeeDto>))]
        //[ProducesResponseType(422)]
        //public async Task<IActionResult> GetAllEmployees(int pageNumber, int pageRows)
        //{
        //    if (pageNumber <= 0 || pageRows <= 0)
        //    {
        //        ModelState.AddModelError("", "Invalid Input");
        //        return StatusCode(422, ModelState);
        //    }

        //    var employees = await _employeeService.GetAllEmployeesAsync(pageNumber, pageRows);
        //    var mappedData = _mapper.Map<List<EmployeeDto>>(employees);

        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    return Ok(mappedData);
        //}
        [HttpGet("{pageNumber}/{pageSize}")]

        public async Task<IActionResult> GetAllEmployees(int pageNumber, int pageSize, string? searchQuery = null, string? sortBy = null, string? sortOrder = null)

        {

            if (pageNumber < 1 || pageSize < 1)

            {

                ModelState.AddModelError("", "Invalid page number or page size");

                return StatusCode(422, ModelState);

            }
            
            var response = await _employeeService.GetAllEmployees(pageNumber, pageSize, searchQuery, sortBy, sortOrder);

            return Ok(response);

        }

    }
}
