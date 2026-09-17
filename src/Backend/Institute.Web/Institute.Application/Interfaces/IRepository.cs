using Institute.Domain.Entities;
using Institute.Domain.specifications;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task SaveChangesAsync();
        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);

        Task<IReadOnlyList<T>> ListAsync(Ispecification<T> spec);
        Task<AppUser?> GetByClerkIdAsync(string clerkUserId);



        Task<T> GetByIdWithSpecAsync(Ispecification<T> spec);
        Task<IReadOnlyList<T>> GetAllWithSpecAsync(Ispecification<T> spec);

        Task<int> GetCountAsync(Ispecification<T> spec);
        Task<int> CountAsync();

        Task<int> CountWithSpecAsync(Ispecification<T> spec);
        // ── Transaction support (W1 / W5 fix) ───────────────────────
        Task<IDbContextTransaction> BeginTransactionAsync();

    }
}
