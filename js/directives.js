'use strict';

var app = angular.module("appDirectives", []);

app.directive('switchTemplate', function($timeout) {
    return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
            var i = 0;

            if (attrs.animclass) {
                $timeout(function() {
                    element.removeClass(attrs.animclass);
                }, 300);
            }

            scope.getModify = function() {
                return attrs.templateurl;
            };
        },
        template: '<div ng-include="getModify()"></div>'
    };
});

app.directive('detectGestures', function($ionicGesture) {

    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {

            $ionicGesture.on('pinchin pinchout', scope.reportEvent, elem);

        }
    };

});


app.directive('rippleEffect', function() {

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            
            if(ionic && ionic.Platform && ionic.Platform.isIOS()){
                return; //prevent ripple effect in IOS if bug continues
            }
            /**
             * Helper function, that allows to attach multiple events to selected objects
             * @param {[object]}   el       [selected element or elements]
             * @param {[type]}   events   [DOM object events like click or touch]
             * @param {Function} callback [Callback method]
             */
            var addMulitListener = function(el, events, callback) {
                // Split all events to array
                var e = events.split(' ');

                // Loop trough all elements
//                Array.prototype.forEach.call(el, function(element, i) {
                // Loop trought all events and add event listeners to each
                Array.prototype.forEach.call(e, function(event, i) {
                    el.addEventListener(event, callback, false);
                });
//                });
            };

            /**
             * This function is adding ripple effect to elements
             * @param  {[object]} e [DOM objects, that should apply ripple effect]
             * @return {[null]}   [description]
             */
            addMulitListener(element[0], 'click touchstart', function(e) {

                var ripple = element[0].querySelector('.ripple');
                var eventType = e.type;
                /**
                 * Ripple
                 */
                if (ripple === null) {
                    // Create ripple
                    ripple = document.createElement('span');
                    ripple.classList.add('ripple');
  
                    // Prepend ripple to element
                    element[0].insertBefore(ripple, element[0].firstChild);

                    // Set ripple size
                    if (!ripple.offsetHeight && !ripple.offsetWidth) {
                        var size = Math.max(e.target.offsetWidth, e.target.offsetHeight);
                        ripple.style.width = size + 'px';
                        ripple.style.height = size + 'px';
                    }

                }

                // Remove animation effect
                ripple.classList.remove('animate_ripple');
                // get click coordinates by event type
                if (eventType === 'click') {
                    var x = e.pageX;
                    var y = e.pageY;
                } else if (eventType === 'touchstart') {
                    var x = e.changedTouches[0].pageX;
                    var y = e.changedTouches[0].pageY;
                }
                x = x - element[0].offsetLeft - ripple.offsetWidth / 2;
                y = y - element[0].offsetTop - ripple.offsetHeight / 2;
                
                // set new ripple position by click or touch position
                ripple.style.top = y + 'px';
                ripple.style.left = x + 'px';



                ripple.classList.add('animate_ripple');

                scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                    ripple.classList.remove('animate_ripple');
                });

            });

        }
    };

});

app.directive('menuOver', function($timeout, $ionicSideMenuDelegate) {

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            // Run in the next scope digest
            $timeout(function() {
                // Watch for changes to the openRatio which is a value between 0 and 1 that says how "open" the side menu is

                scope.$watch(function() {
                    return $ionicSideMenuDelegate.getOpenRatio();
                }, menuChange);

                function menuChange(ratio) {
                    if (ratio === 1) {
                        element.addClass("menu-left_open");
                        if (window.innerWidth <= 767) {
                            element.removeClass("menu_left_anim");
                        }
                    } else {
                        element.removeClass("menu-left_open");
                        if (window.innerWidth <= 767) {
                            $timeout(function() {
                                element.addClass("menu_left_anim");
                            }, 0);
                        }
                    }
                }

                var menuTriggerTimer;

                window.addEventListener('resize', function() {
                    $timeout.cancel(menuTriggerTimer);
                    menuTriggerTimer = $timeout(function() {

                        if (window.innerWidth > 767) {
                            element.removeClass("menu_left_anim");
                        }

                    }, 100);
                });
                
            });
        }
    };
});

