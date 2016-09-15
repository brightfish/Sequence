(function () {
    var application = angular.module('Application');

    application.controller('SequenceController', SequenceController);

    SequenceController.$inject = ['$scope', '$state', '$stateParams']

    function SequenceController($scope, $state, $stateParams) {
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

        vm.Add = function (action) {
            var scope = $scope.$new();
            scope.Action = action;
            switch (action.Type) {
                case 'Alert':
                    $state.go('session.layout.sequence-action-alert-add', { sequence: $stateParams.sequence });
                    break;
                case 'Decision':
                    $state.go('session.layout.sequence-action-decision-add', { sequence: $stateParams.sequence });
                    break;
                case 'Delay':
                    $state.go('session.layout.sequence-action-delay-add', { sequence: $stateParams.sequence });
                    break;
                case 'Email':
                    $state.go('session.layout.sequence-action-email-add', { sequence: $stateParams.sequence });
                    break;
                case 'Event':
                    $state.go('session.layout.sequence-action-event-add', { sequence: $stateParams.sequence });
                    break;
                case 'Input':
                    $state.go('session.layout.sequence-action-input-add', { sequence: $stateParams.sequence });
                    break;
                case 'Script':
                    throw 'Not Implemented';
                    $state.go('session.layout.sequence-action-script-add', { sequence: $stateParams.sequence });
                    break;
                case 'Sequence':
                    $state.go('session.layout.sequence-action-sequence-add', { sequence: $stateParams.sequence });
                    break;
                case 'Skype':
                    $state.go('session.layout.sequence-action-skype-add', { sequence: $stateParams.sequence });
                    break;
                case 'SMS Text':
                    $state.go('session.layout.sequence-action-sms-text-add', { sequence: $stateParams.sequence });
                    break;
                case 'Automated Call':
                    $state.go('session.layout.sequence-action-automated-call-add', { sequence: $stateParams.sequence });
                    break;
                default:
                    throw 'Not Implemented';
            }
        }

        vm.Edit = function (action) {
            $state.go('session.layout.sequence', { id: action.id });
        }
    }
})();