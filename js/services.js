'use strict';

var appFactory = angular.module('appFactory', []);



appFactory.factory('dbData', function($http, $q, $rootScope) {

    var sensorDataDomain = 'http://tiranamobility.altirana.com/';
    
    var sensorDataDomainHttps = 'https://tiranamobility.altirana.com/';

    var basePoiUrl = "http://tiranamobility.altirana.com/indexJson.php?";

//    var basePoiUrl = "http://192.168.1.114/tirana_mobility_2014/indexJson.php?";


    var rest = {};
    var localData = {};
    var urls = {};

    
    urls.getStreets = sensorDataDomain + 'livetraffic/mapdata/getStreets.php?callback=JSON_CALLBACK';

    urls.routesData = sensorDataDomain + 'livetraffic/mapdata/getMeasurements.php?callback=JSON_CALLBACK';

    urls.markers = sensorDataDomain + 'livetraffic/mapdata/getCCTV.php?callback=JSON_CALLBACK';
    
    urls.publicTransport = sensorDataDomain + 'livetraffic/mapdata/getPublicTransport.php?callback=JSON_CALLBACK';
    urls.publicTransportInterurban =  sensorDataDomain + 'livetraffic/mapdata/getInterurbanTransport.php?callback=JSON_CALLBACK';
    urls.getBicycles = sensorDataDomain + 'livetraffic/mapdata/getBicycles.php?callback=JSON_CALLBACK';
//urls.publicTransport = 'assets/data/linjaturbane.json';

//  urls.notificationsNumber = "assets/data/notification_number.json";

    urls.notificationsList = sensorDataDomain + "livetraffic/notifications/getNotificationList.php?callback=JSON_CALLBACK";

    /* Local data Settings and other calls to cordova */
    urls.getSettings = sensorDataDomain + 'livetraffic/notifications/getUserSettings.php?callback=JSON_CALLBACK';

    urls.postSettings = sensorDataDomain + 'livetraffic/notifications/postUserSettings.php?callback=JSON_CALLBACK';

    urls.menuItems = 'assets/data/menu_items.json';
    urls.language = 'assets/data/language.json';
    
    urls.getParking = sensorDataDomain+"parkimet/getParking.php?callback=JSON_CALLBACK";
    
    urls.getTaxi = sensorDataDomain+"taxi/getTaxi.php?callback=JSON_CALLBACK"
    
    /* POI */
    urls.getPoi =  sensorDataDomain+"poi/getPoi.php?callback=JSON_CALLBACK";
    
    /* Report */
    urls.postReport = sensorDataDomain +"raportime/postRaportim.php?callback=JSON_CALLBACK";
    
    urls.getReportCategories = sensorDataDomain +"raportime/getRaportimKategorite.php?callback=JSON_CALLBACK";
    
    urls.getUserReports =  sensorDataDomain +"raportime/getUserReports.php?callback=JSON_CALLBACK&u="+new Date().getTime();
    
    urls.getRaportimStatuses =   sensorDataDomain +"raportime/getRaportimStatuses.php?callback=JSON_CALLBACK";
    
    urls.getPublicReports = sensorDataDomain +"raportime/getPublicReports.php?callback=JSON_CALLBACK";

    /* INFO */
    
    urls.getInfo = sensorDataDomain+"info/getInfo.php?callback=JSON_CALLBACK";
    
    urls.getNjesite = sensorDataDomain+"info/getNjesite.php?callback=JSON_CALLBACK";
    
    urls.getFshatrat = sensorDataDomain+"info/getFshatrat.php?callback=JSON_CALLBACK";
    
    urls.getNjesiteLayers = sensorDataDomain+"info/getNjesiteLayers.php?callback=JSON_CALLBACK";
    
    urls.getNdermarrjet = sensorDataDomain+"info/getNdermarrjet.php?callback=JSON_CALLBACK";
    
    urls.getKopshtet = sensorDataDomain+"info/getKopshtet.php?callback=JSON_CALLBACK";
    
    urls.getShkollat = sensorDataDomain+"info/getShkollat.php?callback=JSON_CALLBACK";
    
    urls.getShkollatKom = sensorDataDomain+"info/getShkollatKom.php?callback=JSON_CALLBACK";
    
    urls.getAdress = sensorDataDomain+"livetraffic/mapdata/getAddress.php?callback=JSON_CALLBACK";

    var getData = function(URL) {
        var defer = $q.defer();
        var ajaxcall;

        if (URL.indexOf("JSON_CALLBACK") !== -1) {
            ajaxcall = $http.jsonp(URL);
        } else {
            ajaxcall = $http.get(URL);
        }

        var thisData = ajaxcall.success(function(data) {
            defer.resolve(data);
        }).error(function(error) {
            defer.reject(error);
        });

        return defer.promise;

    };

    var generatePoiUrl = function(paramss) {
        if (typeof paramss === "undefined") {
            paramss = {};
        }

        var url = basePoiUrl;

        /* process */
        var process = paramss.process || "ap_prcss=categoryList";
        url = url + "" + process;

        /* id */
        if (paramss.id) {
            url = url + "&k=" + paramss.id;
        }
        /* search */
        if (paramss.search) {
            url = url + "&search=" + paramss.search;
        }

        /* language */
        var lang = paramss.ln || 1;
        url = url + "&ln=" + lang + "&timeunique=" + (new Date().getTime()) + "&callback=JSON_CALLBACK";
        return url;
    };

    /* 1.) call for 2.) process 3.)  */
    rest.getPoiData = function(obj) {
        var promise = getData(generatePoiUrl(obj));
        return promise;
    };

    /* SERVER DATA */
    rest.getData = function(url, params) {

        var link = urls[url];
        if (params && params.length) {
            link += params;
        }
        var promise = getData(link);
        return promise;
    };

    /* Settings and other calls to cordova */
    rest.localData = function(method, obj) {

        if (window.cordova) {
            var postArr = (typeof obj !== "undefined") ? [obj] : [];

            var defer = $q.defer();
            cordova.exec(function(data) {
                defer.resolve(data);
            }, function(error) {
                defer.resolve(error);
            }, "HybridBridge", method, postArr);
            return defer.promise;
        } else {
            /*browser fallback*/
            var link = urls[method];

            link += "&userID=9be35a09ddfcf9e276ca756cbdcc79_1430731606239";

            var promise = getData(link);
            return promise;
        }
    };

    rest.postData = function(url,data, success, error) {
      
        var defer = $q.defer();

        var ajaxpost = $http({
            url: urls[url],
            method: "POST",
//            crossDomain: true,
//            dataType: 'jsonp',
//            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {'message': data}
        });

        var thisData = ajaxpost.success(function(data) {
            defer.resolve(data);
        }).error(function(error) {
            defer.reject(error);
        });
        return defer.promise;
    };

    return rest;
});

