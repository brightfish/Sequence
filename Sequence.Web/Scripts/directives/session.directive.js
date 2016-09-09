(function () {
    var application = angular.module('Application');
    application.directive('session', SessionDirective);

    SessionDirective.$inject = ['$parse', '$rootScope', '$window', '$timeout', 'session'];

    function SessionDirective($parse, $rootScope, $window, $timeout, session) {
        return {
            link: function (scope, element, attributes) {
                scope.status = session.status;
            }
        }
    }
})();