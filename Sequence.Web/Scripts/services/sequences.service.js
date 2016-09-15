(function () {
    var application = angular.module('Application');

    application.factory('SequenceService', SequenceService);

    SequenceService.$inject = ['$http'];

    function SequenceService($http) {
        var service = {};

        service.GetAll = function () {
            return $http.get('api/sequences');
        }

        service.Get = function (id) {
            return $http.get('api/sequences/' + id);
        }

        service.Add = function (sequence) {
            return $http.post('api/sequences', sequence);
        }

        service.Edit = function (sequence) {
            return $http.put('api/sequences/' + sequence.Id, sequence);
        }

        service.Remove = function (sequence) {
            return $http.delete('aip/sequences/' + sequence.Id);
        }

        return service;
    }
})();