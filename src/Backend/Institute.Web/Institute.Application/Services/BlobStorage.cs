using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Institute.Application.Configurations;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Institute.Application.Services
{
    public class BlobStorage : IBlobStorage
    {
        private readonly string _connectionString;

        public BlobStorage(IOptions<AzureStorageSettings> options)
        {
            _connectionString = options.Value.ConnectionString;
        }

        public async Task<string> UploadFileAsync(
    IFormFile file,
    string containerName,
    string folderName)
        {
            var containerClient = new BlobContainerClient(_connectionString, containerName);

            await containerClient.CreateIfNotExistsAsync();

            var originalFileName = Path.GetFileName(file.FileName);

            var blobName = $"{folderName}/{originalFileName}";

            var blobClient = containerClient.GetBlobClient(blobName);

            using var stream = file.OpenReadStream();

            await blobClient.UploadAsync(stream, new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders
                {
                    ContentType = file.ContentType
                }
            });

            return originalFileName; // 🔥 مهم جدًا
        }
        public async Task DeleteFileAsync(
           string fileName,
           string containerName,
           string folderName)
        {
            if (string.IsNullOrWhiteSpace(fileName)) return;

            var containerClient = new BlobContainerClient(_connectionString, containerName);
            var blobClient = containerClient.GetBlobClient($"{folderName}/{fileName}");
            await blobClient.DeleteIfExistsAsync();
        }



    }
}
