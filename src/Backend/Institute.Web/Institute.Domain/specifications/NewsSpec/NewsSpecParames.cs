using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.NewsSpec
{
  

        public class NewsSpecParams
        {
            public int PageIndex { get; set; } = 1;
            public int PageSize { get; set; } = 12;
            public int? Year { get; set; }
        }

   

}
