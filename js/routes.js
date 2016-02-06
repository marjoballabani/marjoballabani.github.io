var domHtmlEl = document.querySelector("html");

/* if on webview */
if (window.cordova) {
    document.addEventListener("deviceready", function() {
        // retrieve the DOM element that had the ng-app attribute
        angular.bootstrap(domHtmlEl, ["ionicApp"]);
        window.analytics.startTrackerWithId('UA-73327921-1');
        navigator.geolocation.getCurrentPosition(function(){},function(){});
    }, false);

    /* if in browser */
} else {
    angular.element(document).ready(function() {
        angular.bootstrap(domHtmlEl, ["ionicApp"]);
    });
    var cordovaIsUndefined = true;
}

var app = angular.module('ionicApp', [
    'ionic',
    'ui.router',
    'ngIOS9UIWebViewPatch',
    'appFactory',
    'appControllers', 
    'appDirectives',
    'appFilters',
    "ngTable"
]).config(function($httpProvider, $stateProvider, $urlRouterProvider) {


    $stateProvider.state('main', {
        url: "/main",
        abstract: true,
        templateUrl: "templates/main.html",
        controller: 'mainCtrl',
        resolve: {
            stateColor: function($rootScope,palette, $stateParams) {
                $rootScope.routeColor = palette[$stateParams.color];
                $rootScope.activeLeftMenuItem = 0;
                return '';
            }
        }

    }).state('main.blank', {
        url: "/blankstart",
        template : '<div style="width:100%;height:100%;background:white;"></div>'
    }).state('main.dashboard', {
        url: "/dashboard?extra",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/dashboard.html',
                controller: 'dashboardCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = 0;
                        return '';
                    }
                }
            }
        }
    }).state('main.transport', {
        url: "/transport/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/transport/transport.html',
                controller: 'transportCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                       $rootScope.routeColor = palette[$stateParams.color];
                       $rootScope.activeLeftMenuItem =  $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.ptransport', {
        url: "/ptransport/:type/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/transport/publictransport.html',
                controller: 'ptransportCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                       $rootScope.routeColor = palette[$stateParams.color];
                       $rootScope.activeLeftMenuItem =  $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.parking', {
        url: "/parking/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/parking/parking.html',
                controller: 'parkingCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                       $rootScope.routeColor = palette[$stateParams.color];
                       $rootScope.activeLeftMenuItem =  $stateParams.activeNr;;
                        return '';
                    }
                }
            }
        }
    }).state('main.taxi', {
        url: "/taxi/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/transport/taxi.html',
                controller: 'taxiCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                       $rootScope.routeColor = palette[$stateParams.color];
                       $rootScope.activeLeftMenuItem =  $stateParams.activeNr;;
                        return '';
                    }
                }
            }
        }
    }).state('main.traffic', {
        url: "/traffic/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/traffic/traffic.html',
                controller: 'trafficCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                       $rootScope.routeColor = palette[$stateParams.color];
                       $rootScope.activeLeftMenuItem =  $stateParams.activeNr;;
                        return '';
                    }
                }
            }
        }
    }).state('main.rltraffic', {
        url: "/rltraffic/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/traffic/rltraffic.html',
                controller: 'rltrafficCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.drivingmode', {
        url: "/drivingmode/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/traffic/drivingmode.html',
                controller: 'drivingmodeCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.cctv', {
        url: "/cctv/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/traffic/cctv.html',
                controller: 'cctvCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.poiMapCtrl', {
        url: "/poimap/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/poi/poiMap.html',
                controller: 'poiMapCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                        
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.poicategories', {
        url: "/poicategories/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/poi/poiCategories.html',
                controller: 'poiCategoriesCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $timeout, $stateParams) {
                         
                         if($rootScope.poiCatInited === true){
                             $rootScope.poiCatInitedRoute = true;
                             $timeout(function(){
                                 $rootScope.poiCatInitedRoute = false;
                             },800);
                         }
                         
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.poilist', {
        url: "/poi/list/{caregory_id:[0-9]{1,4}}/:requesturl/:category_title/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/poi/poiList.html',
                controller: 'poiListCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                        
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.poidetails', {
        url: "/poi/details/{poi_id:[0-9]{1,4}}/:requesturl/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/poi/poiDetails.html',
                controller: 'poiDetailsCtrl',
                resolve: {
                    stateColor: function($rootScope, palette, $stateParams) {
                       
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.notifications', {
        url: "/notifications/:activeNr/:color",
        params: {
            "notification_id": 0
        },
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/notification/notifications.html',
                controller: 'notificationsCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.notificationDetails', {
        url: "/notifications/:notification_id/:activeNr/:color",
        params: {
            "notification_id": 0
        },
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/notification/notificationDetails.html',
                controller: 'notificationDetailsCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.report', {
        url: "/report/:id/:iconClass/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/report/report.html',
                controller: 'reportCtrl',
                resolve: {
                    stateColor: function($rootScope , $stateParams , palette, $timeout) {
                        if($stateParams.id && $stateParams.activeNr && $stateParams.color){
                            $rootScope.routeColor = palette[$stateParams.color];
                            $rootScope.reportIcon = $stateParams.iconClass;
                            if($stateParams.id == 1){ /* from labelz => Infrastructure */
                                $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                            }else if($stateParams.id == 17){ /* from labelz => pollution */
                                $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                            }else if($stateParams.id == 9){ /* from labelz => publictransport */
                                $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                            }else if($stateParams.id == 5){ /* from labelz => illegalconstruction */
                                $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                            }else{
                                $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                            }
                        }
                        return '';
                    }
                }
            }
        }
    }).state('main.reportactions',{
        url : "/reportactions/:iconClass/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/report/reportActions.html',
                controller: "reportactionsCtrl",
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = 10;
                        return '';
                    }
                }
            }
        }
    }).state('main.myreports',{
        url : "/myreports/:iconClass/:activeNr/:color/:statusId/:rid",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/report/myReports.html',
                controller: 'myreportsCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = 10;
                        return '';
                    }
                }
            }
        }
    }).state('main.publicreports',{
        url : "/publicreports/:iconClass/:activeNr/:color/:index",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/report/publicReports.html',
                controller: 'publicreportsCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = 10;
                        return '';
                    }
                }
            }
        }
    }).state('main.settings', {
        url: "/settings/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/settings.html',
                controller: 'settingsCtrl',
                resolve: {
                    stateColor: function($rootScope , palette, $stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = 20;
                        return '';
                    }
                }
            }
        }
    }).state('main.info', {
        url: "/info/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/info/info.html',
                controller: 'infoCtrl',
                resolve: {
                    stateColor: function($rootScope ,palette,$stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.infodetails', {
        url: "/infodetails/:activeNr/:color/:getfunc/:activeinfo",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/info/infoDetails.html',
                controller: 'infoDetailsCtrl',
                resolve: {
                    stateColor: function($rootScope ,palette,$stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.administrationmap', {
        url: "/administrationmap/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/info/infoAdministrationMap.html',
                controller: 'administrationMapCtrl',
                resolve: {
                    stateColor: function($rootScope ,palette,$stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.bicycle', {
        url: "/bicycle/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/views/transport/bicycleMap.html',
                controller: 'bicycleMapCtrl',
                resolve: {
                    stateColor: function($rootScope ,palette,$stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                        $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    }).state('main.terms', {
        url: "/terms/:activeNr/:color",
        views: {
            'routeNivelTwo': {
                templateUrl: 'templates/terms.html',
                controller: 'termsCtrl',
                resolve: {
                    stateColor: function($rootScope ,palette,$stateParams) {
                        $rootScope.routeColor = palette[$stateParams.color];
                         $rootScope.activeLeftMenuItem = $stateParams.activeNr;
                        return '';
                    }
                }
            }
        }
    });

    $urlRouterProvider.otherwise("/main/dashboard");

});

