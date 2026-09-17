using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Institute.Domain.Entities;

namespace Institute.Domain.specifications.NewsSpec
{
    public class NewsWithMainPicSpec : BaseSpecification<Dailynews>
    {
        public NewsWithMainPicSpec(NewsSpecParams newsParams)
            : base(x =>
                x.ShowFlag ==  true &&
                (!newsParams.Year.HasValue ||
                 (x.NewsDate.HasValue &&
                  x.NewsDate.Value.Year == newsParams.Year)))
        {
            AddInclude(x => x.NewsPics);

            ApplyPaging(
                (newsParams.PageIndex - 1) * newsParams.PageSize,
                newsParams.PageSize);

            AddOrderByDescending(x => x.NewsDate);
        }

        public NewsWithMainPicSpec(int id)
            : base(x => x.NewsId == id && x.ShowFlag == true)
        {
            AddInclude(x => x.NewsPics);
        }
    }




}
