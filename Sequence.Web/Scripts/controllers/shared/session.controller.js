(function () {
    'use strict';

    var application = angular.module('Application');

    application.controller('SessionController', SessionController);

    SessionController.$inject = ['$window', '$state', '$scope', 'User', 'intercom', 'session', 'sessionService'];

    function SessionController($window, $state, $scope, user, intercom, session, sessionService) {
        /* jshint validthis:true */
        var vm = this;

        activate();

        function activate() {
            $scope.User = user;

            //if (user.IsAuthenticated) {
            //    session.start();
            //}
            //else {
            //    $state.go('session.signin');
            //}

            vm.onIntercomSessionStartListener = $scope.$on('session.intercom.start', onIntercomSessionStart);
            vm.onIntercomSessionExtendListener = $scope.$on('session.intercom.extend', onIntercomSessionExtend);
            vm.onIntercomSessionEndListener = $scope.$on('session.intercom.end', onIntercomSessionEnd);

            vm.onSessionStartListener = $scope.$on('session.start', onSessionStart);
            vm.onSessionHeartBeatListener = $scope.$on('session.heartbeat', onSessionHeartBeat);
            vm.onSessionWarnListener = $scope.$on('session.warn', onSessionWarn);
            vm.onSessionWarnCountDownListener = $scope.$on('session.warn.countdown', onSessionWarnCountDown);
            vm.onSessionEndListener = $scope.$on('session.end', onSessionEnd);
        }

        function onSessionStart() {
            session.extend();
        }

        function onSessionHeartBeat() {
            var promise = sessionService.extend();
            promise.then(function () {
                session.extend();
            }, function () {
                alert('Its broke');
            });
        }

        function onSessionWarn() {
            vm.CountDown = {};

            //var modalScope = $scope.$new();
            //modalScope.CountDown = vm.CountDown;

            //self.modal = $model.open({
            //    scope: modalScope,
            //    templateUrl: 'templates/session/extend.html'
            //});

            self.onSessionWarnInputListener = $scope.$on('session.input', onSessionWarnInput);
        }

        function onSessionWarnInput() {
            self.onSessionWarnInputListener();
            session.extend();
            intercom.emit('session.intercom.extend', {});
            //self.modal.close();
        }

        function onSessionWarnCountDown(event, seconds) {
            vm.CountDown.Minutes = Math.floor(seconds / 60);
            vm.CountDown.Seconds = Math.ceil(seconds % 60);
        }

        function onSessionEnd() {
            //self.modal.close();

            $window.onbeforeunload = null;

            $state.go('session.signin');
        }

        function onIntercomSessionStart() {
            session.extend();
        }

        function onIntercomSessionExtend() {
            //if (self.modal) {
            //    self.modal.close();
            //}
            session.extend();
        }

        function onIntercomSessionEnd() {
            session.stop();
            $window.location.href = '/instructor/account/signin';
        }

        return self;
    }
})();