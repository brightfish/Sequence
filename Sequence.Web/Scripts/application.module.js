(function () {
    var application = angular.module('Application', ['ui.router', 'drag-drop']);
    application.config(ApplicationModule);

    ApplicationModule.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', 'sessionProvider'];


    function ApplicationModule($locationProvider, $stateProvider, $urlRouterProvider, sessionProvider) {

        sessionProvider.sessionTimespan = 30 * 1000;
        sessionProvider.debug = true;

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });

        $stateProvider
            .state('session', {
                resolve: {
                    User: function (accountService, $q) {
                        var task = $q.defer();

                        accountService.getUserInfo()
                              .then(function (result) {
                                  var user = new User(result.data);
                                  application.value('User', user);
                                  task.resolve(user);
                              }, function (result) {
                                  task.reject();
                              });

                        return task.promise;
                    }
                },
                templateUrl: 'templates/session.html',
                controller: 'SessionController as sc',
                abstract: true
            })

            .state('session.layout.home', {
                url: '/',
                templateUrl: 'templates/landing/home.html'
            })
            .state('session.layout.features', {
                url: '/features',
                templateUrl: 'templates/landing/features.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.contact', {
                url: '/contact',
                templateUrl: 'templates/landing/contact.html'
            })
            .state('session.layout.about', {
                url: '/about',
                templateUrl: 'templates/landing/about.html'
            })

            .state('session.layout.signin',
            {
                url: '/signin',
                templateUrl: 'templates/account/signin.html',
                controller: 'SignInController as sic',
            })
            .state('session.layout.signout',
            {
                url: 'account/signout',
                controller: 'SignOutController',
                template: ''
            })
            .state('session.layout', {
                templateUrl: 'templates/layout.html',
                abstract: true
            })
            .state('session.layout.register', {
                url: 'account/register/{token}',
                templateUrl: 'templates/account/register.html',
                controller: 'RegisterController as rc'
            })

            .state('session.layout.account', {
                abstract: true
            })
            .state('session.layout.account.settings', {
                url: 'account/settings',
                templateUrl: 'templates/account/settings.html'
            })

            .state('session.forgot', {
                url: 'account/forgot',
                templateUrl: 'templates/account/forgotpassword/email/default.html',
                controller: 'ForgotPasswordController as fc'
            })
            .state('session.forgot-email-sent', {
                url: 'account/forgot/email/sent',
                templateUrl: 'templates/account/forgotpassword/email/sent.html',
                controller: 'ForgotPasswordController as fc'
            })
            .state('session.forgot-email-reset', {
                url: 'account/forgot/email/reset',
                templateUrl: 'templates/account/forgotpassword/email/reset.html',
                controller: 'ForgotPasswordController as fc'
            })
            .state('session.forgot-questions', {
                url: 'account/forgot/questions',
                templateUrl: 'templates/account/forgotpassword/questions/default.html',
                controller: 'ForgotPasswordController as fc'
            })
            .state('session.forgot-success', {
                url: 'account/forgot/success',
                templateUrl: 'templates/account/forgotpassword/success.html'
            })

            .state('session.layout.dashboard', {
                url: 'dashboard/courses',
                templateUrl: 'templates/dashboard/courses.html',
            })

            .state('session.layout.administration',
            {
                url: 'administration',
                templateUrl: 'templates/administration/administration.html'
            })
            .state('session.layout.administration-account',
            {
                url: 'administration/account',
                templateUrl: 'templates/administration/account/account.html'
            })
            .state('session.layout.administration-account-tokens',
            {
                url: 'administration/account/tokens',
                templateUrl: 'templates/administration/account/tokens.html',
                controller: 'TokenController as tc'
            });

        //$urlRouterProvider.otherwise('/');
    }
})();