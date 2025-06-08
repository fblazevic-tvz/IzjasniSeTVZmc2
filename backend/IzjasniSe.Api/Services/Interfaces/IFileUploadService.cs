namespace IzjasniSe.Api.Services.Interfaces
{
    public interface IFileUploadService
    {
        Task<string> UploadFileAsync(IFormFile file, FileUploadType uploadType, int entityId, string entityType);

        Task<string> UploadAvatarAsync(IFormFile file, int userId);
        Task<string> UploadProfileImageAsync(IFormFile file, int entityId, string entityType);
        Task<string> UploadAttachmentAsync(IFormFile file, int entityId, string entityType);

        Task<bool> DeleteFileAsync(string filePath);
        Task<bool> DeleteAvatarAsync(string filePath);

        bool IsValidImageFile(IFormFile file);
        bool IsValidFile(IFormFile file, string fileType);
    }
}
