var User = function (data) {
    'use strict';
    var self = this;

    self.IsAuthenticated = data.IsAuthenticated;
    self.GivenName = data.GivenName;
    self.Surname = data.Surname;
    self.Email = data.Email;

    self.Roles = [];
    if (data.Roles) {
        self.Roles = data.Roles;
    }

    self.isInRole = function (role) {
        var injector = angular.injector(['ng']);
        var $filter = injector.get('$filter');
        if ($filter('filter')(self.Roles, role, true)[0]) {
            return true;
        } else {
            return false;
        }
    };

    self.signOut = function () {
        self.Roles = [];
        self.IsAuthenticated = false;
        self.GivenName = null;
        self.Surname = null;
        self.Email = null;
    };

    return self;
};