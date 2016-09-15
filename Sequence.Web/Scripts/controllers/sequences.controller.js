(function () {
    var application = angular.module('Application');

    application.controller('SequencesController', SequencesController);

    SequencesController.$inject = ['$state'];

    function SequencesController($state) {
        var vm = this;
        vm.Sequences = [];

        vm.Add = function (sequence) {
            vm.Sequences.push(angular.copy(sequence));
            sequence = {};
        }

        vm.Remove = function (sequence) {
            var index = vm.Sequences.indexOf(sequence);
            if (index >= 0) {
                vm.Sequences.splice(index, 1);
            }
        }

        vm.Edit = function (sequence) {
            $state.go('session.layout.sequence', { sequence: 1 });
        }
    }
})();