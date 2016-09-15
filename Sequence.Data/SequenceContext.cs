using Application.Data.Entities;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Data
{
    

    public class SequenceContext : IdentityDbContext<SequenceUser, SequenceRole, string, IdentityUserLogin, IdentityUserRole, IdentityUserClaim>
    {
        public DbSet<Sequence> Sequences { get; set; }

        public DbSet<SequenceState> ExecutionContexts { get; set; }

        public SequenceContext()
            : base("name=SequenceContext")
        {
        }

        public SequenceContext(DbConnection connection)
            : base(connection, false)
        {
        }

        public static SequenceContext Create()
        {
            return new SequenceContext();
        }

        protected override void OnModelCreating(DbModelBuilder builder)
        {    
            base.OnModelCreating(builder);

            builder.Entity<SequenceUser>()
                .ToTable("Users")
                .HasMany(q => q.Sequences)
                .WithRequired()
                .WillCascadeOnDelete();

            builder.Entity<SequenceRole>()
                .ToTable("Roles");
            builder.Entity<IdentityUserLogin>()
                .ToTable("UserLogins");
            builder.Entity<IdentityUserRole>()
                .ToTable("UserRoles");
            builder.Entity<IdentityUserClaim>()
                .ToTable("UserClaims");

            builder.Entity<Sequence>()
                .HasMany(q => q.Actions)
                .WithRequired()
                .WillCascadeOnDelete();

            builder.Entity<Sequence>()
                .HasMany(q => q.SequenceStates)
                .WithRequired(q => q.Sequence)
                .WillCascadeOnDelete();

            builder.Entity<SequenceState>()
                .HasKey(q => q.Id);
        }
    }
}
