using Enwage.Models;

namespace Enwage.Properties.Services
{
    public interface IStateServices
    {
        public Task<ICollection<State>> GetAllStates();

    }
}
