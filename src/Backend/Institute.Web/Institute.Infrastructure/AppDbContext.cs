using Institute.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Action = Institute.Domain.Entities.Action;

namespace Institute.Infrastructure;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Action> Actions { get; set; }

    public virtual DbSet<Book> Books { get; set; }

    public virtual DbSet<BooksType> BooksTypes { get; set; }

    public virtual DbSet<BooksView> BooksViews { get; set; }

    public virtual DbSet<Dailynews> Dailynews { get; set; }

    public virtual DbSet<ErrorDesc> ErrorDescs { get; set; }

    public virtual DbSet<Form> Forms { get; set; }

    public virtual DbSet<FormsCategory> FormsCategories { get; set; }

    public virtual DbSet<GetNewsDetailsView> GetNewsDetailsViews { get; set; }

    public virtual DbSet<Lecturer> Lecturers { get; set; }

    public virtual DbSet<NewsPic> NewsPics { get; set; }

    public virtual DbSet<PlanFile> PlanFiles { get; set; }

    public virtual DbSet<Planwork> Planworks { get; set; }

    public virtual DbSet<SitePic> SitePics { get; set; }

    public virtual DbSet<SiteVideo> SiteVideos { get; set; }

    public virtual DbSet<SiteVideoType> SiteVideoTypes { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UsersForm> UsersForms { get; set; }

    public virtual DbSet<UsersFormsView> UsersFormsViews { get; set; }

    public virtual DbSet<UsersLog> UsersLogs { get; set; }


    //// Custom DbSets for the new entities
    public virtual DbSet<AppUser> AppUsers { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<UserPermission> UserPermissions { get; set; }
    public virtual DbSet<Cart> Carts { get; set; }
    public virtual DbSet<CartItem> CartItems { get; set; }
    public virtual DbSet<Order> Orders { get; set; }
    public virtual DbSet<OrderItem> OrderItems { get; set; }
    public virtual DbSet<Payment> Payments { get; set; }
    public virtual DbSet<Enrollment> Enrollments { get; set; }
    public virtual DbSet<Certificate> Certificates { get; set; }
    public virtual DbSet<RefundRequest> RefundRequests { get; set; }



    //    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
    //        => optionsBuilder.UseSqlServer("Server=acdbweb-ac.fefc023eb221.database.windows.net;Database=ACicmet;User Id=ICadmin;Password=ICacdb#95_icemt;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {//Book - BooksType relationship

        
        modelBuilder.Entity<Book>()
            .HasOne(b => b.BooksType)        // كل Book له BookType واحد
            .WithMany(t => t.Books)          // كل BookType له مجموعة Books
            .HasForeignKey(b => b.TypeId)    // المفتاح الخارجي في Book
            .OnDelete(DeleteBehavior.Cascade); // اختيار سلوك الحذف (اختياري)



        base.OnModelCreating(modelBuilder);

        // AppUser
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasKey(u => u.Id);

            entity.Property(u => u.CreatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.Property(e => e.Username)
                  .IsRequired()
                  .HasMaxLength(50);
            entity.Property(x => x.ClerkUserId)
                  .IsRequired();
            entity.HasQueryFilter(u => !u.IsDeleted);
            entity.HasIndex(x => x.ClerkUserId)
                  .IsUnique()
                  .HasFilter("[IsDeleted] = 0");

            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsRequired(false);  // optional

            entity.Property(e => e.FirstName)
                .HasMaxLength(100)
                .IsRequired(false);  // optional

            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .IsRequired(false);  // optional

            //entity.Property(e => e.PasswordHash)
            //    .IsRequired()
            //    .HasMaxLength(256);
            entity.HasMany(u => u.Carts)
                  .WithOne(c => c.User)
                  .HasForeignKey(c => c.UserId);
            // Indexes
            entity.HasIndex(e => e.Username)
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");
            entity.HasIndex(e => e.Email)
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");


            entity.HasMany(u => u.Orders)
                  .WithOne(o => o.User)
                  .HasForeignKey(o => o.UserId);
        });
        modelBuilder.Entity<UserPermission>()
            .HasIndex(x => new { x.AppUserId, x.PermissionId })
            .IsUnique();
        modelBuilder.Entity<UserPermission>()
            .HasOne(x => x.AppUser)
            .WithMany(x => x.Permissions)
            .HasForeignKey(x => x.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserPermission>()
            .HasOne(x => x.Permission)
            .WithMany()
            .HasForeignKey(x => x.PermissionId)
            .OnDelete(DeleteBehavior.Cascade);
        // Cart
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.HasMany(c => c.Items)
                  .WithOne(ci => ci.Cart)
                  .HasForeignKey(ci => ci.CartId);
        });

        // CartItem
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(ci => ci.Id);
            entity.HasIndex(ci => new { ci.CartId, ci.PlanworkId }).IsUnique();
        });

        // Order
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(o => o.Id);

            entity.HasIndex(o => o.OrderNumber)
                  .IsUnique();

            entity.HasMany(o => o.Items)
                  .WithOne(oi => oi.Order)
                  .HasForeignKey(oi => oi.OrderId);

            entity.HasMany(o => o.Payments)
                  .WithOne(p => p.Order)
                  .HasForeignKey(p => p.OrderId);
            entity.Property(o => o.TotalAmount)
                .HasColumnType("decimal(18,2)");

        });

        // Certificate
        modelBuilder.Entity<Certificate>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.HasIndex(c => new { c.UserId, c.PlanworkId }).IsUnique();

            entity.Property(c => c.FileUrl).HasMaxLength(500);
            entity.Property(c => c.FileName).HasMaxLength(255);

            entity.HasOne(c => c.User)
                  .WithMany()
                  .HasForeignKey(c => c.UserId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(c => c.Planwork)
                  .WithMany()
                  .HasForeignKey(c => c.PlanworkId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // RefundRequest
        modelBuilder.Entity<RefundRequest>(entity =>
        {
            entity.HasKey(r => r.Id);

            entity.HasIndex(r => r.RefNumber).IsUnique();

            entity.Property(r => r.RefNumber).HasMaxLength(30).IsRequired();
            entity.Property(r => r.Status).HasMaxLength(20).HasDefaultValue("pending");
            entity.Property(r => r.Amount).HasColumnType("decimal(18,2)");
            entity.Property(r => r.Currency).HasMaxLength(5).HasDefaultValue("EGP");
            entity.Property(r => r.Reason).HasMaxLength(500);
            entity.Property(r => r.Details).HasMaxLength(2000);
            entity.Property(r => r.BankName).HasMaxLength(200);
            entity.Property(r => r.AccountNumber).HasMaxLength(50);
            entity.Property(r => r.AccountHolder).HasMaxLength(200);
            entity.Property(r => r.Iban).HasMaxLength(50);
            entity.Property(r => r.AdminNote).HasMaxLength(1000);
            entity.Property(r => r.RejectionReason).HasMaxLength(1000);

            entity.HasOne(r => r.User)
                  .WithMany()
                  .HasForeignKey(r => r.UserId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.Order)
                  .WithMany()
                  .HasForeignKey(r => r.OrderId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.Planwork)
                  .WithMany()
                  .HasForeignKey(r => r.PlanworkId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // OrderItem
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(oi => oi.Id);
            entity.HasIndex(oi => new { oi.OrderId, oi.PlanworkId }).IsUnique();
            entity.Property(oi => oi.Price)
                .HasColumnType("decimal(18,2)");

        });

        // Payment
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Amount)
                .HasColumnType("decimal(18,2)");
            entity.HasIndex(p => p.TransactionRef);


        });

        // Enrollment
        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasIndex(e => new { e.UserId, e.PlanworkId })
                  .IsUnique(); // يمنع تكرار الاشتراك

            entity.HasOne(e => e.User)
                  .WithMany(u => u.Enrollments)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Planwork)
                  .WithMany(p => p.Enrollments)
                  .HasForeignKey(e => e.PlanworkId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<Order>()
                  .WithMany()
                  .HasForeignKey(e => e.OrderId);
        });


        modelBuilder.Entity<Action>(entity =>
        {
            entity.HasKey(e => e.ActionId).HasName("PK_Users_Action");

            entity.ToTable("Actions", "Secure");

            entity.Property(e => e.ActionId)
                .ValueGeneratedNever()
                .HasColumnName("ActionID");
            entity.Property(e => e.ActionNm)
                .HasMaxLength(50)
                .HasColumnName("Action_NM");
        });

        modelBuilder.Entity<Book>(entity =>
        {
            entity.Property(e => e.Author).HasMaxLength(255);
        });

        modelBuilder.Entity<BooksType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK_BooksTybe");

            entity.ToTable("BooksType");

            entity.Property(e => e.TypeName).HasMaxLength(250);
        });

        modelBuilder.Entity<BooksView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("BooksView");

            entity.Property(e => e.Author).HasMaxLength(255);
            entity.Property(e => e.TypeName).HasMaxLength(250);
        });

        modelBuilder.Entity<Dailynews>(entity =>
        {
            entity.HasKey(e => e.NewsId);

            entity.ToTable("dailynews");

            entity.Property(e => e.NewsId).HasColumnName("news_id");
            entity.Property(e => e.ADetails).HasColumnName("a_details");
            entity.Property(e => e.ATitel)
                .HasMaxLength(200)
                .HasColumnName("a_titel");
            entity.Property(e => e.Approved).HasColumnName("approved");
            entity.Property(e => e.NewsDate)
                .HasColumnType("datetime")
                .HasColumnName("news_date");
            entity.Property(e => e.ShowFlag)
      .HasColumnName("show_flag")
      .HasDefaultValue(true);
        });

        modelBuilder.Entity<ErrorDesc>(entity =>
        {
            entity.ToTable("ErrorDesc", "Secure");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ErrorDate).HasMaxLength(100);
            entity.Property(e => e.ErrorDesc1).HasColumnName("ErrorDesc");
        });

        modelBuilder.Entity<Form>(entity =>
        {
            entity.ToTable("Forms", "Secure");

            entity.Property(e => e.FormId)
                .ValueGeneratedNever()
                .HasColumnName("FormID");
            entity.Property(e => e.CatId).HasColumnName("CatID");
            entity.Property(e => e.FormDesc).HasMaxLength(300);
            entity.Property(e => e.FormName).HasMaxLength(100);
            entity.Property(e => e.FormTables).HasMaxLength(255);
        });

        modelBuilder.Entity<FormsCategory>(entity =>
        {
            entity.HasKey(e => e.CatId);

            entity.ToTable("FormsCategory", "Secure");

            entity.Property(e => e.CatId).HasColumnName("CatID");
            entity.Property(e => e.CatName).HasMaxLength(50);
        });

        modelBuilder.Entity<GetNewsDetailsView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("GetNewsDetailsView");

            entity.Property(e => e.ADetails).HasColumnName("a_details");
            entity.Property(e => e.ATitel)
                .HasMaxLength(200)
                .HasColumnName("a_titel");
            entity.Property(e => e.Day).HasColumnName("day");
            entity.Property(e => e.Details).HasColumnName("details");
            entity.Property(e => e.Month)
                .HasMaxLength(6)
                .HasColumnName("month");
            entity.Property(e => e.NewsDate)
                .HasColumnType("datetime")
                .HasColumnName("news_date");
            entity.Property(e => e.NewsDate1)
                .HasMaxLength(93)
                .HasColumnName("news_date1");
            entity.Property(e => e.NewsId)
                .ValueGeneratedOnAdd()
                .HasColumnName("news_id");
            entity.Property(e => e.Year).HasColumnName("year");
        });

        modelBuilder.Entity<Lecturer>(entity =>
        {
            entity.HasKey(e => e.LecturerId).HasName("PK_Sports");

            entity.ToTable("lecturer");

            entity.Property(e => e.LecturerId).HasColumnName("lecturer_id");
            entity.Property(e => e.Email)
                .HasMaxLength(300)
                .HasColumnName("email");
            entity.Property(e => e.LecturerCourse).HasColumnName("lecturer_course");
            entity.Property(e => e.LecturerDetails).HasColumnName("lecturer_Details");
            entity.Property(e => e.LecturerEdu).HasColumnName("lecturer_Edu");
            entity.Property(e => e.LecturerMainEdu).HasColumnName("lecturer_main_Edu");
            entity.Property(e => e.LecturerName)
                .HasMaxLength(250)
                .HasColumnName("lecturer_Name");
            entity.Property(e => e.LecturerPic)
                .HasMaxLength(100)
                .HasColumnName("lecturer_pic");
            entity.Property(e => e.Telephone)
                .HasMaxLength(100)
                .HasColumnName("telephone");
        });

        modelBuilder.Entity<NewsPic>(entity =>
        {
            entity.HasKey(e => e.PicId);

            entity.ToTable("newsPic");

            entity.Property(e => e.ArComment)
                .HasMaxLength(100)
                .HasColumnName("Ar_comment");
            entity.Property(e => e.ImageName)
                .HasMaxLength(250)
                .HasColumnName("image_name");
            entity.Property(e => e.NewsId).HasColumnName("news_id");
            entity.Property(e => e.PicPeriorty).HasColumnName("Pic_periorty");
            entity.Property(e => e.StartUpPic).HasColumnName("StartUp_Pic");
        });

        modelBuilder.Entity<PlanFile>(entity =>
        {
            entity.HasKey(e => new { e.PlanId, e.FileId });
            entity.HasOne(d => d.Planwork).WithMany(p => p.Files)
                .HasForeignKey(d => d.PlanId);
                
            entity.Property(e => e.PlanId).HasColumnName("Plan_id");
            entity.Property(e => e.FileName).HasColumnName("File_name");
            entity.Property(e => e.FilePeriorty).HasColumnName("File_periorty");
            entity.Property(e => e.FileTitle).HasColumnName("File_Title");
        });

        modelBuilder.Entity<Planwork>(entity =>
        {
            entity.HasKey(e => e.ChildId).HasName("PK_Plan");

            entity.ToTable("Planwork");

            entity.Property(e => e.ChildId).HasColumnName("ChildID");
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
            entity.Property(e => e.IsOnline)
                    .HasDefaultValue(false);
            entity.Property(e => e.OnlineLink)
                  .HasMaxLength(500);
            entity.Property(e => e.OnlineCost)
                  .HasColumnType("decimal(18,2)");
            entity.Property(e => e.CourseContent).HasColumnName("course_content");
            entity.Property(e => e.CourseDate).HasColumnName("course_date");
            entity.Property(e => e.CourseDays).HasColumnName("course_days");
            entity.Property(e => e.CourseDesc).HasColumnName("course_Desc");
            entity.Property(e => e.CoursePlace).HasColumnName("course_place");

            entity.Property(e => e.MainFlag).HasColumnName("main_flag");
            entity.Property(e => e.DetailsFlag).HasColumnName("details_flag");
            entity.Property(e => e.SpecialFlag).HasColumnName("special_flag");

            entity.Property(e => e.PlanCost).HasColumnType("decimal(18, 2)");

            // 🔥 Relationships
            entity.HasOne(e => e.Parent)
                  .WithMany(e => e.Children)
                  .HasForeignKey(e => e.ParentId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(e => e.Files)
                  .WithOne(f => f.Planwork)
                  .HasForeignKey(f => f.PlanId);
        });

        
        modelBuilder.Entity<SitePic>(entity =>
        {
            entity.HasKey(e => e.ImageId);

            entity.ToTable("SitePic");

            entity.Property(e => e.ImageId).ValueGeneratedNever();
            entity.Property(e => e.PicName).HasMaxLength(100);
        });

        modelBuilder.Entity<SiteVideo>(entity =>
        {
            entity.HasKey(e => e.VideoId);

            entity.ToTable("SiteVideo");

            entity.Property(e => e.VideoId).ValueGeneratedNever();
            entity.Property(e => e.VideoImg).HasColumnName("Video_Img");
            entity.Property(e => e.VideoType).HasColumnName("Video_Type");

            entity.HasOne(d => d.VideoTypeNavigation).WithMany(p => p.SiteVideos)
                .HasForeignKey(d => d.VideoType)
                .HasConstraintName("FK_SiteVideo_SiteVideoType");
        });

        modelBuilder.Entity<SiteVideoType>(entity =>
        {
            entity.HasKey(e => e.Code);

            entity.ToTable("SiteVideoType");

            entity.Property(e => e.Code).HasColumnName("code");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users", "Secure");

            entity.Property(e => e.UserId)
                .ValueGeneratedNever()
                .HasColumnName("UserID");
            entity.Property(e => e.EndAccountDate).HasColumnType("datetime");
            entity.Property(e => e.PasswordHash).HasMaxLength(256);
            entity.Property(e => e.PasswordSalt).HasDefaultValueSql("(newid())");
            entity.Property(e => e.StartAccountDate).HasColumnType("datetime");
            entity.Property(e => e.UserEmail).HasMaxLength(255);
            entity.Property(e => e.UserFullName).HasMaxLength(255);
            entity.Property(e => e.UserLogName).HasMaxLength(50);
            entity.Property(e => e.UserPassword).HasMaxLength(50);
        });

        modelBuilder.Entity<UsersForm>(entity =>
        {
            entity.HasKey(e => new { e.FormId, e.UserId }).HasName("PK_User_Forms");

            entity.ToTable("Users_Forms", "Secure");

            entity.Property(e => e.FormId).HasColumnName("FormID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        modelBuilder.Entity<UsersFormsView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("UsersFormsView", "Secure");

            entity.Property(e => e.FormId).HasColumnName("FormID");
            entity.Property(e => e.FormName).HasMaxLength(100);
            entity.Property(e => e.UserEmail).HasMaxLength(255);
            entity.Property(e => e.UserFullName).HasMaxLength(255);
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.UserLogName).HasMaxLength(50);
            entity.Property(e => e.UserPassword).HasMaxLength(50);
        });
        // CartItem
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(ci => ci.Id);
            entity.HasIndex(ci => new { ci.CartId, ci.PlanworkId }).IsUnique();
            entity.HasOne(ci => ci.Planwork)
                  .WithMany()
                  .HasForeignKey(ci => ci.PlanworkId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<UsersLog>(entity =>
        {
            entity.HasKey(e => e.LogId);

            entity.ToTable("Users_Log", "Secure");

            entity.Property(e => e.LogId).ValueGeneratedNever();
            entity.Property(e => e.ActionDate).HasColumnName("Action_Date");
            entity.Property(e => e.ActionId).HasColumnName("ActionID");
            entity.Property(e => e.FormId).HasColumnName("FormID");
            entity.Property(e => e.Pk1)
                .HasMaxLength(20)
                .HasColumnName("pk1");
            entity.Property(e => e.Pk2)
                .HasMaxLength(20)
                .HasColumnName("pk2");
            entity.Property(e => e.Pk3)
                .HasMaxLength(20)
                .HasColumnName("pk3");
            entity.Property(e => e.Pk4)
                .HasMaxLength(20)
                .HasColumnName("pk4");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.UserIp).HasColumnName("User_IP");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
