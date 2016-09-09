(function () {
    'use strict';

    angular
        .module('Application')
        .controller('SignOutController', SignOutController);

    SignOutController.$inject = ['$location', 'User', 'session', 'accountService'];

    function SignOutController($location, user, session, accountService) {
        /* jshint validthis:true */
        var vm = this;
        
        activate();

        function activate() {
            vm.User = user;

            var promise = accountService.signOut();
            promise.then(function (result) {
                vm.User.signOut();
                session.stop();
                $location.path('/account/signin');
            });
        }
    }
})();