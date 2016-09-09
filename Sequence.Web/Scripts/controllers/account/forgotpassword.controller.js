(function () {
    'use strict';

    angular
        .module('Application')
        .controller('ForgotPasswordController', ForgotPasswordController);

    ForgotPasswordController.$inject = ['$scope', '$location', 'User', 'accountService'];

    function ForgotPasswordController($scope, $location, user, accountService) {
        /* jshint validthis:true */
        var vm = this;
        vm.resetPassword = resetPassword;
        vm.sendResetPasswordEmail = sendResetPasswordEmail;
        vm.getSecurityQuestions = getSecurityQuestions;
        vm.answerSecurityQuestions = answerSecurityQuestions;
        vm.checkEmail = checkEmail;

        activate();

        function activate() {
            vm.User = user;
        }

        function resetPassword(password) {
            $scope.form.Password.$setValidity('server', true);

            if ($scope.form.$valid) {
                var search = $location.search();

                var model = {};
                model.Email = search.email;
                model.Token = search.token;
                model.Password = password;

                var promise = accountService.resetPassword(model);
                promise.then(function (result) {

                    var getUserPromise = accountService.getUserInfo();
                    getUserPromise.then(function (result) {
                        angular.merge(vm.User, result.data);

                        $location.path('/account/forgot/success');
                    });

                }, function (result) {
                    $scope.form.Password.$setValidity('server', false);

                    vm.ModelState = new ModelState(result.data.ModelState);
                    vm.ModelState.validate($scope.form);
                });
            }
        }

        function sendResetPasswordEmail(email) {
            $scope.form.Email.$setValidity('server', true);

            if ($scope.form.$valid) {
                var promise = accountService.sendResetPasswordEmail(email);
                promise.then(function (result) {
                    vm.User.Reset = {};
                    vm.User.Reset.Email = email;

                    $location.path('/account/forgot/email/sent');

                }, function (result) {

                    $scope.form.Email.$setValidity('server', false);

                    vm.ModelState = new ModelState(result.data.ModelState);
                });
            }
        }

        function getSecurityQuestions() {
            if (!vm.User.Reset) {
                $location.path('/account/forgot');
                return;
            }

            var promise = accountService.getUserSecurityQuestions(vm.User.Reset.Email);
            promise.then(function (result) {
                var model = result.data;
                vm.User.Reset.PrimarySecurityQuestion = model.PrimarySecurityQuestion;
                vm.User.Reset.SecondarySecurityQuestion = model.SecondarySecurityQuestion;

            }, function (result) {
                alert('It Broke!');
            });
        }

        function answerSecurityQuestions(model) {
            $scope.form.Email.$setValidity('server', true);
            $scope.form.PrimarySecurityAnswer.$setValidity('server', true);
            $scope.form.SecondarySecurityAnswer.$setValidity('server', true);
            $scope.form.Password.$setValidity('server', true);

            if ($scope.form.$valid) {
                model.Email = vm.User.Reset.Email;

                var promise = accountService.answerSecurityQuestions(model);
                promise.then(function (result) {

                    var getUserPromise = accountService.getUserInfo();
                    getUserPromise.then(function (result) {
                        angular.merge(vm.User, result.data);

                        $location.path('/account/forgot/success');
                    });

                }, function (result) {

                    vm.ModelState = new ModelState(result.data.ModelState);
                    vm.ModelState.validate($scope.form);

                });
            }
        }

        function checkEmail() {
            if (!vm.User.Reset) {
                $location.path('/account/forgot');
            }
        }
    }
})();

