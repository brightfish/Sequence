(function () {
    'use strict';

    angular
        .module('Application')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope', '$filter', '$location', '$stateParams', 'accountService', 'User'];

    function RegisterController($scope, $filter, $location, $stateParams, accountService, user) {
        /* jshint validthis:true */
        var vm = this;
        vm.register = register;
        vm.primarySecurityQuestionChanged = primarySecurityQuestionChanged;
        vm.secondarySecurityQuestionChanged = secondarySecurityQuestionChanged;

        activate();

        function activate() {
            vm.User = user;
            vm.Token = $stateParams.token;

            if (user.IsAuthenticated) {
                var promise = accountService.signOut();
                promise.then(function (result) {
                    vm.User.signOut();
                }, function (result) {
                    alert('Its Broke');
                });
            }

            vm.PrimarySecurityQuestions = accountService.getSecurityQuestions();
            vm.SecondarySecurityQuestions = angular.copy(vm.PrimarySecurityQuestions);
            vm.Account = {};

            vm.Account.PrimarySecurityQuestion = '';
            vm.Account.SecondarySecurityQuestion = '';
        }

        function primarySecurityQuestionChanged() {

            angular.forEach(vm.SecondarySecurityQuestions, function (value) {
                value.Selected = false;
            });

            $filter('filter')(vm.SecondarySecurityQuestions, { Question: vm.Account.PrimarySecurityQuestion }, true)[0].Selected = true;
        }

        function secondarySecurityQuestionChanged() {

            angular.forEach(vm.PrimarySecurityQuestions, function (value) {
                value.Selected = false;
            });

            $filter('filter')(vm.PrimarySecurityQuestions, { Question: vm.Account.SecondarySecurityQuestion }, true)[0].Selected = true;
        }

        function register(account) {
            var form = $scope.createAccountForm;            
            form.GivenName.$setValidity('server', true);
            form.Surname.$setValidity('server', true);
            form.Email.$setValidity('server', true);
            form.Password.$setValidity('server', true);
            form.PrimarySecurityQuestion.$setValidity('server', true);
            form.PrimarySecurityAnswer.$setValidity('server', true);
            form.SecondarySecurityQuestion.$setValidity('server', true);
            form.SecondarySecurityAnswer.$setValidity('server', true);

            if ($scope.createAccountForm.$valid) {
                account.Token = $stateParams.token;
                var promise = accountService.register(account);

                promise.then(function (result) {
                    var getUserPromise = accountService.getUserInfo();

                        getUserPromise.then(function (result) {
                            //Success
                            angular.merge(vm.User, result.data);
                            $location.path('/account/link/confirm/{token}'.replace('{token}', $stateParams.token));

                        }, function (result) {
                            //Failed

                            vm.ModelState = result.data.ModelState;
                        });
                    },
                    function (result) {
                        vm.ModelState = result.data.ModelState;
                        angular.forEach(result.data.ModelState, function (value, key) {
                            var property;
                            if (key == '') {
                                property = key.replace('', 'Email');
                            }
                            else {
                                property = key.replace('model.', '');
                            }
                            $scope.createAccountForm[property].$setValidity('server', false);
                        });
                    }
               );
            }
        }
    }
})();