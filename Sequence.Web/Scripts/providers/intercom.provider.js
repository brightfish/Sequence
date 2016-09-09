(function () {
    'use strict';
    var application = angular.module('Application');

    application.provider('intercom', IntercomProvider);

    function IntercomProvider() {
        var self = this;

        self.$get = function () {
            return Intercom.getInstance();
        };
    }
})();