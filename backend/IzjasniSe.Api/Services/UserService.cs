﻿using Microsoft.EntityFrameworkCore;
using IzjasniSe.DAL;
using IzjasniSe.Model.Entities;
using IzjasniSe.Api.Services.Interfaces;
using IzjasniSe.Api.Dtos;
using IzjasniSe.Model.Enums;
using Microsoft.AspNetCore.Identity;

namespace IzjasniSe.Api.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _db;
        private readonly ILoggedInService _loggednInService;
        private readonly IFileUploadService _fileUploadService;
        private readonly PasswordHasher<User> _passwordHasher = new();

        public UserService(AppDbContext db, ILoggedInService loggedInService, IFileUploadService fileUploadService)
        {
            _db = db;
            _loggednInService = loggedInService;
            _fileUploadService = fileUploadService;
        }

        public async Task<IEnumerable<UserReadDto>> GetAllAsync()
        {
            List<User> foundUsers = await _db.Users
                .Include(u => u.City)
                .AsNoTracking()
                .ToListAsync();

            List<UserReadDto> userReadDtoList = new List<UserReadDto>();

            foreach (var user in foundUsers)
            {
                UserReadDto userReadDto = new UserReadDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = user.Role,
                    accountStatus = user.AccountStatus,
                    CreatedAt = user.CreatedAt,
                    AvatarUrl = user.AvatarUrl
                };

                userReadDtoList.Add(userReadDto);
            }

            return userReadDtoList;
        }
        private async Task<User?> GetUserEntityByIdAsync(int id)
        {
            var currentUserId = _loggednInService.GetCurrentUserId();
            var isCurrentUserAdmin = _loggednInService.IsCurrentUserAdmin();
            if (isCurrentUserAdmin || currentUserId == id)
            {
                return await _db.Users
                            .Include(u => u.City)
                            .FirstOrDefaultAsync(u => u.Id == id);
            }
            else
            {
                return null;
            }
        }

        public async Task<UserReadDto?> GetByIdAsync(int id)
        {
            var currentUserId = _loggednInService.GetCurrentUserId();
            var isCurrentUserAdmin = _loggednInService.IsCurrentUserAdmin();

            if (isCurrentUserAdmin || currentUserId == id)
            {
                var user = await _db.Users
                    .Include(u => u.City)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return null;
                }

                return new UserReadDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = user.Role,
                    accountStatus = user.AccountStatus,
                    CreatedAt = user.CreatedAt,
                    AvatarUrl = user.AvatarUrl
                };
            }

            return null;
        }

        public async Task<UserReadDto> CreateAsync(UserCreateDto userCreateDto)
        {
            var entity = new User {
                UserName = userCreateDto.UserName,
                Email = userCreateDto.Email,
                Role = userCreateDto.Role,
                CityId = userCreateDto.CityId,
                AccountStatus = UserAccountStatus.Active,
                CreatedAt = DateTime.UtcNow
            };

            entity.PasswordHash = _passwordHasher.HashPassword(entity, userCreateDto.Password);

            _db.Users.Add(entity);
            await _db.SaveChangesAsync();

            var result = new UserReadDto
            {
                Id = entity.Id,
                UserName = entity.UserName,
                Email = entity.Email,
                Role = entity.Role,
                accountStatus = entity.AccountStatus
            };

            return result;
        }

        public async Task<bool> UpdateAsync(int id, UserUpdateDto userUpdateDto)
        {
            var existingUser = await GetUserEntityByIdAsync(id);
            if (existingUser == null) return false;

            if (!string.IsNullOrEmpty(userUpdateDto.Email))
            {
                existingUser.Email = userUpdateDto.Email;
            }

            if (!string.IsNullOrEmpty(userUpdateDto.NewPassword))
            {
                existingUser.PasswordHash = _passwordHasher.HashPassword(existingUser, userUpdateDto.NewPassword);
            }

            if (userUpdateDto.AccountStatus != null)
            {
                existingUser.AccountStatus = (UserAccountStatus)userUpdateDto.AccountStatus;
            }

            existingUser.UpdatedAt = DateTime.UtcNow;

            _db.Users.Update(existingUser);
            if (!string.IsNullOrEmpty(userUpdateDto.Email) &&
                await _db.Users.AnyAsync(u => u.Email == userUpdateDto.Email && u.Id != id))
            {
                throw new InvalidOperationException("Email is already in use.");
            }
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _db.Users.FindAsync(id);
            if (existing == null) return false;

            _db.Users.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangeStatusAsync(int id, UserAccountStatus status)
        {  
            var user = await GetUserEntityByIdAsync(id);
            if (user == null) return false;

            user.AccountStatus = status;
            user.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CheckUniqueness(string? username, string? email)
        {
            var exists = await _db.Users
                .AnyAsync(u => (username != null && u.UserName == username) ||
                               (email != null && u.Email == email));
           
            return !exists;
        }

        public async Task<bool> ModeratorExistsAsync(int id)
        {
            return await _db.Users
                .AnyAsync(u => u.Id == id && u.Role == UserRole.Moderator);
        }

        public async Task<bool> UpdateAvatarAsync(int id, string avatarUrl)
        {
            var currentUserId = _loggednInService.GetCurrentUserId();
            if (currentUserId == id) {
                var user = await GetUserEntityByIdAsync(id);
                if (user == null) return false;

                if (!string.IsNullOrEmpty(user.AvatarUrl))
                {
                    await _fileUploadService.DeleteAvatarAsync(user.AvatarUrl);
                }

                user.AvatarUrl = avatarUrl;
                user.UpdatedAt = DateTime.UtcNow;

                await _db.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
