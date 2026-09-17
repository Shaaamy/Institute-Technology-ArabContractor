using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Configurations
{
    public class AzureStorageSettings
    {
        public string ConnectionString { get; set; }
        public string BaseUrl { get; set; }
        public string ContainerName { get; set; }
    }
}
