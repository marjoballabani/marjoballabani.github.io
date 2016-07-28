/**
 * Created by User on 27/07/2016.
 */
app.controller('LoginCtrl', ['$scope', '$log', '$location', function ($scope, $log, $location) {
    $scope.login = function () {
        $location.path('/')
    }
}]);