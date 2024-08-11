using AutoMapper;
using Enwage.Dto;
using Enwage.Interface;
using Enwage.Models;
using Enwage.Repository;
using Enwage.UnitofWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Enwage.Properties.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IUnitofWork _unitofWork;
        private readonly IMapper _mapper;

        public EmployeeService(IUnitofWork unitofWork, IMapper mapper)
        {
            _unitofWork = unitofWork;
            _mapper = mapper;
        }


        //public async Task<ICollection<Employee>> GetAllEmployeesAsync(int pageNumber, int pageRows)
        //{
        //    return await _unitofWork._employeeRepository.GetAllEmployees(pageNumber, pageRows);
        //}
        public async Task<bool> CreateEmployeeAsync(CreateEmployeeDto createEmployeeDto)
        {
            var employee = _mapper.Map<Employee>(createEmployeeDto);

            try
            {
                var createdEmployee = await _unitofWork._employeeRepository.CreateAsync(employee);
               var result = _unitofWork.save();
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> UpdateEmployeeAsync(CreateEmployeeDto updateEmployeeDto)
        {
            try
            {
                // Retrieve the existing employee
                var existingEmployee = await _unitofWork._employeeRepository.GetEmployeeByIdAsync(updateEmployeeDto.Id);

                if (existingEmployee == null)
                {
                    return false; // Or throw an exception based on your needs
                }

                // Remove related entities
                var removedStatesEmployee = await _unitofWork._employeestatesRepository.RemoveEmployeeState(existingEmployee);
                var removedEmployee = await _unitofWork._attachmentRepository.RemoveEmployeeAttachment(removedStatesEmployee);

                // Map the updated employee details
                var updatedEmployee = _mapper.Map(updateEmployeeDto, existingEmployee);

                // Update the employee
                _unitofWork._employeeRepository.UpdateAsync(updatedEmployee);
           var result  =   _unitofWork.save();

                // Return the updated employee
                return result;
            }
            catch (Exception)
            {
                throw; // Re-throw the exception
            }
        }

        public async Task<CreateEmployeeDto> GetEmployeeByIdAsync(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentException("Invalid employee ID.", nameof(id));
            }

            var employee = await _unitofWork._employeeRepository.GetEmployeeByIdAsync(id);
            return _mapper.Map<CreateEmployeeDto>(employee);
        }

        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            try
            {
                var deletedEmployee = await _unitofWork._employeeRepository.DeleteAsync(id);
                _unitofWork.save();
                return deletedEmployee;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<AllEmployeeResponseDto> GetAllEmployees(int pageNumber, int pageSize, string? searchQuery = null, string? sortBy = null, string? sortOrder = null)
        {
            var employees = await _unitofWork._employeeRepository.GetAllEmployees(pageNumber, pageSize, searchQuery, sortBy, sortOrder);
            var mappedEmployees = _mapper.Map<List<EmployeeDto>>(employees);
            var count = await _unitofWork._employeeRepository.CountTotalEmployees(searchQuery);
            var responseDto = new AllEmployeeResponseDto
            {
                Employees = mappedEmployees,
                totalNumberOfRows = count
            };
            return responseDto;
        }

        public async Task UpdateEmployeeStateCountsAsync()
        {
            try
            {
                await _unitofWork._employeeRepository.UpdateEmployeeStateCountsAsync();
            }
            catch (Exception ex)
            {
                // Handle or log the exception as needed
                throw new ApplicationException("An error occurred while updating employee state counts.", ex);
            }
        }

    }
}
