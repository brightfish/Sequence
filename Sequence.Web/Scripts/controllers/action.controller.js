(function () {
    var application = angular.module('Application');

    application.controller('ActionController', ActionController);

    function ActionController() {
        var vm = this;
        vm.Sequence = {};
        vm.Sequence.Actions = [];
        vm.Actions = [
            { Type: 'Alert' },
            { Type: 'Decision' },
            { Type: 'Delay' },
            { Type: 'Email' },
            { Type: 'Event' },
            { Type: 'Input' },
            { Type: 'Script' },
            { Type: 'Sequence' },
            { Type: 'Skype' },
            { Type: 'SMS Text' },
            { Type: 'Automated Call' },
        ];

        vm.Remove = function (action) {
            var index = vm.Sequence.Actions.indexOf(action);

            if (index >= 0) {
                vm.Sequence.Actions.splice(index, 1);
            }
        }
    }
})();