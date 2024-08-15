using Enwage.Models;

namespace Enwage.Properties.Services
{
    public interface IClientService
    {
        public Task<ICollection<Client>> GetAllClients();
    }
}
