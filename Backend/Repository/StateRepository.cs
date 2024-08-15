using Enwage.Models;

namespace Enwage.Repository
{
    public class StateRepository : GenericRepository<State>
    {
        public StateRepository(EnwageContext context) : base(context) { }
    }

}