using Enwage.Models;

namespace Enwage.Repository
{
    public class ClientRepository : GenericRepository<Client>
    {
        public ClientRepository(EnwageContext context) : base(context) { }


    }

}