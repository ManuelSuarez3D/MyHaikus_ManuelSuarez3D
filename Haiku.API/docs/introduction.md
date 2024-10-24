# Introduction

Below, you'll find an overview of the key dependencies required for the back-end, including important libraries and tools that enhance functionality and documentation. The features section outlines the various capabilities of the API, such as user and author management, custom exception handling, and XML serialization. Lastly, the business rules detail essential guidelines, including data communication requirements and role-based permissions for managing authors and haikus.

# Dependencies
### Back-end
- Framework: .NET 8.0
- Key Libraries:
  - Entity Framework Core: For ORM and database management.
  - Serilog: For logging.
  - AutoMapper: For object mapping.
  - FluentAssertions: For fluent-style assertions in tests.
  - Swashbuckle: For API documentation.
  - XUnit: For unit testing, providing a robust framework for writing and running tests.

# Development Dependencies
### Back-end
- DocFX: For generating back-end documentation from .NET code and markdown files.

# Features
- User Authorization: Secure access control for different user roles.
- User Haiku & User Management: Tools for managing user-generated haikus and profiles.
- Author Haiku & Author Management: Capabilities for managing haikus and profiles of authors.
- Custom Syllable Counter: Ensures haikus adhere to the traditional 5-7-5 syllable structure.
- Custom GlobalExceptionHandler: A centralized handler for managing exceptions throughout the back-end.
- Custom XML Serialization & Deserialization: Facilitates structured communication between the front-end and back-end using XML.
- API Implementation: A robust RESTful API for all operations.
- Back-end Unit Testing: Validates the functionality and performance of the .NET API.
- Back-end DocFX Documentation: Comprehensive documentation for the .NET API.
- Comprehensive Logging with Serilog: Effective logging for tracking and monitoring application behavior through a centralized GlobalExceptionHandler, with minimal exceptions where logging occurs in other areas of the code not covered by this handler.
- Comprehensive Back-end XML Documentation: All public methods are thoroughly documented using XML comments to provide clear descriptions of functionality, parameters, and return types.
  
# Business Rules
- XML Serialization: All data exchanged between the front end and back end must be in XML format, ensuring strict adherence to XML markup for communication.
- Admin Role Permissions: Only admin-role users can create, read, update, and delete (C.R.U.D.) authors and their associated haikus.
