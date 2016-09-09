(function () {
    var application = angular.module('Application');

    application.provider('session', SessionProvider);

    // SessionProvider.$inject = [];

    function SessionProvider() {
        var provider = this;

        var options = {};

        provider.$get = ['$document', '$rootScope', '$interval', '$timeout', 'intercom', Session];

        function Session($document, $rootScope, $interval, $timeout, intercom) {
            var self = this;
            self.extend = extend;
            self.start = start;
            self.stop = stop;

            activate();

            function activate() {
                self.status = { enabled: false, debug: provider.debug };

                options.sessionTimespan = !provider.sessionTimespan ? 30 * 60 * 1000 : provider.sessionTimespan;
                options.heartBeatTimespan = options.sessionTimespan / 4;

                if (options.sessionTimespan >= 30 * 60 * 1000) {
                    options.interventionTimespan = 5 * 60 * 1000;
                }
                else {
                    options.interventionTimespan = Math.ceil(options.sessionTimespan * (5 / 30));
                }
                options.workingTimespan = options.sessionTimespan - options.interventionTimespan;
            }

            function start() {
                self.status.enabled = true;
                self.status.inputDetected = false;

                self.status.workingTimespan = Math.ceil(options.workingTimespan / 1000);
                self.status.sessionTimespan = options.sessionTimespan / 1000;
                self.status.timeToWarn = Math.ceil(options.workingTimespan / 1000);
                self.status.timeToSignOut = options.sessionTimespan / 1000;

                var html = $document.find('html');
                html.on('mouseover mousedown mouseup keydown keyup scroll', onInput);

                intercom.on('session.intercom.start', onIntercomSessionStart);
                intercom.on('session.intercom.extend', onIntercomSessionExtend);
                intercom.on('session.intercom.end', onIntercomSessionEnd);

                self.workingTimeout = $timeout(onWorkingTimeout, options.workingTimespan);
                self.sessionTimeout = $timeout(onSessionTimeout, options.sessionTimespan);

                self.heartBeatInterval = $interval(onSessionHearBeat, options.heartBeatTimespan);
                self.debugInterval = $interval(function () {
                    self.status.timeToWarn--;
                    self.status.timeToSignOut--;
                }, 1000);

                intercom.emit('session.intercom.start');
                $rootScope.$broadcast('session.start');
            }

            function extend() {
                self.status.inputDetected = false;

                self.status.timeToHeartbeat = options.heartBeatTimespan / 1000;
                self.status.timeToWarn = Math.ceil(options.workingTimespan / 1000);
                self.status.timeToSignOut = options.sessionTimespan / 1000;

                $timeout.cancel(self.workingTimeout);
                $timeout.cancel(self.sessionTimeout);
                $interval.cancel(self.heartBeatInterval);

                self.heartBeatInterval = $interval(onSessionHearBeat, options.heartBeatTimespan);
                self.workingTimeout = $timeout(onWorkingTimeout, options.workingTimespan);
                self.sessionTimeout = $timeout(onSessionTimeout, options.sessionTimespan);
            }

            function stop() {
                self.status.enabled = false;

                //HERE:
                //TODO:  remove all events.
                var html = $document.find('html');
                html.unbind('mouseover mousedown mouseup keydown keyup scroll', onInput);

                intercom.off('session.intercom.start');
                intercom.off('session.intercom.extend');
                intercom.off('session.intercom.end');

                $timeout.cancel(self.workingTimeout);
                $timeout.cancel(self.sessionTimeout);
                $interval.cancel(self.heartBeatInterval);
                $interval.cancel(self.debugInterval);
            }


            function onIntercomSessionStart() {
                $rootScope.$broadcast('session.intercom.start');

                self.status.intercomStart = true;
                $timeout(function () { self.status.intercomStart = false; }, 3000);
            }

            function onIntercomSessionExtend() {
                $rootScope.$broadcast('session.intercom.extend');

                self.status.intercomExtend = true;
                $timeout(function () { self.status.intercomExtend = false; }, 3000);
            }

            function onIntercomSessionEnd() {
                $rootScope.$broadcast('session.intercom.end');

                self.status.intercomEnd = true;
                $timeout(function () { self.status.intercomEnd = false; }, 3000);
            }

            function onInput() {
                $rootScope.$broadcast('session.input');
                if (!self.status.inputDetected) {
                    self.status.inputDetected = true;
                    $rootScope.$apply();
                }
            }

            function onSessionHearBeat() {
                if (self.status.inputDetected) {
                    intercom.emit('session.intercom.extend');
                    $rootScope.$broadcast('session.heartbeat');
                    extend();
                }
            }

            function onWorkingTimeout() {
                $rootScope.$broadcast('session.warn');
                self.countdown = options.interventionTimespan / 1000;
                onCountDownInterval();
                self.countDownInterval = $interval(onCountDownInterval, 1000);
            }

            function onCountDownInterval() {
                self.countdown = Math.max(0, --self.countdown);
                self.countdown = Math.ceil(self.countdown);
                $rootScope.$broadcast('session.warn.countdown', self.countdown);
            }

            function onSessionTimeout() {
                
                $interval.cancel(self.countDownInterval);
                intercom.emit('intercom.session.end');
                $rootScope.$broadcast('session.end');
            }

            return self;
        }
    }
})();