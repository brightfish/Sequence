namespace Application.Data.Migrations
{
    using Application.Data.Entities;
    using Application.Data.Managers;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<SequenceContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected async override void Seed(SequenceContext context)
        {
            var userStore = new SequenceUserStore(context);
            userStore.AutoSaveChanges = true;
            var userManager = new SequenceUserManager(userStore);
            

            var roleStore = new SequenceRoleStore(context);
            var roleManager = new SequenceRoleManager(roleStore);

            if (!roleManager.Roles.Any())
            {
                var administratorRole = new SequenceRole() { Name = "Admin" };
                var userRole = new SequenceRole() { Name = "User" };

                await roleManager.CreateAsync(administratorRole);
                await roleManager.CreateAsync(userRole);

                if (!userManager.Users.Any())
                {
                    var administrator = new SequenceUser()
                    {
                        Email = "admin@bright.fish",
                        UserName = "admin@bright.fish"
                    };

                    var user = new SequenceUser()
                    {
                        Email = "user@bright.fish",
                        UserName = "user@bright.fish"
                    };

                    await userManager.CreateAsync(administrator, "asdfqwer1234");
                    await userManager.CreateAsync(user, "asdfqwer1234");

                    await userManager.AddToRoleAsync(administrator.Id, administratorRole.Name);
                    await userManager.AddToRoleAsync(user.Id, userRole.Name);
                }

                await context.SaveChangesAsync();
            }
        }
    }
}
