using FluentAssertions;
using Haiku.API.Controllers;
using Haiku.API.Dtos;
using Haiku.API.Services.AuthorHaikuServices;
using Haiku.API.Services.PaginationService;
using Haiku.API.Services.XmlSerializationServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;
using Xunit.Abstractions;

namespace AuthorHaikuApi.Tests.UnitTests
{
    public class AuthorHaikuServiceTests
    {
        private readonly AuthorHaikuController _controller;
        private readonly Mock<IAuthorHaikuService> _mockAuthorHaikuService = new();
        private readonly Mock<IPaginationService> _mockPagination = new();
        private readonly Mock<IXmlSerialization> _mockSerialization = new();
        private readonly Mock<ILogger<AuthorHaikuController>> _mockLogger = new();
        private readonly ITestOutputHelper _output;

        public AuthorHaikuServiceTests(ITestOutputHelper output)
        {
            _output = output;
            _controller = new AuthorHaikuController(_mockAuthorHaikuService.Object, _mockPagination.Object, _mockSerialization.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetAuthorHaikuAsync_ReturnAuthorHaiku()
        {
            long haikuId = 1;

            var expectedAuthorHaikuDto = new AuthorHaikuDto
            {
                Id = haikuId,
                Title = "Echoes of Spring.",
                LineOne = "Whispers in the breeze,",
                LineTwo = "Cherry blossoms kiss the sky,",
                LineThree = "Dreams of hope arise.",
                AuthorId = 1
            };

            var existingAuthorHaikuDto = new AuthorHaikuDto
            {
                Id = haikuId,
                Title = "Echoes of Spring.",
                LineOne = "Whispers in the breeze,",
                LineTwo = "Cherry blossoms kiss the sky,",
                LineThree = "Dreams of hope arise.",
                AuthorId = 1
            };

            _mockAuthorHaikuService.Setup(service => service.AuthorHaikuExistsByIdAsync(haikuId))
                .ReturnsAsync(true);

            _mockAuthorHaikuService.Setup(service => service.GetAuthorHaikuByIdAsync(haikuId))
                    .ReturnsAsync(existingAuthorHaikuDto);

            var result = await _controller.GetAuthorHaikuByIdAsync(haikuId);

            var actionResult = Assert.IsType<ActionResult<AuthorHaikuDto>>(result);
            var createdResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var createdResultDto = Assert.IsType<AuthorHaikuDto>(createdResult.Value);
            _output.WriteLine($"Method: GET | Endpoint: /api/Author/{haikuId} | Status Code: {createdResult.StatusCode} | " +
                               $"Should: Status = 200, " +
                               $"Value = {createdResultDto.Id}, {createdResultDto.Title} {createdResultDto.LineOne} {createdResultDto.LineTwo} {createdResultDto.LineThree} {createdResultDto.AuthorId}");
                               
            _output.WriteLine($"Actual: Value = {existingAuthorHaikuDto.Id}, {existingAuthorHaikuDto.Title} {existingAuthorHaikuDto.LineOne} {existingAuthorHaikuDto.LineTwo} {existingAuthorHaikuDto.LineThree} {existingAuthorHaikuDto.AuthorId}");
            createdResultDto.Should().BeEquivalentTo(expectedAuthorHaikuDto, options => options
                .ExcludingMissingMembers());
        }

        [Fact]
        public async Task CreateAuthorHaikuAsync_AddAuthorHaiku()
        {
            var newAuthorHaikuDto = new AuthorHaikuDto
            {
                Title = "An Old Silent Pond",
                LineOne = "An old silent pond...",
                LineTwo = "A frog jumps into the pond,",
                LineThree = "splash! Silence again.",
                AuthorId = 1
            };

            _mockAuthorHaikuService.Setup(service => service.AddAuthorHaikuAsync(It.IsAny<AuthorHaikuDto>()))
                    .ReturnsAsync(newAuthorHaikuDto);

            var result = await _controller.PostAuthorHaikuAsync(newAuthorHaikuDto);

            var actionResult = Assert.IsType<ActionResult<AuthorHaikuDto>>(result);
            var createdResult = Assert.IsType<CreatedAtRouteResult>(actionResult.Result);
            var createdResultDto = Assert.IsType<AuthorHaikuDto>(createdResult.Value);
            _output.WriteLine($"Method: POST | Endpoint: /api/AuthorHaiku/ | Status Code: {createdResult.StatusCode} | " +
                               $"Should: Status = 201, " +
                               $"Value = {createdResultDto.Id}, {createdResultDto.Title} {createdResultDto.LineOne} {createdResultDto.LineTwo} {createdResultDto.LineThree} {createdResultDto.AuthorId}");
            _output.WriteLine($"Actual: Value = {newAuthorHaikuDto.Id}, {newAuthorHaikuDto.Title} {newAuthorHaikuDto.LineOne} {newAuthorHaikuDto.LineTwo} {newAuthorHaikuDto.LineThree} {newAuthorHaikuDto.AuthorId}");
            createdResultDto.Should().BeEquivalentTo(newAuthorHaikuDto, options => options
                .ExcludingMissingMembers());

            Assert.Equal("AuthorHaikuDetails", createdResult.RouteName);
        }

        [Fact]
        public async Task UpdateAuthorHaikuAsync_UpdateAuthorHaiku()
        {
            long haikuId = 1;

            var existingAuthorHaiku = new AuthorHaikuDto
            {
                Id = haikuId,
                Title = "Echoes of Hope.",
                LineOne = "Whispers in the breeze,",
                LineTwo = "Cherry blossoms kiss the sky,",
                LineThree = "Dreams of hope arise.",
                AuthorId = 1
            };
            var updatedAuthorHaiku = new AuthorHaikuDto
            {
                Id = haikuId,
                Title = "Echoes of Spring.",
                LineOne = "Whispers in the breeze,",
                LineTwo = "Cherry blossoms kiss the sky,",
                LineThree = "Dreams of hope arise.",
                AuthorId = 1
            };
            var updatedAuthorHaikuDto = new AuthorHaikuDto
            {
                Id = haikuId,
                Title = "Echoes of Spring.",
                LineOne = "Whispers in the breeze,",
                LineTwo = "Cherry blossoms kiss the sky,",
                LineThree = "Dreams of hope arise.",
                AuthorId = 1
            };

            _mockAuthorHaikuService.Setup(service => service.AuthorHaikuExistsByIdAsync(haikuId))
                .ReturnsAsync(true);

            _mockAuthorHaikuService.Setup(service => service.GetAuthorHaikuByIdAsync(haikuId))
                .ReturnsAsync(existingAuthorHaiku);

            _mockAuthorHaikuService.Setup(service => service.UpdateAuthorHaikuAsync(haikuId, It.IsAny<AuthorHaikuDto>()))
                .Returns(Task.CompletedTask);

            var result = await _controller.PutAuthorHaikuAsync(haikuId, updatedAuthorHaikuDto);

            var noContentResult = Assert.IsType<NoContentResult>(result);

            _output.WriteLine($"Method: PUT | Endpoint: /api/AuthorHaiku/{haikuId} | Status Code: {noContentResult.StatusCode} | " +
                           $"Should: Status = 204");

            Assert.Equal((int)HttpStatusCode.NoContent, noContentResult.StatusCode);
        }

        [Fact]
        public async Task DeleteAuthorHaikuAsync_DeleteAuthorHaiku()
        {
            long haikuId = 1;

            _mockAuthorHaikuService.Setup(service => service.AuthorHaikuExistsByIdAsync(haikuId))
                .ReturnsAsync(true);

            _mockAuthorHaikuService.Setup(service => service.DeleteAuthorHaikuByIdAsync(haikuId))
                .Returns(Task.CompletedTask);

            var result = await _controller.DeleteAuthorHaikuAsync(haikuId);
            var noContentResult = Assert.IsType<NoContentResult>(result);

            _output.WriteLine($"Method: DELETE | Endpoint: /api/AuthorHaiku/{haikuId} | Status Code: {noContentResult.StatusCode} | " +
                           $"Should: Status = 204");

            Assert.Equal((int)HttpStatusCode.NoContent, noContentResult.StatusCode);
        }
    }
}