/* keeps app constants & configs */
appFactory.factory('appConfig', function() {

    var config = {
        mapAttributation : '<a href="javascript:openUrl(\'https://www.openstreetmap.org/copyright\')">&copy OpenStreetMap</a> contributors',
        defaultLat : 41.3278,
        defaultLon : 19.8174,
        defaultZoom : 13
    };
    return config;

});

appFactory.factory('modal', function($rootScope, $ionicModal, $timeout) {

    var modalFunc = {};
    /**
     * @param {Object} config 
     *      @requires 1.config.name 
     *       2.config.scope,
     *       3.config.open
     *       4.config.loader (if modal has loader,
     *                       contains loader duration in milliseconds)
     *       4.config.animation, etc
     * @returns {Object} modalFunc
     */
    modalFunc.createModal = function(config){
        
        var scope = (config.scope || $rootScope);
        if(!config.name){console.error("CreateModal => modal name is required!");return;}
        var name = config.name;
        var template = (config.template || 'templates/modal/'+config.name+'.html');
        if(!scope[name]){
            $ionicModal.fromTemplateUrl(template, {
                scope: scope,
                animation: (config.animation || 'slide-in-up'),
                backdropClickToClose: (config.backdropClickToClose || true) 
            }).then(function(modal) {
                scope[name] = modal;
                /**
                 * if should open immediatelly
                 */
                if(config.open){
                    /**
                     * If has loader , loader millisecond time
                     */
                    if(config.loader){
                        scope.showFullSpinner = true;
                        $timeout(function(){
                            scope.showFullSpinner = false;
                        }, config.loader);
                    }
                    scope[name].show();
                }
            });
        }else{
            scope[name].show();
        }
    };
    
    /** 
     * @param {String} name name of modal
     * @param {Object} scope scope where modal is saved
     *   */
    modalFunc.openModal = function(name, scope){
        var sc = scope || $rootScope;
        sc[name].show();
    };
    
    /** 
     * @param {String} name name of modal
     * @param {Object} scope scope where modal is saved
     *   */
    modalFunc.closeModal = function(name,scope){
        var sc = scope || $rootScope;
        sc[name].hide();
    };
    /** 
     * @param {String} name name of modal
     * @param {Object} scope scope where modal is saved
     *   */
    modalFunc.deleteModal = function(name,scope){
        var sc = scope || $rootScope;
        sc[name].remove();
        sc[name] = undefined;
    };
    
    /* save it in global scope in order not to include it every time needed,
     * just inject it once in main(parent) controller */
    $rootScope.createModal = modalFunc.createModal;
    $rootScope.openModal = modalFunc.openModal;
    $rootScope.closeModal = modalFunc.closeModal;
    $rootScope.deleteModal = modalFunc.deleteModal;
    
    return modalFunc;
});

