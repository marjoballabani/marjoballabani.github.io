/**
 * Created by User on 22/06/2016.
 */
var app = angular.module('SmartCrmApp',[
    'ngRoute',
    'ngMaterial',
    'chart.js',
    'md.data.table'
]);

(function () {
    'use strict';
    
    /**
     * NG application configuration
     */
    app.config(['$routeProvider', '$mdIconProvider' , function ($routeProvider, $mdIconProvider) {
        $mdIconProvider
            .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
            .iconSet('device', 'img/icons/sets/device-icons.svg', 24)
            .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24)
            .defaultIconSet('img/icons/sets/core-icons.svg', 24);
        $routeProvider
            .when("/",{
                templateUrl: 'app/components/views/home/home.html',
                controller: 'MainAppCtrl'
            })
            .when("/login",{
                templateUrl: 'app/components/views/login/login.html',
                controller: 'LoginCtrl'
            })
            .otherwise({
            redirectTo: '/'
        });
    }]);
    
    /**
     * Execute when application runs
     */
    app.run([ function () {
        
    }]);
})();