app.directive('rotateMap', function($timeout) {

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            var diagonalLength = Math.ceil(Math.sqrt(window.innerHeight * window.innerHeight + window.innerWidth * window.innerWidth));

            var headerHeight = 56;
            var menuWidth = 295;

            scope.thisMapHeight = diagonalLength;
            scope.thisMapWidth = diagonalLength;

            var mapContainerWidth, mapContainerHeight;

            calculates();

            var calculationTimer;

            window.addEventListener('resize', function() {

                $timeout.cancel(calculationTimer);
                calculationTimer = $timeout(calculates, 25);

            });

            function calculates() {

                mapContainerHeight = window.innerHeight - headerHeight;
                if (window.innerWidth <= 767) {
                    mapContainerWidth = window.innerWidth;
                } else {
                    mapContainerWidth = window.innerWidth - menuWidth;
                }

                scope.topMinusMargin = -(scope.thisMapHeight / 2 - mapContainerHeight / 2);
                scope.leftMinusMargin = -(scope.thisMapWidth / 2 - mapContainerWidth / 2);
            }

        }
    };

});


app.directive('segmentsPerStreet', function($timeout) {

    return {
        restrict: 'A',
        scope: {
            segments: "=",
            segmentsnumber: "=segmentsnumber"
        },
        link: function(scope, element, attrs) {

            function looop(shouldWatch) {

                var inc = 0;
                for (var i = 0; i < scope.segments.length; i++) {
                    if (scope.segments[i].isSelected === true) {
                        inc++;
                    }
                }

                if (inc > 0) {
                    scope.segmentsnumber = inc;
                } else {
                    scope.segmentsnumber = 0;
                }

                if (shouldWatch !== false) {
                    scope.$watch('segments', function() {
                        looop(false);
                    }, true);
                }
            }
            ;

            $timeout(looop, 0);
        }
    };

});


app.directive("fileread", [function() {
        return {
            scope: {
                fileread: "="
            },
            link: function(scope, element, attributes) {
                element.bind("change", function(changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function(loadEvent) {
                        scope.$apply(function() {
                            scope.fileread = loadEvent.target.result;
                            document.getElementById("imageUp").src = loadEvent.target.result;
                        });
                    };
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        };
    }]);


app.directive("leafletMap", function($rootScope, appConfig, $state, $timeout, osmlayers) {
 
    var dataZoom, dataIcon = L.icon({
                iconUrl: 'assets/graphics/mapicons/location.png',
                iconSize: [32, 32],
                iconAnchor: [17, 17]
            }), watchPos;
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            
            var map;

            function initmap() {
//                if(map){
//                    scope.$broadcast('mapInited',{map:map});
//                    return;
//                }
                // set up the map
                map = new L.Map(attributes.id, {zoomControl: false});

                var osm = new L.TileLayer(
                        osmlayers.transport,
                        {minZoom: 9, maxZoom: 19, attribution: appConfig.mapAttributation}
                );

                map.attributionControl.setPrefix("");
                map.addLayer(osm);
                
                var defaultZoom = appConfig.defaultZoom;
                if(attributes["mapDefaultZoom"]){
                    defaultZoom = Number(attributes["mapDefaultZoom"]);
                }
                map.setView(new L.LatLng(appConfig.defaultLat, appConfig.defaultLon), defaultZoom);
            
                scope.$broadcast('mapInited',{map:map});

            }
            
            /* Below functions are used to set view after 
             * map is initialized */
            $rootScope.$on("myLocationRequest", function(event, data) {
                dataZoom = data.zoom;
                if(data.icon){
                    dataIcon = data.icon;
                }
            });
            
            scope.setView = function(){
                getMyLocation(dataZoom, dataIcon);
            };

            /**/
            function getMyLocation(zoom, icon) {
                /* clearing it before re-setting to prevent multiple time watchPosition */
               navigator.geolocation.clearWatch(watchPos);
               watchPos = navigator.geolocation.watchPosition(successgeo, errorgeo, {enableHighAccuracy: true,maximumAge : 0});

                function errorgeo(error) {
                    console.log("watch position error", error);
                }

                function successgeo(position) {
                    setView(position.coords.latitude, position.coords.longitude, zoom, icon);
                }
            }
            var currLocMarker;
            function setView(lat, lng, zoom, icon) {
                
                /* MY LOCATION MARKER */
                if (icon) {
                    if(!currLocMarker){
                        map.setView(new L.LatLng(lat, lng), zoom);
                      currLocMarker =  L.rotatedMarker({lat: lat, lng: lng}, {
                            icon: icon
                        }).addTo(map);
                    }else{
                        currLocMarker.setLatLng({lat: lat, lng: lng});
                    }
                }
            }

            $timeout(function() {
                initmap();
            }, $rootScope.delayOnTransition);
            
            
        }
    };
});