/* app map tile provider url-se */
appFactory.factory('osmlayers', function($http, $q, $rootScope) {

    var osmlayers = {
        "standart": "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "cycle": "http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
        "transport": "http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png",
        "mapquest": "http://otile2.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png",
        "humanitarian": "http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    };
    return osmlayers;
});


appFactory.factory('getColorForPercentage', function() {
    var percentColors = [
        {pct: 0.0, color: {r: 0xff, g: 0x00, b: 0}},
        {pct: 0.5, color: {r: 0xff, g: 0xff, b: 0}},
        {pct: 1.0, color: {r: 0x00, g: 0xff, b: 0}}];

    var getColorForPercentage = function(pct) {
        for (var i = 1; i < percentColors.length - 1; i++) {
            if (pct < percentColors[i].pct) {
                break;
            }
        }
        var lower = percentColors[i - 1];
        var upper = percentColors[i];
        var range = upper.pct - lower.pct;
        var rangePct = (pct - lower.pct) / range;
        var pctLower = 1 - rangePct;
        var pctUpper = rangePct;
        var color = {
            r: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
            g: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        };
        return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    };

    return getColorForPercentage;

});

/* gets user id from url */
appFactory.factory('userID', function() {

    var userid;
    if (window.location.search.indexOf('?userID=') !== -1) {
        userid = window.location.search.split('?userID=')[1];
        userid = userid.split("&")[0];
    } else {
        userid = "";
    }
    return userid;

});

appFactory.factory('language', function() {

    var language;
    if (window.location.search.indexOf('&lng=') !== -1) {
        language = window.location.search.split('&lng=')[1];
        language = language.split("&")[0];
    } else {
        language = "";
    }
    return language;
});


appFactory.factory('week', function() {
    var week = {
        "EN": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "AL": ["Hene", "Marte", "Merkure", "Enjte", "Premte", "Shtune", "Diel"]
    };

    return week;
});

appFactory.factory('palette', function() {

    var palette = {
        red: "#e60000",
        reds: "#990000",
        yellow: "#fecb00",
        orange: "#ff5400",
        violet: "#9c2aa0",
        green: "#428600",
        blue: "#00b0ca",
        lblue: "#1299f6",
        brown: "#795548"
    };

    return palette;
});
