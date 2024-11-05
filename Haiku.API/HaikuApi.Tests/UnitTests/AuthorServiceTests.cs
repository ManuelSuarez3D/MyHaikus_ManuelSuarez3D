using FluentAssertions;
using Haiku.API.Controllers;
using Haiku.API.Dtos;
using Haiku.API.Services.AuthorServices;
using Haiku.API.Services.PaginationService;
using Haiku.API.Services.XmlSerializationServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;
using Xunit.Abstractions;

namespace HaikuApi.Tests.UnitTests
{
    public class AuthorServiceTests
    {
        private readonly AuthorController _controller;
        private readonly Mock<IAuthorService> _mockService = new();
        private readonly Mock<IPaginationService> _mockPagination= new();
        private readonly Mock<IXmlSerialization> _mockSerialization = new();
        private readonly Mock<ILogger<AuthorController>> _mockLogger = new();
        private readonly ITestOutputHelper _output;

        public AuthorServiceTests(ITestOutputHelper output)
        {
            _output = output;
            _controller = new AuthorController(_mockService.Object, _mockPagination.Object, _mockSerialization.Object, _mockLogger.Object);

        }

        [Fact]
        public async Task GetAuthorAsync_ReturnAuthor()
        {
            long authorId = 1;

            var expectedAuthorDto = new AuthorDto
            {
                Id = authorId,
                Name = "Unknown",
                Bio = "No Bio.",
            };

            var existingAuthor = new AuthorDto
            {
                Id = authorId,
                Name = "Unknown",
                Bio = "No Bio.",
            };

            _mockService.Setup(service => service.AuthorExistsByIdAsync(authorId))
                .ReturnsAsync(true);

            _mockService.Setup(service => service.GetAuthorByIdAsync(authorId))
                    .ReturnsAsync(existingAuthor);

            var result = await _controller.GetAuthorByIdAsync(authorId);

            var actionResult = Assert.IsType<ActionResult<AuthorDto>>(result);
            var createdResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var createdResultDto = Assert.IsType<AuthorDto>(createdResult.Value);
            _output.WriteLine($"Method: GET | Endpoint: /api/Author/{authorId} | Status Code: {createdResult.StatusCode} | " +
                               $"Should: Status = 200, " +
                               $"Value = {createdResultDto.Id}, {createdResultDto.Name}, {createdResultDto.Bio}");
            _output.WriteLine($"Actual: Value = {expectedAuthorDto.Id}, {expectedAuthorDto.Name}, {expectedAuthorDto.Bio}");
            createdResultDto.Should().BeEquivalentTo(expectedAuthorDto, options => options
                .ExcludingMissingMembers());
        }

        [Fact]
        public async Task CreateAuthorAsync_AddAuthor()
        {
            var newAuthorDto = new AuthorDto
            {
                Name = "Unknown",
                Bio = "No Bio.",
            };

            var newAuthor = new AuthorDto
            {
                Name = "Unknown",
                Bio = "No Bio.",
            };

            _mockService.Setup(service => service.AddAuthorAsync(It.IsAny<AuthorDto>()))
                    .ReturnsAsync(newAuthor);

            var result = await _controller.PostAuthorAsync(newAuthorDto);

            var actionResult = Assert.IsType<ActionResult<AuthorDto>>(result);
            var createdResult = Assert.IsType<CreatedAtRouteResult>(actionResult.Result);

            var createdResultDto = Assert.IsType<AuthorDto>(createdResult.Value);
            _output.WriteLine($"Method: POST | Endpoint: /api/Author/ | Status Code: {createdResult.StatusCode} | " +
                               $"Should: Status = 201, " +
                               $"Value = {createdResultDto.Id}, {createdResultDto.Name}, {createdResultDto.Bio} | " +
                               $"Actual: Value = {newAuthorDto.Id}, {newAuthorDto.Name}, {newAuthorDto.Bio}");

            createdResultDto.Should().BeEquivalentTo(newAuthorDto, options => options
                .ExcludingMissingMembers());

            Assert.Equal("AuthorDetails", createdResult.RouteName);
        }

        [Fact]
        public async Task UpdateAuthorAsync_UpdateAuthor()
        {
            long authorId = 1;

            var existingAuthor = new AuthorDto
            {
                Id = authorId,
                Name = "Name",
                Bio = "Bio",
            };
            var updatedAuthor = new AuthorDto
            {
                Id = authorId,
                Name = "Updated Name",
                Bio = "Updated Bio",
            };
            var updatedAuthorDto = new AuthorDto
            {
                Id = authorId,
                Name = "Name",
                Bio = "Updated Bio",
            };

            _mockService.Setup(service => service.AuthorExistsByIdAsync(authorId))
                .ReturnsAsync(true);

            _mockService.Setup(service => service.GetAuthorByIdAsync(authorId))
                .ReturnsAsync(existingAuthor);

            _mockService.Setup(service => service.UpdateAuthorAsync(authorId, It.IsAny<AuthorDto>()))
                .Returns(Task.CompletedTask);

            var result = await _controller.PutAuthorAsync(authorId, updatedAuthorDto);

            var noContentResult = Assert.IsType<NoContentResult>(result);

            _output.WriteLine($"Method: PUT | Endpoint: /api/Author/{authorId} | Status Code: {noContentResult.StatusCode} | " +
                           $"Should: Status = 204");

            Assert.Equal((int)HttpStatusCode.NoContent, noContentResult.StatusCode);
        }

        [Fact]
        public async Task DeleteAuthorAsync_DeleteAuthor()
        {
            long authorId = 1;

            _mockService.Setup(service => service.AuthorExistsByIdAsync(authorId))
                .ReturnsAsync(true);

            _mockService.Setup(service => service.DeleteAuthorByIdAsync(authorId))
                .Returns(Task.CompletedTask);

            var result = await _controller.DeleteAuthorAsync(authorId);

            var noContentResult = Assert.IsType<NoContentResult>(result);

            _output.WriteLine($"Method: DELETE | Endpoint: /api/Author/{authorId} | Status Code: {noContentResult.StatusCode} | " +
                           $"Should: Status = 204");

            Assert.Equal((int)HttpStatusCode.NoContent, noContentResult.StatusCode);
        }
    }
}
