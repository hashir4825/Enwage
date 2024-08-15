using AutoMapper;
using Enwage.Dto;
using Enwage.Properties.Services;
using Microsoft.AspNetCore.Mvc;

namespace Enwage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StateController : Controller
    {
        public readonly IStateServices _stateService;
        IMapper _mapper;
        public StateController(IStateServices stateService , IMapper mapper)
        {
            _mapper = mapper;
            _stateService = stateService;
        }
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(ICollection<StateDto>))]
        public async Task<ActionResult> GetAllStates()
        {
            var states = await _stateService.GetAllStates();
            var mappedData = _mapper.Map<List<StateDto>>(states);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok(mappedData);
        }
    }
}
