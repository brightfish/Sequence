function ModelState(state) {
    var model = {};
    model.validate = validate;

    activate();

    function activate() {
        angular.forEach(state, function (value, key) {
            var property = null;
            if (key.includes('.')) {
                property = key.split('.')[1];
            }
            else {
                property = key;
            }

            if (property) {
                model[property] = value;
            }
        });
    }

    function validate(form) {
        angular.forEach(model, function (value, key) {
            var controller = form[key];
            if (controller) {
                controller.$setValidity('server', false);
            }
        });
    }

    return model;
}