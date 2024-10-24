# MyHaikus by Manuel Suarez
### C# | TypeScript | Swagger (Swashbuckle) | Angular | Bootstrap | XUnit | SSMS | Serilog | .NET | RESTful API | Visual Studio

# Summary
MyHaikus is a platform that allows users to explore a diverse collection of renowned authors and their haikus. It offers a user-friendly environment for effortlessly managing personal haikus and viewing those created by others, enabling users to appreciate the beauty of this unique form of poetry. Users can create, update, delete, and share haikus with ease, all facilitated through the front-end using Angular and TypeScript. It features comprehensive XML documentation in the back end and JSDoc in the front end, strongly emphasizing XML for data transfer, as the controller endpoints produce and consume XML, which involves serialization and deserialization of data between the two.

Haiku.API serves as a robust RESTful API designed for creating and managing haikus and haiku creators. It features JWT Authorization for secure access (utilizing cookies to store the tokens), CRUD operations with built-in validation (including a custom syllable counter), and Serilog for efficient log tracking and monitoring, all implemented through the back-end using .NET.

For documentation, DocFX is utilized to generate comprehensive back-end documentation, ensuring clear and accessible resources. On the front-end, Compodoc is employed for JSDoc documentation, providing detailed insights into the Angular application structure and components.

The project also includes unit testing functionality using XUnit to ensure reliability and performance for the back end and Karma for unit testing in the front end.

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

### Front-end
- Framework: Angular 18.2.0
-  Key Libraries:
  - Angular Material: For UI components.
  - Bootstrap: For styling and responsive design.
  - ngx-cookie-service: For managing cookies.
  - jwt-decode: For decoding JWT tokens.

# Development Dependencies
### Back-end
- DocFX: For generating back-end documentation from .NET code and markdown files.

### Front-end
- Compodoc: For creating detailed front-end documentation of the Angular application.
- Karma: A test runner for executing unit tests in the Angular application.

# Instructions
- Create an Environment Variable:
  - Default Name: The environment variable should be set to Haiku.API_JWTKEY, although you can choose a different name if desired.
  - Key Generation: You can utilize the commented-out key generator found in Program.cs to create a secure key.
- Create the Database: In SSMS (Microsoft SQL Server Management Studio), create the "Haiku.API" database.
- Set Connection Strings: Adjust the ConnectionStrings for "HaikuDatabase" according to your requirements.
- Add Migration: Run add-migration {anyname} to create a new migration.
- Update Database: Execute update-database to apply the migration.
- Run the Application: Start the application.
- Login Credentials: Use the following credentials for login management (or register):
  - Username: Manny | Password: 12345678
  - Username: MarcoPolo | Password: 12345678

# Documentation
### Back-end
- DocFX: Run docfx serve _site in the command prompt from the main project folder.
### Front-end
- Compodoc: Run npx compodoc -s in the command prompt from the main client app folder.
- 
# Unit Tests
### Back-end
- Run tests from Test Explorer in Visual Studio.
### Front-end
- Run ng test in the command prompt from the main project folder to execute tests.
  
# Features
- User Authorization: Secure access control for different user roles.
- User Haiku & User Management: Tools for managing user-generated haikus and profiles.
- Author Haiku & Author Management: Capabilities for managing haikus and profiles of authors.
- Custom Syllable Counter: Ensures haikus adhere to the traditional 5-7-5 syllable structure.
- Custom GlobalExceptionHandler: A centralized handler for managing exceptions throughout the back-end.
- Custom XML Serialization & Deserialization: Facilitates structured communication between the front-end and back-end using XML.
- API Implementation: A robust RESTful API for all operations.
- Front-end Unit Testing: Ensures reliability and performance of the Angular application.
- Back-end Unit Testing: Validates the functionality and performance of the .NET API.
- Front-end Compodoc Documentation: Detailed documentation for the Angular application structure and components.
- Back-end DocFX Documentation: Comprehensive documentation for the .NET API.
- Comprehensive Logging with Serilog: Effective logging for tracking and monitoring application behavior through a centralized GlobalExceptionHandler, with minimal exceptions where logging occurs in other areas of the code not covered by this handler.
- Comprehensive Front-end JSDOC Documentation: All public methods are thoroughly documented using JSDOC comments to provide clear descriptions of functionality, parameters, and return types.
- Comprehensive Back-end XML Documentation: All public methods are thoroughly documented using XML comments to provide clear descriptions of functionality, parameters, and return types.
  
# Business Rules
- XML Serialization: All data exchanged between the front end and back end must be in XML format, ensuring strict adherence to XML markup for communication.
- Authorized Users: Only authorized users can create, update, and delete (C.U.D.) their haikus.
- Admin Role Permissions: Only admin-role users can create, read, update, and delete (C.R.U.D.) authors and their associated haikus.
- Admin User Capabilities: Admin-role users can delete any non-admin users and remove user haikus that do not belong to them.
  
# Demo
[![MyHaikus](https://img.youtube.com/vi/rjoDBPW8It8/0.jpg)](https://www.youtube.com///watch?v=rjoDBPW8It8 "MyHaikus")
