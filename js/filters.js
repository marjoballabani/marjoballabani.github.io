var appFilters = angular.module('appFilters', []);
appFilters.filter('inDashboard', function() {
    return function(input) {
        var out = [];
        if(!input){
            return out;
        }
        for (var i = 0; i < input.length; i++) {
            if(input[i].inDashboard === true){
                out.push(input[i]);
            }
        }
        return out;
    };
});