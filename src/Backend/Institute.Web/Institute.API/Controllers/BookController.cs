using AutoMapper;
using Institute.API.DTOs;
using Institute.API.Helpers;
using Institute.Application.Interfaces;
using Institute.Domain.Entities;
using Institute.Domain.specifications.BookSpec;
using Institute.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
           // In your controller
       
            private readonly IReadOnlyService<Book> _bookService;
        private readonly IMapper _mapper;
        private readonly IRepository<Book> _repository;

        public BookController(IReadOnlyService<Book> bookService, IMapper mapper, IRepository<Book> repository)
            {
                _bookService = bookService;
            
                _mapper = mapper;
                _repository = repository;
            }

        [HttpGet("getAllBooks")]
        public async Task<ActionResult<Pagination<BookResponseDto>>> GetAllBooks(
    [FromQuery] BookSpecParams bookParams)
        {
            var spec = new Book_LoadNafigationProperty(bookParams);
            var books = await _bookService.GetAllWithSpec(spec);

            var data = _mapper.Map<IReadOnlyList<Book>, IReadOnlyList<BookResponseDto>>(books);

            var countSpec = new Book_LoadNafigationProperty(bookParams, true);
            var count = await _repository.GetCountAsync(countSpec);

            return Ok(new Pagination<BookResponseDto>(
                bookParams.PageIndex,
                bookParams.PageSize,
                count,
                data
            ));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(int id)
        {
            var spec = new Book_LoadNafigationProperty(new BookSpecParams
            {
                PageIndex = 1,
                PageSize = 1,
                Search = null
            });

            var book = await _bookService.GetEntityWithSpec(spec);

            var bookDto = _mapper.Map<BookResponseDto>(book);
            return Ok(bookDto);
        }


    }
}
