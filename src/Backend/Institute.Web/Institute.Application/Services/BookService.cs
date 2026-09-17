using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications;
using Institute.Domain.specifications.BookSpec;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class BookService : IBookService
    {
        private readonly IRepository<Book> _repo;

        public BookService(IRepository<Book> repo)
        {
            _repo = repo;
        }

        //// ===================== GET ALL =====================
        //public async Task<List<BookDto>> GetAllAsync(BookSpecParams param)
        //{
        //    var spec = new BooksWithFiltersForCountSpec(param);
        //    var countSpec = new Book_LoadNafigationProperty(param);

        //    var totalItems = await _repo.CountWithSpecAsync(countSpec);

        //    var books = await _repo.GetAllWithSpecAsync(spec);

        //    var data = books.Select(b => new BookDto
        //    {
        //        BookId = b.BookId,
        //        BookName = b.BookName,
        //        Author = b.Author,
        //        BookDate = b.BookDate,
        //        TypeId = b.TypeId,
        //        TypeName = b.BooksType?.TypeName
        //    }).ToList();

        //    return data;
        //}

        // ===================== GET BY ID =====================
        public async Task<BookDto?> GetByIdAsync(int id)
        {
            var book = await _repo.GetByIdWithSpecAsync(
                new BaseSpecification<Book>(b => b.BookId == id) { Includes = { b => b.BooksType } });

            if (book == null) return null;

            return new BookDto
            {
                BookId = book.BookId,
                BookName = book.BookName,
                Author = book.Author,
                BookDate = book.BookDate,
                TypeId = book.TypeId,
                TypeName = book.BooksType?.TypeName
            };
        }

        // ===================== CREATE =====================
        public async Task<BookDto> CreateAsync(CreateBookDto dto)
        {
            var book = new Book
            {
                BookName = dto.BookName,
                Author = dto.Author,
                BookDate = dto.BookDate,
                TypeId = dto.TypeId
            };

            await _repo.AddAsync(book);
            await _repo.SaveChangesAsync();

            var createdBook = await _repo.GetByIdWithSpecAsync(
                new BaseSpecification<Book>(b => b.BookId == book.BookId) { Includes = { b => b.BooksType } });

            return new BookDto
            {
                BookId = createdBook.BookId,
                BookName = createdBook.BookName,
                Author = createdBook.Author,
                BookDate = createdBook.BookDate,
                TypeId = createdBook.TypeId,
                TypeName = createdBook.BooksType?.TypeName
            };
        }

        // ===================== UPDATE =====================
        public async Task<bool> UpdateAsync(int id, UpdateBookDto dto)
        {
            var book = await _repo.GetByIdAsync(id);

            if (book == null)
                return false;

            book.BookName = dto.BookName;
            book.Author = dto.Author;
            book.BookDate = dto.BookDate;
            book.TypeId = dto.TypeId;

            _repo.Update(book);
            await _repo.SaveChangesAsync();

            return true;
        }

        // ===================== DELETE =====================
        public async Task<bool> DeleteAsync(int id)
        {
            var book = await _repo.GetByIdAsync(id);

            if (book == null)
                return false;

            _repo.Delete(book);
            await _repo.SaveChangesAsync();

            return true;
        }

        
    }
}
