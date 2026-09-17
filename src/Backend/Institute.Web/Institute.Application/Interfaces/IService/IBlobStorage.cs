using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface IBlobStorage
    {
        Task<string> UploadFileAsync(
            IFormFile file,
            string containerName,
            string folderName);
        //to delete specific file from blob storage

        Task DeleteFileAsync(        // ← أضف ده
            string fileName,
            string containerName,
            string folderName);
    }


     
}
