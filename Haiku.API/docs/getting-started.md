# Getting Started
This guide will walk you through setting up the Haiku.API project.
 
## Instructions
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
- Secured API Access: After logging in, you will receive a JWT token. Use this token in the Authorize window for secured API access.
