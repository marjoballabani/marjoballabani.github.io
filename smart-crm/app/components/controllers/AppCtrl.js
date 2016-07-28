/**
 * Created by User on 22/06/2016.
 */
app.controller('MainAppCtrl', ['$scope', 'DataFactory', 'Constants', '$timeout', '$mdSidenav', '$log',
    function ($scope, DataFactory, Constants, $timeout, $mdSidenav, $log) {
        console.log('AppCtrl started...');
        $scope.url = Constants.url;
        $scope.selectedUrl = $scope.url[0];
        $scope.isLeftClosed = true;

        /**
         * Select a menu and render it to main view
         * @param id
         */
        $scope.selectMenu = function (id) {
            $scope.selectedUrl = $scope.url[id];
        }

        $scope.toggleLeft = buildDelayedToggler('left');
        $scope.toggleRight = buildToggler('right');
        $scope.isOpenRight = function () {
            return $mdSidenav('right').isOpen();
        }
        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */
        function debounce(func, wait, context) {
            var timer;
            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function () {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildDelayedToggler(navID) {
            return debounce(function () {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 200);
        }

        function buildToggler(navID) {
            return function () {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }
        }

        $scope.closeLeft = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
        };

        $scope.closeRight = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('right').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
        };

        $scope.mbCloseLeft = function () {
            if ($scope.isLeftClosed) {
                $scope.isLeftClosed = false;
            } else {
                $scope.isLeftClosed = true;
            }
        }


    }]);