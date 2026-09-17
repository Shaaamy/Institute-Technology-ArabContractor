using AutoMapper;
using Institute.API.Helpers;
using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Application.Security;
using Institute.Domain.Entities;
using Institute.Domain.specifications.BookSpec;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    //[HasPermission("Books")]
    [Route("api/admin/[controller]")]
    [ApiController]
    public class AdminBookController : ControllerBase
    {
        private readonly IReadOnlyService<Book> _bookService;
        private readonly IMapper _mapper;
        private readonly IRepository<Book> _repo;
        private readonly IBookService _service;


        public AdminBookController(IReadOnlyService<Book> bookService, IMapper mapper, IRepository<Book> repository, IBookService service)
        {
            _bookService = bookService;
            _service = service;
            _mapper = mapper;
            _repo = repository;
        }


        // ================= GET ALL =================
        [HttpGet]
        public async Task<ActionResult<Pagination<BookDto>>> GetAll([FromQuery] BookSpecParams param)
        {
            var spec = new Book_LoadNafigationProperty(param);
            var countSpec = new BooksWithFiltersForCountSpec(param);

            var totalItems = await _repo.CountWithSpecAsync(countSpec);

            var books = await _repo.GetAllWithSpecAsync(spec);

            var data = books.Select(x => new BookDto
            {
                BookId = x.BookId,
                BookName = x.BookName,
                Author = x.Author,
                BookDate = x.BookDate,
                TypeId = x.TypeId,
                TypeName = x.BooksType?.TypeName
            }).ToList();

            return Ok(new Pagination<BookDto>(
                param.PageIndex,
                param.PageSize,
                totalItems,
                data
            ));
        }




        // ================= GET BY ID =================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var book = await _service.GetByIdAsync(id);

            if (book == null)
                return NotFound();

            return Ok(book);
        }

        // ================= CREATE =================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _service.CreateAsync(dto);

            return Ok(result);
        }

        // ================= UPDATE =================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateBookDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _service.UpdateAsync(id, dto);

            if (!updated)
                return NotFound();

            return Ok("Updated successfully");
        }

        // ================= DELETE =================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound();

            return Ok("Deleted successfully");
        }
    }
}
