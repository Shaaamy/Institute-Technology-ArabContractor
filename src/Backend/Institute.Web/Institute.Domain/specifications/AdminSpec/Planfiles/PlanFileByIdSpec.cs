using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.AdminSpec.Planfiles
{
    public class PlanFileByIdSpec : BaseSpecification<PlanFile>
    {
        public PlanFileByIdSpec(int planId, int fileId)
            : base(x =>
                x.PlanId == planId &&
                x.FileId == fileId)
        {
            AddInclude(x => x.Planwork);
        }
    }
}
