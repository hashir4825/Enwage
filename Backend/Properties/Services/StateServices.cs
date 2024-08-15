using Enwage.Models;
using Enwage.UnitofWork;

namespace Enwage.Properties.Services
{
    public class StateServices : IStateServices
    {
        public readonly IUnitofWork _unitofWork;
        public StateServices(IUnitofWork unitofWork)
        {
            _unitofWork = unitofWork;
        }
        public async Task<ICollection<State>> GetAllStates()
        {
            var states = await _unitofWork._stateRepository.GetAllAsync();
            _unitofWork.save();
            return states;
        }
    }
}
