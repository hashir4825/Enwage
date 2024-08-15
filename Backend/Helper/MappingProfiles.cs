using AutoMapper;
using Enwage.Dto;
using Enwage.Models;

namespace Enwage.Helper
{
    public class MappingProfiles : Profile 
    {
        public MappingProfiles()
        {
            CreateMap<Client, ClientDto>();
            CreateMap<Employee, EmployeeDto>()
            .ForMember(dest => dest.ClientName, opt => opt.MapFrom(src => src.Client.Name));


            // Mapping for EmployeeDto to Employee
            CreateMap<CreateEmployeeDto, Employee>().ReverseMap();

            // Mapping for Attachment
            CreateMap<Attachment, AttachmentDto>()
                .ForMember(dest => dest.BaseCode, opt => opt.MapFrom(src => Convert.ToBase64String(src.Basecode)));

            // Mapping for AttachmentDto to Attachment
            CreateMap<AttachmentDto, Attachment>()
                .ForMember(dest => dest.Basecode, opt => opt.MapFrom(src => src.GetBasecodeAsBytes()));

            CreateMap<StateDto, State>().ReverseMap();

            CreateMap<EmployeeStateDto, Employeestate>().ReverseMap();
        


    }
}
}
