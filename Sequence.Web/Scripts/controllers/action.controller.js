(function () {
    var application = angular.module('Application');

    application.controller('ActionController', ActionController);
    ActionController.$inject = ['$state', '$stateParams'];

    function ActionController($state, $stateParams) {
        var vm = this;

        (function () {

        })();

        vm.Add = function (action) {

            $state.go('session.layout.sequence', { sequence: $stateParams.sequence });
        }
    }
})();