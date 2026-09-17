using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.AdminSpec.Planfiles
{
    public class PlanFilesByPlanIdSpec : BaseSpecification<PlanFile>
    {
        public PlanFilesByPlanIdSpec(int planId)
           : base(x => x.PlanId == planId)
        {
            AddInclude(x => x.Planwork);

            AddOrderBy(x => x.FilePeriorty);
        }
    }
}
