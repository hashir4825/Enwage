using AutoMapper;
using Enwage.Dto;
using Enwage.Models;
using Enwage.Properties.Services;
using Microsoft.AspNetCore.Mvc;

namespace Enwage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : Controller
    {
        public readonly IClientService _clientService;
        IMapper _mapper;
        public ClientController(IClientService clientService, IMapper mapper)
        {
            _clientService = clientService;
            _mapper = mapper;
            
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(ICollection<ClientDto>))]
        public async Task<ActionResult> GetAllClients()
        {
            var clients = await _clientService.GetAllClients();
            var mappedData = _mapper.Map<List<ClientDto>>(clients);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok(mappedData);
        }

    }
}
