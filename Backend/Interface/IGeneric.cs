namespace Enwage.Interface
{
    public interface IGeneric<T> where T : class
    {
        public Task<T> CreateAsync(T entity);
        public Task UpdateAsync(T entity);
        public Task<bool> DeleteAsync(int id);

        public Task<ICollection<T>> GetAllAsync();
    }
}
