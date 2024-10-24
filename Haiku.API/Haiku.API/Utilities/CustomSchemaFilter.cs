using Haiku.API.Dtos;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
public class CustomSchemaFilter : ISchemaFilter
{

    /// <summary>
    /// Applies custom schema settings for various DTO types in the OpenAPI documentation.
    /// </summary>
    /// <param name="schema">The <see cref="OpenApiSchema"/> to which the schema settings are applied.</param>
    /// <param name="context">The <see cref="SchemaFilterContext"/> containing context information about the schema.</param>
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (context.Type == typeof(AuthorDto))
        {
            if (schema.Properties.ContainsKey("name"))
            {
                schema.Properties["name"].Example = new OpenApiString("John Doe");
                schema.Properties["name"].Description = "The Author name.";
            }
            if (schema.Properties.ContainsKey("bio"))
            {
                schema.Properties["bio"].Default = new OpenApiString("No Bio.");
                schema.Properties["bio"].Example = new OpenApiString("An accomplished poet.");
                schema.Properties["bio"].Description = "The bio of the Author. Defaults to 'No Bio'.";
            }
            if (schema.Properties.ContainsKey("id"))
            {
                  schema.Properties["id"].ReadOnly = true;
            }
        }

        if (context.Type == typeof(AuthorHaikuDto))
        {
            if (schema.Properties.ContainsKey("title"))
            {
                schema.Properties["title"].Example = new OpenApiString("An Old Silent Pond");
                schema.Properties["title"].Description = "The title of the Haiku.";
            }
            if (schema.Properties.ContainsKey("lineOne"))
            {
                schema.Properties["lineOne"].Example = new OpenApiString("An old silent pond...");
                schema.Properties["lineOne"].Description = "The first line is 5 Syllables.";
            }
            if (schema.Properties.ContainsKey("lineTwo"))
            {
                schema.Properties["lineTwo"].Example = new OpenApiString("A frog jumps into the pond,");
                schema.Properties["lineTwo"].Description = "The Second line is 7 Syllables.";
            }
            if (schema.Properties.ContainsKey("lineThree"))
            {
                schema.Properties["lineThree"].Example = new OpenApiString("splash! Silence again.");
                schema.Properties["lineThree"].Description = "The Third line is 5 Syllables.";
            }
            if (schema.Properties.ContainsKey("authorId"))
            {
                schema.Properties["authorId"].Default = new OpenApiLong(1);
                schema.Properties["authorId"].Example = new OpenApiLong(1);
                schema.Properties["authorId"].Description = "The ID of the Haiku's author. Defaults to 1, which represents an 'Unknown Author'.";
            }
            if (schema.Properties.ContainsKey("id"))
            {
                schema.Properties["id"].ReadOnly = true;
            }
        }

        if (context.Type == typeof(UserHaikuDto))
        {
            if (schema.Properties.ContainsKey("title"))
            {
                schema.Properties["title"].Example = new OpenApiString("An Old Silent Pond");
                schema.Properties["title"].Description = "The title of the Haiku.";
            }
            if (schema.Properties.ContainsKey("lineOne"))
            {
                schema.Properties["lineOne"].Example = new OpenApiString("An old silent pond...");
                schema.Properties["lineOne"].Description = "The first line is 5 Syllables.";
            }
            if (schema.Properties.ContainsKey("lineTwo"))
            {
                schema.Properties["lineTwo"].Example = new OpenApiString("A frog jumps into the pond,");
                schema.Properties["lineTwo"].Description = "The Second line is 7 Syllables.";
            }
            if (schema.Properties.ContainsKey("lineThree"))
            {
                schema.Properties["lineThree"].Example = new OpenApiString("splash! Silence again.");
                schema.Properties["lineThree"].Description = "The Third line is 5 Syllables.";
            }
            if (schema.Properties.ContainsKey("userId"))
            {
                schema.Properties["userId"].Default = new OpenApiLong(1);
                schema.Properties["userId"].Example = new OpenApiLong(1);
                schema.Properties["userId"].Description = "The ID of the Haiku's user.";
            }
            if (schema.Properties.ContainsKey("id"))
            {
                schema.Properties["id"].ReadOnly = true;
            }
        }

        if (context.Type == typeof(UserDto))
        {
            if (schema.Properties.ContainsKey("username"))
            {
                schema.Properties["username"].Example = new OpenApiString("user23211");
                schema.Properties["username"].Description = "The users username.";
            }
            if (schema.Properties.ContainsKey("password"))
            {
                schema.Properties["password"].Example = new OpenApiString("a2vfa2f");
                schema.Properties["password"].Description = "The users password.";
            }
            if (schema.Properties.ContainsKey("id"))
            {
                schema.Properties["id"].ReadOnly = true;
            }
            if (schema.Properties.ContainsKey("roleId"))
            {
                schema.Properties["roleId"].Example = new OpenApiLong(1);
                schema.Properties["roleId"].Description = "The ID of the User's role.";
            }
        }

        if (context.Type == typeof(ProfileDto))
        {
            if (schema.Properties.ContainsKey("bio"))
            {
                schema.Properties["bio"].Example = new OpenApiString("A Haiku Poet");
                schema.Properties["bio"].Description = "The profile bio.";
            }
            if (schema.Properties.ContainsKey("imageUrl"))
            {
                schema.Properties["imageUrl"].Example = new OpenApiString("https://example.com/images/profile-placeholder.jpg");
                schema.Properties["imageUrl"].Description = "The profile image.";
            }
            if (schema.Properties.ContainsKey("id"))
            {
                schema.Properties["id"].ReadOnly = true;
            }
            if (schema.Properties.ContainsKey("userId"))
            {
                schema.Properties["userId"].Example = new OpenApiLong(1);
                schema.Properties["userId"].Description = "The ID of the Profile's user.";
            }
        }

        if (context.Type == typeof(LoginDto))
        {
            if (schema.Properties.ContainsKey("username"))
            {
                schema.Properties["username"].Example = new OpenApiString("user23211");
                schema.Properties["username"].Description = "The users username.";
            }
            if (schema.Properties.ContainsKey("password"))
            {
                schema.Properties["password"].Example = new OpenApiString("a2vfa2f8");
                schema.Properties["password"].Description = "The users password.";
            }
            if (schema.Properties.ContainsKey("id"))
            {
                schema.Properties["id"].ReadOnly = true;
            }
        }

        if (context.Type == typeof(RegisterDto))
        {
            if (schema.Properties.ContainsKey("username"))
            {
                schema.Properties["username"].Example = new OpenApiString("user23211");
                schema.Properties["username"].Description = "The users username.";
            }
            if (schema.Properties.ContainsKey("password"))
            {
                schema.Properties["password"].Example = new OpenApiString("a2vfa2f8");
                schema.Properties["password"].Description = "The users password.";
            }
            if (schema.Properties.ContainsKey("confirmPassword"))
            {
                schema.Properties["confirmPassword"].Example = new OpenApiString("a2vfa2f8");
                schema.Properties["confirmPassword"].Description = "Confirm the users password.";
            }
            if (schema.Properties.ContainsKey("id"))
            {
                schema.Properties["id"].ReadOnly = true;
            }
        }
    }
}