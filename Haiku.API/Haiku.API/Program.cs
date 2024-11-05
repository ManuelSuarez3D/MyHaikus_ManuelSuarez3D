using Serilog;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Haiku.API.Mapping;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Haiku.API.Database;
using Microsoft.Extensions.Options;
using Haiku.API.Models;
using Haiku.API.Repositories.AuthorHaikuRepositories;
using Haiku.API.Services.AuthorHaikuServices;
using Haiku.API.Repositories.UserHaikuRepositories;
using Haiku.API.Services.UserHaikuServices;
using Haiku.API.Repositories.AuthorRepositories;
using Haiku.API.Services.AuthorServices;
using Haiku.API.Repositories.UserRepositories;
using Haiku.API.Services.UserServices;
using Haiku.API.Repositories.RoleRepositories;
using Haiku.API.Services.RoleServices;
using Haiku.API.Services.PaginationService;
using Haiku.API.Services.XmlSerializationServices;
using Haiku.API.Services.AuthServices;
using Haiku.API.Services.ProfileServices;
using Haiku.API.Services.IProfileServices;
using Haiku.API.Repositories.ProfileRepositories;
using Haiku.API.Exceptions;
using System.Security.Cryptography;
using Haiku.API.Repositories.ImageRepositories;
using Haiku.API.Services.ImageServices;
using Haiku.API.Utilities.UnitOfWorks;


Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.Debug()
    .WriteTo.File("Logs/log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Used to generate a key, the first time.
//byte[] key = new byte[32];

//using (var rng = RandomNumberGenerator.Create())
//{
//    rng.GetBytes(key);
//}
//string base64Key = Convert.ToBase64String(key);
//Log.Information($"Generated Key for Jwt: {base64Key}");


builder.Services.Configure<JwtSettings>(options =>
{
    options.Key = Environment.GetEnvironmentVariable("Haiku.API_JWTKEY");
    options.Issuer = builder.Configuration["Jwt:Issuer"];
    options.Audience = builder.Configuration["Jwt:Audience"];
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})

.AddJwtBearer(options =>
{
    var jwtSettings = builder.Services.BuildServiceProvider().GetRequiredService<IOptions<JwtSettings>>().Value;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminRole", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserRole", policy => policy.RequireRole("User"));
});

builder.Services.AddControllers()
    .AddXmlSerializerFormatters();
builder.Services.AddAutoMapper(typeof(AuthorHaikuMapping), typeof(AuthorMapping));
builder.Services.AddDbContext<HaikuAPIContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("HaikuDatabase")));
builder.Services.AddScoped<IAuthorHaikuRepository, AuthorHaikuRepository>();
builder.Services.AddScoped<IAuthorHaikuService, AuthorHaikuService>();
builder.Services.AddScoped<IUserHaikuRepository, UserHaikuRepository>();
builder.Services.AddScoped<IUserHaikuService, UserHaikuService>();
builder.Services.AddScoped<IAuthorRepository, AuthorRepository>();
builder.Services.AddScoped<IAuthorService, AuthorService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IPaginationUtility, PaginationUtility>();
builder.Services.AddScoped<IXmlSerialization, XmlSerializationUtility>();
builder.Services.AddScoped<IUnitOfWorkUtility, UnitOfWorkUtility>();
builder.Services.AddScoped<IImageRepository, ImageRepository>();
builder.Services.AddScoped<IImageService, ImageService>();

builder.Services.AddEndpointsApiExplorer();
builder.Logging.ClearProviders();
builder.Logging.AddSerilog();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Haiku.API", Version = "v1" });
    c.SchemaFilter<CustomSchemaFilterUtility>();

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

var app = builder.Build();
app.UseAuthentication();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsEnvironment("Development"))
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(options =>
    options.WithOrigins("http://localhost:4200")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .WithExposedHeaders("x-pagination")
);

app.UseMiddleware<GlobalExceptionHandlerUtility>();
app.UseAuthorization();
app.UseHttpsRedirection();
app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

public partial class Program { };
