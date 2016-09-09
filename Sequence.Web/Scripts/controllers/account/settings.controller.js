(function () {
    'use strict';

    angular
        .module('Application')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$scope', 'accountService', 'User', '$location', '$filter', '$timeout'];

    function SettingsController($scope, accountService, user, $location, $filter, $timeout) {
        /* jshint validthis:true */
        var vm = this;
        vm.primarySecurityQuestionChanged = primarySecurityQuestionChanged;
        vm.secondarySecurityQuestionChanged = secondarySecurityQuestionChanged;
        vm.updatePersonalDetails = updatePersonalDetails;
        vm.updateSecurityQuestions = updateSecurityQuestions;
        vm.changePassword = changePassword;

        vm.PersonalDetails = {};
        vm.SecurityQuestions = {};
        vm.PasswordDetails = {};
        vm.PersonalDetailsSaved = false;
        vm.SecurityQuestionsSaved = false;
        vm.PasswordSaved = false;
        activate();

        function activate() {
            vm.User = user;
            if (!user.IsAuthenticated) {
                $location.path('/account/signin');
            }
            else {
                vm.PersonalDetails.GivenName = vm.User.GivenName;
                vm.PersonalDetails.Surname = vm.User.Surname;
                vm.PersonalDetails.Email = vm.User.Email;

                vm.PrimarySecurityQuestions = accountService.getSecurityQuestions();
                vm.SecondarySecurityQuestions = angular.copy(vm.PrimarySecurityQuestions);

                var promise = accountService.getUserSecurityQuestions(vm.User.Email);
                promise.then(function (result) {
                    vm.SecurityQuestions.PrimarySecurityQuestion = result.data.PrimarySecurityQuestion;
                    vm.SecurityQuestions.SecondarySecurityQuestion = result.data.SecondarySecurityQuestion;
                }, function (result) {
                    alert('Its Broke');
                });
            }
        }

        function primarySecurityQuestionChanged() {

            angular.forEach(vm.SecondarySecurityQuestions, function (value) {
                value.Selected = false;
            });

            $filter('filter')(vm.SecondarySecurityQuestions, { Question: vm.SecurityQuestions.PrimarySecurityQuestion }, true)[0].Selected = true;
        }

        function secondarySecurityQuestionChanged() {

            angular.forEach(vm.PrimarySecurityQuestions, function (value) {
                value.Selected = false;
            });

            $filter('filter')(vm.PrimarySecurityQuestions, { Question: vm.SecurityQuestions.SecondarySecurityQuestion }, true)[0].Selected = true;
        }

        function updatePersonalDetails(personalDetails) {
            var form = $scope.updatePersonalDetailsForm;
            form.GivenName.$setValidity('server', true);
            form.Surname.$setValidity('server', true);
            form.Email.$setValidity('server', true);

            if ($scope.updatePersonalDetailsForm.$valid) {
                var promise = accountService.updatePersonalDetails(personalDetails);

                promise.then(function (result) {
                    var getUserPromise = accountService.getUserInfo();

                    getUserPromise.then(function (userInfoResult) {
                        //Success
                        angular.merge(vm.User, userInfoResult.data);
                    }, function (userInfoResult) {
                        //Failed
                        vm.ModelState = userInfoResult.data.ModelState;
                    });
                    vm.PersonalDetailsSaved = true;
                    $timeout(function () {
                        vm.PersonalDetailsSaved = false;
                    }, 3000);
                },
                function (result) {
                    vm.ModelState = result.data.ModelState;
                    angular.forEach(result.data.ModelState, function (value, key) {
                        var property;

                        property = key.replace('model.', '');

                        $scope.updatePersonalDetailsForm[property].$setValidity('server', false);
                    });
                });
            }
        }

        function updateSecurityQuestions(securityQuestions) {
            var form = $scope.updateSecurityQuestionsForm;
            form.PrimarySecurityQuestion.$setValidity('server', true);
            form.PrimarySecurityAnswer.$setValidity('server', true);
            form.SecondarySecurityQuestion.$setValidity('server', true);
            form.SecondarySecurityAnswer.$setValidity('server', true);

            if ($scope.updateSecurityQuestionsForm.$valid) {
                var promise = accountService.updateSecurityQuestions(securityQuestions);

                promise.then(function (result) {
                    vm.SecurityQuestionsSaved = true;
                    $timeout(function () {
                        vm.SecurityQuestionsSaved = false;
                    }, 3000);
                },
                function (result) {
                    vm.ModelState = result.data.ModelState;
                    angular.forEach(result.data.ModelState, function (value, key) {
                        var property;

                        property = key.replace('model.', '');

                        $scope.updateSecurityQuestionsForm[property].$setValidity('server', false);
                    });
                });
            }
        }

        function changePassword(passwordDetails) {
            var form = $scope.updatePasswordForm;
            form.OldPassword.$setValidity('server', true);
            form.NewPassword.$setValidity('server', true);
            form.ConfirmPassword.$setValidity('server', true);

            if ($scope.updatePasswordForm.$valid) {
                var promise = accountService.changePassword(passwordDetails);

                promise.then(function (result) {
                    vm.PasswordSaved = true;
                    $timeout(function () {
                        vm.PasswordSaved = false;
                    }, 3000);
                },
                function (result) {
                    vm.ModelState = result.data.ModelState;
                    angular.forEach(result.data.ModelState, function (value, key) {
                        var property;

                        if (key === '') {
                            property = 'OldPassword';
                        }
                        else {
                            property = key.replace('model.', '');
                        }

                        $scope.updatePasswordForm[property].$setValidity('server', false);
                    });
                });
            }
        }
    }
})();