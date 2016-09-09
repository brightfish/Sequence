(function () {
    'use strict';

    var application = angular.module('Application');

    application.factory('sessionService', SessionService);

    SessionService.$inject = ['$http'];

    function SessionService($http) {
        var service = {
            extend: extend,
        };

        function extend() {
            return $http.post('api/session/extend');
        }

        return service;
    }
})();