(function () {
    var application = angular.module('Application', ['LocalStorageModule', 'ui.router', 'ui.bootstrap.tpls', 'ui.bootstrap', 'drag-drop']);
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
            .state('session.layout', {
                templateUrl: 'templates/layout.html',
                abstract: true
            })
            .state('session.layout.home', {
                url: '/',
                templateUrl: 'templates/landing/home.html'
            })
            .state('session.layout.features', {
                url: '/features',
                templateUrl: 'templates/landing/features.html',
            })
            .state('session.layout.contact', {
                url: '/contact',
                templateUrl: 'templates/landing/contact.html'
            })
            .state('session.layout.about', {
                url: '/about',
                templateUrl: 'templates/landing/about.html'
            })


            //Sequence
            .state('session.layout.sequences', {
                url: '/sequences',
                templateUrl: 'templates/sequences/sequences.html',
                controller: 'SequencesController as sc'
            })                      
            .state('session.layout.sequence', {
                url: '/sequences/:sequence',
                templateUrl: 'templates/sequences/sequence/sequence.html',
                controller: 'SequenceController as sc'
            })
            .state('session.layout.sequence-action-alert-add', {
                url: '/sequences/:sequence/actions/alert/add',
                templateUrl: 'templates/sequences/sequence/actions/alert-add.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-alert-edit', {
                url: '/sequences/:sequence/actions/alert/edit',
                templateUrl: 'templates/sequences/sequence/actions/alert-edit.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-decision-add', {
                url: '/sequences/:sequence/actions/decision/add',
                templateUrl: 'templates/sequences/sequence/actions/decision-add.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-decision-edit', {
                url: '/sequences/:sequence/actions/decision/edit',
                templateUrl: 'templates/sequences/sequence/actions/decision-edit.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-delay-add', {
                url: '/sequences/:sequence/actions/delay/add',
                templateUrl: 'templates/sequences/sequence/actions/delay-add.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-delay-edit', {
                url: '/sequences/:sequence/actions/delay/edit',
                templateUrl: 'templates/sequences/sequence/actions/delay-edit.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-email-add', {
                url: '/sequences/:sequence/actions/email/add',
                templateUrl: 'templates/sequences/sequence/actions/email-add.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-email-edit', {
                url: '/sequences/:sequence/actions/email/edit',
                templateUrl: 'templates/sequences/sequence/actions/email-edit.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-event-add', {
                url: '/sequences/:sequence/actions/event/add',
                templateUrl: 'templates/sequences/sequence/actions/event-add.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-event-edit', {
                url: '/sequences/:sequence/actions/event/edit',
                templateUrl: 'templates/sequences/sequence/actions/event-edit.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-input-add', {
                url: '/sequences/:sequence/actions/input/add',
                templateUrl: 'templates/sequences/sequence/actions/input-add.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-input-edit', {
                url: '/sequences/:sequence/actions/input/edit',
                templateUrl: 'templates/sequences/sequence/actions/input-edit.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-script-add', {
                url: '/sequences/:sequence/actions/script/add',
                templateUrl: 'templates/sequences/sequence/actions/script-add.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-script-edit', {
                url: '/sequences/:sequence/actions/script/edit',
                templateUrl: 'templates/sequences/sequence/actions/script-edit.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-sequence-add', {
                url: '/sequences/:sequence/actions/sequence/add',
                templateUrl: 'templates/sequences/sequence/actions/sequence-add.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-sequence-edit', {
                url: '/sequences/:sequence/actions/sequence/edit',
                templateUrl: 'templates/sequences/sequence/actions/sequence-edit.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-skype-add', {
                url: '/sequences/:sequence/actions/skype/add',
                templateUrl: 'templates/sequences/sequence/actions/skype-add.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-skype-edit', {
                url: '/sequences/:sequence/actions/skype/edit',
                templateUrl: 'templates/sequences/sequence/actions/skype-edit.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-sms-text-add', {
                url: '/sequences/:sequence/actions/sms-text/add',
                templateUrl: 'templates/sequences/sequence/actions/sms-text-add.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-sms-text-edit', {
                url: '/sequences/:sequence/actions/sms-text/edit',
                templateUrl: 'templates/sequences/sequence/actions/sms-text-edit.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-automated-call-add', {
                url: '/sequences/:sequence/actions/automated-call/add',
                templateUrl: 'templates/sequences/sequence/actions/automated-call-add.html',
                controller: 'ActionController as ac'
            })
            .state('session.layout.sequence-action-automated-call-edit', {
                url: '/sequences/:sequence/actions/automated-call/edit',
                templateUrl: 'templates/sequences/sequence/actions/automated-call-edit.html',
                controller: 'ActionController as ac'
            })


            .state('session.layout.signin',
            {
                url: '/signin',
                templateUrl: 'templates/account/signin.html',
                controller: 'SignInController as sic',
            })
            .state('session.layout.signout',
            {
                url: '/account/signout',
                controller: 'SignOutController',
                template: ''
            })

            .state('session.layout.register', {
                url: '/account/register',
                templateUrl: 'templates/account/register.html',
                controller: 'RegisterController as rc'
            })

            .state('session.layout.account', {
                abstract: true
            })
            .state('session.layout.account.settings', {
                url: '/account/settings',
                templateUrl: 'templates/account/settings.html'
            })

            .state('session.layout.forgot', {
                url: '/account/forgot',
                templateUrl: 'templates/account/forgotpassword/email/default.html',
                controller: 'ForgotPasswordController as fc'
            })
            .state('session.layout.forgot-email-sent', {
                url: '/account/forgot/email/sent',
                templateUrl: 'templates/account/forgotpassword/email/sent.html',
                controller: 'ForgotPasswordController as fc'
            })
            .state('session.layout.forgot-email-reset', {
                url: '/account/forgot/email/reset',
                templateUrl: 'templates/account/forgotpassword/email/reset.html',
                controller: 'ForgotPasswordController as fc'
            })
            .state('session.layout.forgot-questions', {
                url: '/account/forgot/questions',
                templateUrl: 'templates/account/forgotpassword/questions/default.html',
                controller: 'ForgotPasswordController as fc'
            })
            .state('session.layout.forgot-success', {
                url: '/account/forgot/success',
                templateUrl: 'templates/account/forgotpassword/success.html'
            })

            .state('session.layout.dashboard', {
                url: '/dashboard/courses',
                templateUrl: 'templates/dashboard/courses.html',
            })

            .state('session.layout.administration',
            {
                url: '/administration',
                templateUrl: 'templates/administration/administration.html'
            })
            .state('session.layout.administration-account',
            {
                url: '/administration/account',
                templateUrl: 'templates/administration/account/account.html'
            })
            .state('session.layout.administration-account-tokens',
            {
                url: '/administration/account/tokens',
                templateUrl: 'templates/administration/account/tokens.html',
                controller: 'TokenController as tc'
            });

        //$urlRouterProvider.otherwise('/');
    }
})();