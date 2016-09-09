using System.Web;
using System.Web.Optimization;

namespace Application.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery")
                .Include("~/scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap")
                .Include("~/scripts/tether.js")
                .Include("~/scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/content/css")
                .Include("~/content/font-awesome.css")
                .Include("~/content/bootstrap.css")
                .Include("~/content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/libraries")
                .Include("~/scripts/intercom.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular")
                .Include("~/scripts/angular/angular.js")
                .Include("~/scripts/angular/angular-drag-drop.js")
                .Include("~/scripts/angular/angular-route.js")
                .Include("~/scripts/angular/angular-messages.js")
                .Include("~/scripts/angular/angular-ui-router.js"));

            bundles.Add(new ScriptBundle("~/bundles/application")
                .Include("~/scripts/application.module.js")
                .IncludeDirectory("~/scripts/models", "*.js", true)
                .IncludeDirectory("~/scripts/providers", "*.js", true)
                .IncludeDirectory("~/scripts/filters", "*.js", true)
                .IncludeDirectory("~/scripts/services", "*.js", true)
                .IncludeDirectory("~/scripts/directives", "*.js", true)
                .IncludeDirectory("~/scripts/controllers", "*.js", true));
        }
    }
}
