using Enwage.Models;
using Enwage.UnitofWork;

namespace Enwage.Properties.Services
{
    public class ClientServices : IClientService
    {
        public readonly IUnitofWork _unitofWork;
        public ClientServices(IUnitofWork unitofWork)
        {
            _unitofWork = unitofWork;
        }
       public async Task<ICollection<Client>> GetAllClients()
        {
             var clients =  await _unitofWork._clientRepository.GetAllAsync();
            _unitofWork.save();
            return clients;
        }
    }
}
