(function () {
    'use strict';

    angular
        .module('Application')
        .controller('SignInController', SignInController);

    SignInController.$inject = ['$scope', '$window', '$state', '$stateParams', 'User', 'session', 'accountService'];

    function SignInController($scope, $window, $state, $stateParams, user, session, accountService) {
        /* jshint validthis:true */
        var vm = this;
        vm.signIn = signIn;
        vm.isThereAServerError = false;

        activate();

        function activate() {
            vm.User = user;

            if (user.IsAuthenticated) {
                var promise = accountService.signOut();
                promise.then(function (result) {
                    vm.User.signOut();
                    if (session.status.enabled) {
                        session.stop();
                    }
                }, function (result) {
                    alert('Its Broke');
                });
            }
        }

        function signIn(credentials) {
            if ($scope.signInForm.$valid) {
                var promise = accountService.signIn(credentials);

                promise.then(function (result) {
                    var defaultsPromise = accountService.getUserInfo();

                    defaultsPromise.then(function (result) {
                        angular.merge(vm.User, result.data);
                        session.start();

                        if (!$stateParams.token) {
                            //var search = $location.search();
                            //if (search) {
                            //    $window.location.href = search.ReturnUrl;
                            //}

                            if (vm.User.isInRole('Support')) {
                                $state.go('session.layout.administration');
                            }
                            else if (vm.User.isInRole('Administrator')) {
                                $state.go('session.layout.courses');
                            }
                            else if (vm.User.isInRole('Instructor')) {
                                $state.go('session.layout.courses');
                            }
                        }
                        else {
                            $state.go('session.layout.link-confirm', { token: $stateParams.token });
                        }

                    }, function (result) {
                    });

                }, function (result) {
                    vm.isThereAServerError = true;
                    vm.ModelState = result.data.ModelState;
                });
            }
        }
    }
})();

