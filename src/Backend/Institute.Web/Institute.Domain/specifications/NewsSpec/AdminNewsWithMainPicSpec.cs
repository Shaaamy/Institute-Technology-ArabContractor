using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.NewsSpec
{
    public class AdminNewsWithMainPicSpec : BaseSpecification<Dailynews>
    {
        public AdminNewsWithMainPicSpec(NewsSpecParams newsParams)
        : base(x =>
            !newsParams.Year.HasValue ||
            (x.NewsDate.HasValue &&
             x.NewsDate.Value.Year == newsParams.Year))
        {
            AddInclude(x => x.NewsPics);

            ApplyPaging(
                (newsParams.PageIndex - 1) * newsParams.PageSize,
                newsParams.PageSize);

            AddOrderByDescending(x => x.NewsDate);
        }
    }
}
