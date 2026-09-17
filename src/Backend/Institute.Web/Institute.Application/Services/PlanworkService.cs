using Institute.Application.DTOs;
using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class PlanworkService : IPlanworkService
    {
        private readonly IRepository<Planwork> _repo;

        public PlanworkService(IRepository<Planwork> repo)
        {
            _repo = repo;
        }

        // ================= GET ALL =================
        public async Task<List<PlanworkDto>> GetAllAsync()
        {
            var data = await _repo.GetAllAsync();

            return data.Select(x => new PlanworkDto
            {
                ChildId = x.ChildId,
                ParentId = x.ParentId,
                ServiceTitle = x.ServiceTitle,
                Priority = x.Priority,
                MainFlag = x.MainFlag,
                DetailsFlag = x.DetailsFlag,
                SpecialFlag = x.SpecialFlag,
                CourseDesc = x.CourseDesc,
                CoursePlace = x.CoursePlace,
                CourseDate = x.CourseDate,
                CourseDays = x.CourseDays,
                CourseContent = x.CourseContent,
                PlanCost = x.PlanCost,
                // ✅ Online fields
                IsOnline = x.IsOnline,
                OnlineLink = x.OnlineLink,
                OnlineCost = x.OnlineCost,
                Slug = x.Slug,
                SKU = x.SKU
            }).ToList();
        }

        // ================= TREE =================
        public async Task<List<CategoryTreeDto>> GetTreeForAdminAsync()
        {
            var all = await _repo.GetAllAsync();

            var ordered = all
                .OrderBy(x => x.Priority ?? int.MaxValue)
                .ToList();

            List<CategoryTreeDto> Build(int? parentId)
            {
                return ordered
                    .Where(x => x.ParentId == parentId)
                    .Select(x => new CategoryTreeDto
                    {
                        Id = x.ChildId,
                        Slug = x.Slug,
                        Title = x.ServiceTitle,
                        Children = Build(x.ChildId)
                    })
                    .ToList();
            }

            return Build(null);
        }

        // ================= GET BY ID =================
        public async Task<PlanworkDto?> GetByIdAsync(int id)
        {
            var x = await _repo.GetByIdAsync(id);

            if (x == null) return null;

            return new PlanworkDto
            {
                ChildId = x.ChildId,
                ParentId = x.ParentId,
                ServiceTitle = x.ServiceTitle,
                Priority = x.Priority,
                MainFlag = x.MainFlag,
                DetailsFlag = x.DetailsFlag,
                SpecialFlag = x.SpecialFlag,
                CourseDesc = x.CourseDesc,
                CoursePlace = x.CoursePlace,
                CourseDate = x.CourseDate,
                CourseDays = x.CourseDays,
                CourseContent = x.CourseContent,
                PlanCost = x.PlanCost,
                // ✅ Online fields
                IsOnline = x.IsOnline,
                OnlineLink = x.OnlineLink,
                OnlineCost = x.OnlineCost,
                Slug = x.Slug,
                SKU = x.SKU
            };
        }

        // ================= CREATE =================
        public async Task CreateAsync(CreatePlanworkDto dto)
        {
            var entity = new Planwork
            {
                ParentId = dto.ParentId,
                ServiceTitle = dto.ServiceTitle,
                Priority = dto.Priority,
                MainFlag = dto.MainFlag,
                DetailsFlag = dto.DetailsFlag,
                SpecialFlag = dto.SpecialFlag,
                CourseDesc = dto.CourseDesc,
                CoursePlace = dto.CoursePlace,
                CourseDate = dto.CourseDate,
                CourseDays = dto.CourseDays,
                CourseContent = dto.CourseContent,
                PlanCost = dto.PlanCost,
                // ✅ Online fields
                IsOnline = dto.IsOnline,
                OnlineLink = dto.OnlineLink,
                OnlineCost = dto.OnlineCost,
                Slug = dto.Slug,
                SKU = dto.SKU
            };

            await _repo.AddAsync(entity);
            await _repo.SaveChangesAsync();
        }

        // ================= UPDATE =================
        public async Task<bool> UpdateAsync(int id, CreatePlanworkDto dto)
        {
            var entity = await _repo.GetByIdAsync(id);

            if (entity == null) return false;

            entity.ParentId = dto.ParentId;
            entity.ServiceTitle = dto.ServiceTitle;
            entity.Priority = dto.Priority;
            entity.MainFlag = dto.MainFlag;
            entity.DetailsFlag = dto.DetailsFlag;
            entity.SpecialFlag = dto.SpecialFlag;
            entity.CourseDesc = dto.CourseDesc;
            entity.CoursePlace = dto.CoursePlace;
            entity.CourseDate = dto.CourseDate;
            entity.CourseDays = dto.CourseDays;
            entity.CourseContent = dto.CourseContent;
            entity.PlanCost = dto.PlanCost;
            // ✅ Online fields
            entity.IsOnline = dto.IsOnline;
            entity.OnlineLink = dto.OnlineLink;
            entity.OnlineCost = dto.OnlineCost;
            entity.Slug = dto.Slug;
            entity.SKU = dto.SKU;

            _repo.Update(entity);
            await _repo.SaveChangesAsync();

            return true;
        }

        // ================= DELETE =================
        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);

            if (entity == null) return false;

            _repo.Delete(entity);
            await _repo.SaveChangesAsync();

            return true;
        }
    }
}