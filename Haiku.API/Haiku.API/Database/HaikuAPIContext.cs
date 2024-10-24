using Haiku.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Haiku.API.Database
{
    public class HaikuAPIContext : DbContext
    {
        public HaikuAPIContext() { }
        public HaikuAPIContext(DbContextOptions<HaikuAPIContext> options) : base(options) { }
        public DbSet<AuthorHaiku> AuthorHaikus{ get; set; }
        public DbSet<UserHaiku> UserHaikus { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Image> Images { get; set; }

        private const string DefaultImageUrl = "http://localhost:5104/images/default-profile.png";

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<Profile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Profile>()
                .HasOne(p => p.Image)
                .WithMany(i => i.Profiles)
                .HasForeignKey(p => p.ImageId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<AuthorHaiku>()
                .HasOne(h => h.Author)
                .WithMany(a => a.AuthorHaikus)
                .HasForeignKey(h => h.AuthorId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<UserHaiku>()
                .HasOne(h => h.User)
                .WithMany(a => a.UserHaikus)
                .HasForeignKey(h => h.UserId);

            modelBuilder.Entity<User>()
                .HasOne(u => u.UserRole)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId);

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Title = "Admin" },
                new Role { Id = 2, Title = "User" }
            );

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword("12345678");
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "Manny", Password = hashedPassword, RoleId = 1 },
                new User { Id = 2, Username = "MarcoPolo", Password = hashedPassword, RoleId = 2 },
                new User { Id = 3, Username = "John", Password = hashedPassword, RoleId = 2 },
                new User { Id = 4, Username = "Bob", Password = hashedPassword, RoleId = 2 },
                new User { Id = 5, Username = "Charlie", Password = hashedPassword, RoleId = 2 },
                new User { Id = 6, Username = "Diana", Password = hashedPassword, RoleId = 2 },
                new User { Id = 7, Username = "Eve", Password = hashedPassword, RoleId = 2 },
                new User { Id = 8, Username = "Frank", Password = hashedPassword, RoleId = 2 },
                new User { Id = 9, Username = "Grace", Password = hashedPassword, RoleId = 2 },
                new User { Id = 10, Username = "Heidi", Password = hashedPassword, RoleId = 2 }
            );

            modelBuilder.Entity<Image>().HasData(
                new Image { Id = 1, FilePath = DefaultImageUrl },
                new Image { Id = 2, FilePath = "http://localhost:5104/images/random_01.jpg" },
                new Image { Id = 3, FilePath = "http://localhost:5104/images/random_02.jpg" },
                new Image { Id = 4, FilePath = "http://localhost:5104/images/random_03.jpg" },
                new Image { Id = 5, FilePath = "http://localhost:5104/images/random_04.jpg" },
                new Image { Id = 6, FilePath = "http://localhost:5104/images/random_05.jpg" },
                new Image { Id = 7, FilePath = "http://localhost:5104/images/random_06.jpg" },
                new Image { Id = 8, FilePath = "http://localhost:5104/images/random_07.jpg" },
                new Image { Id = 9, FilePath = "http://localhost:5104/images/random_08.jpg" },
                new Image { Id = 10, FilePath = "http://localhost:5104/images/random_09.jpg" }
            );

            modelBuilder.Entity<Profile>().HasData(
                new Profile { Id = 1, Bio = "A programmer, open to work!", ImageId = 1, UserId = 1 },
                new Profile { Id = 2, Bio = "No Bio", ImageId = 1, UserId = 2 },
                new Profile { Id = 3, Bio = "A web designer who loves minimalism.", ImageId = 2, UserId = 3 },
                new Profile { Id = 4, Bio = "An avid reader and aspiring author.", ImageId = 3, UserId = 4 },
                new Profile { Id = 5, Bio = "Tech enthusiast and developer.", ImageId = 4, UserId = 5 },
                new Profile { Id = 6, Bio = "Travel lover and photographer.", ImageId = 5, UserId = 6 },
                new Profile { Id = 7, Bio = "Graphic designer and artist.", ImageId = 6, UserId = 7 },
                new Profile { Id = 8, Bio = "Fitness coach and health advocate.", ImageId = 7, UserId = 8 },
                new Profile { Id = 9, Bio = "Foodie and culinary explorer.", ImageId = 8, UserId = 9 },
                new Profile { Id = 10, Bio = "Music lover and guitar player.", ImageId = 9, UserId = 10 }
            );

            modelBuilder.Entity<Author>().HasData(
                new Author { Id = 1, Name = "Unknown", Bio = "This author represents haikus with unidentified or anonymous origins." },
                new Author { Id = 2, Name = "Bashō", Bio = "Born Matsuo Kinsaku, later known as Matsuo Chūemon Munefusa was the most famous Japanese poet of the Edo period." },
                new Author { Id = 3, Name = "Masaoka Shiki", Bio = "Shiki is generally regarded as the major figure in the development of modern haiku poetry and also played an important role in revitalizing tanka poetry." },
                new Author { Id = 4, Name = "Murakami Kijo", Bio = "Kijo was born in 1865 in Edo, Japan. He studied law but gave this up after losing his hearing due to illness. In 1894, he worked as a legal scribe in Takasaki." },
                new Author { Id = 5, Name = "Kobayashi Issa", Bio = "Issa was a Japanese poet and lay Buddhist priest, one of the four masters of the haiku tradition." },
                new Author { Id = 6, Name = "Yosa Buson", Bio = "Buson was a Japanese poet and painter of the Edo period, recognized for his works in haiku and painting." },
                new Author { Id = 7, Name = "Natsume Sōseki", Bio = "Sōseki was a famous Japanese novelist, also known for his haiku poetry." },
                new Author { Id = 8, Name = "Kikaku", Bio = "Kikaku was a haiku poet and a disciple of Matsuo Bashō." },
                new Author { Id = 9, Name = "Takarai Kikaku", Bio = "Kikaku was a student of Bashō and a pioneer of modern haiku." },
                new Author { Id = 10, Name = "Akiyama Katsu", Bio = "Akiyama is known for his innovative approach to haiku." }
            );

            modelBuilder.Entity<AuthorHaiku>().HasData(
                new AuthorHaiku { Id = 1, Title = "An Old Silent Pond", LineOne = "An old silent pond...", LineTwo = "A frog jumps into the pond,", LineThree = "splash! Silence again.", AuthorId = 2 },
                new AuthorHaiku { Id = 2, Title = "Toward those short trees", LineOne = "Toward those short trees,", LineTwo = "We saw a hawk descending,", LineThree = "On a day in spring.", AuthorId = 3 },
                new AuthorHaiku { Id = 3, Title = "First autumn morning", LineOne = "First autumn morning,", LineTwo = "The mirror I stare into,", LineThree = "Shows my father's face.", AuthorId = 4 },
                new AuthorHaiku { Id = 4, Title = "Spring Rain", LineOne = "Spring rain is falling,", LineTwo = "A thirsty mouth opened wide,", LineThree = "To taste the soft drops.", AuthorId = 5 },
                new AuthorHaiku { Id = 5, Title = "The Light of a Candle", LineOne = "The light of a candle,", LineTwo = "A star shining in the night,", LineThree = "Guiding all my dreams.", AuthorId = 6 },
                new AuthorHaiku { Id = 6, Title = "Under Cherry Blossoms", LineOne = "Under blossoms white,", LineTwo = "A soft breeze whispers of spring,", LineThree = "The touch of the sun.", AuthorId = 7 },
                new AuthorHaiku { Id = 7, Title = "Evening Thoughts", LineOne = "Evening thoughts wander,", LineTwo = "The sunset ignites the sky,", LineThree = "Colors of pure peace.", AuthorId = 8 },
                new AuthorHaiku { Id = 8, Title = "Whispers of Autumn", LineOne = "Whispers of autumn,", LineTwo = "Leaves falling to the ground soft,", LineThree = "Nature's gentle sigh.", AuthorId = 9 },
                new AuthorHaiku { Id = 9, Title = "Fallen Leaves", LineOne = "Fallen leaves crunch soft,", LineTwo = "In the quiet of the woods,", LineThree = "Nature's lullaby.", AuthorId = 10 }
            );
            modelBuilder.Entity<UserHaiku>().HasData(
                new UserHaiku { Id = 1, Title = "Comet's Departure", LineOne = "Summer's last night sky,", LineTwo = "Bright comet's glow ever warm,", LineThree = "Cold left by its void.", UserId = 1 },
                new UserHaiku { Id = 2, Title = "Beauties Destiny", LineOne = "A cold blossom falls,", LineTwo = "Once a beauty to behold,", LineThree = "Destined to wither.", UserId = 1 },
                new UserHaiku { Id = 3, Title = "Out of Reach", LineOne = "A sunset's warm glow,", LineTwo = "Her radiant light divine,", LineThree = "Forever afar.", UserId = 1 },
                new UserHaiku { Id = 4, Title = "Starlit Dreams", LineOne = "Under starlit skies,", LineTwo = "Dreams of the night take their flight,", LineThree = "Whispers of the heart.", UserId = 2 },
                new UserHaiku { Id = 5, Title = "Silent Reflections", LineOne = "Reflections in time,", LineTwo = "Moments drift like the soft tide,", LineThree = "Silence speaks the truth.", UserId = 3 },
                new UserHaiku { Id = 6, Title = "Dancing Shadows", LineOne = "Dancing shadows play,", LineTwo = "In the light of fading day,", LineThree = "Whispers of the past.", UserId = 4 },
                new UserHaiku { Id = 7, Title = "Nature's Melody", LineOne = "A melody soft,", LineTwo = "Nature sings in harmony,", LineThree = "A song of the earth.", UserId = 5 },
                new UserHaiku { Id = 8, Title = "Echoes of Tomorrow", LineOne = "Echoes of tomorrow,", LineTwo = "Dance through the halls of the past,", LineThree = "Hope in every beat.", UserId = 6 },
                new UserHaiku { Id = 9, Title = "Gentle Rainfall", LineOne = "Gentle rain falls down,", LineTwo = "Kissing the thirsty ground sweet,", LineThree = "Nature’s warm embrace.", UserId = 7 },
                new UserHaiku { Id = 10, Title = "A New Dawn", LineOne = "A new dawn awakens,", LineTwo = "With colors bursting to life,", LineThree = "Hope blooms in the light.", UserId = 8 }
            );
        }
    }
}
