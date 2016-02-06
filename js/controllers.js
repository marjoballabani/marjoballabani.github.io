'use strict';

var appControllers = angular.module('appControllers', []);

appControllers.controller('mainCtrl', function($rootScope, $ionicHistory, language, modal, $scope, $state, $stateParams, $ionicPopover, $ionicSideMenuDelegate, userID, $timeout, dbData, $location, $ionicScrollDelegate) {
    
    $rootScope.$on('$stateChangeSuccess', function (event) {
        if(window.analytics){
            window.analytics.trackView($location.path());
        }
    });

/** firstly go to  */

    $rootScope.delayOnTransition = 400;

    $rootScope.cctvImgRefreshDelay = 20000;

    $rootScope.language = (language === "2") ? "2" : "1";

    $rootScope.gpsMsgShow = true;

    $rootScope.makeToast = function(text) {
        dbData.localData('toast', text).then(function() {
        }, function() {
        });
    };

    $rootScope.openUrl = function(url) {
        dbData.localData('openUrl', url).then(function() {
        }, function() {
        });
    };

    $rootScope.layerStyle = function(feature) {
        return {
            color: feature.properties.stroke,
            fillColor: feature.properties["fill"],
            fillOpacity: feature.properties["fill-opacity"],
            weight: feature.properties["stroke-width"],
            opacity: feature.properties['stroke-opacity']
        }
    };
    $rootScope.getReportsShouldCall = function() {
        if (typeof $rootScope.reportCategories == "undefined"
                || typeof $rootScope.reportData == "undefined"
                || typeof $rootScope.reportsPublic == "undefined") {
            return true;
        } else {
            return false;
        }
    }
    $rootScope.getReports = function() {
        if ($rootScope.getReportsShouldCall()) {

            dbData.getData("getReportCategories").then(function(data) {
                $rootScope.reportCategories = data;

                dbData.localData("getUserReports", {userID: userID}).then(
                        function(data) {
                            $rootScope.reportData = data;

                            /* TEMPORARY TESTING PURPOSES */
                            if (!window.cordova && !$rootScope.reportData.report.length) {
                                $rootScope.reportData.report = [
                                    {
                                        "id": "66",
                                        "adresa": "Rruga Gjon Buzuku",
                                        "status": "1",
                                        "status_date": "2015-09-18 17:11:17",
                                        "data_in": "2015-09-18 17:11:17",
                                        "notes": "",
                                        "lat": "41.3278",
                                        "lon": "19.8174",
                                        "pershkrimi": "Bvc",
                                        "rid": "6RGX1",
                                        "kategoria": "1"
                                    },
                                    {
                                        adresa: "Rruga Jakov Xoxa",
                                        data_in: "2015-12-11 12:55:40",
                                        id: "260",
                                        kategoria: "0",
                                        lat: "0",
                                        lon: "0",
                                        notes: "",
                                        pershkrimi: "Desc test 2",
                                        rid: "6RGX0",
                                        status: "2",
                                        status_date: "2015-12-11 12:55:40",
                                        user_id: "ea6f416270128f11defae305fa6f11"
                                    }
                                ];
                            }

                            $rootScope.$broadcast('userreports');
                        },
                        function() {
                            $state.go('main.dashboard');
                        });
                dbData.getData("getPublicReports").then(function(data) {

                    $rootScope.reportsPublic = data;
                    $rootScope.$broadcast('publicreports', data);
                }, function(error) {
                    $state.go('main.dashboard');
                });
            });
        } else {
            $rootScope.$broadcast('publicreports', $rootScope.reportsPublic);
        }
    }

    dbData.getData("language").then(function(data) {
        $rootScope.labelz = data[(language === "2") ? "EN" : "AL" ];
        $rootScope.$broadcast("gotLabelz");
    });

    dbData.getData("menuItems").then(function(data) {
        $rootScope.menuItems = data;
    }, function() {
        $rootScope.menuItems = [];
        console.error("No menu items");
    });

    $timeout(function() {
        $scope.openPopover();
    }, 500);

    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        $rootScope.showPopupMaterial = false;
    });

    $scope.openPopover = function($e) {
        if ($scope.popover) {
            $scope.popover.show($e);
            $rootScope.showPopupMaterial = true;
        } else {
            createPopover();
        }
    };

    var createPopover = function() {
        $ionicPopover.fromTemplateUrl('templates/popover/popover.html', {
            scope: $rootScope
        }).then(function(popover) {
            $scope.popover = popover;
        });
    };
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if ($scope.popover && $scope.popover.isShown()) {
            $scope.popover.hide();
        }

        if ($scope.searchShow === true) {
            $scope.searchShow = false;
            $scope.searchAnimClass = false;
        }
    });


    $scope.onSwipeLeft = function() {
        $ionicSideMenuDelegate.toggleRight();
    };

    $scope.onSwipeRight = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.classs = '';
    $scope.toggleMenu = function(state) {

        if (window.innerWidth >= 680) {
            return;
        }
        if (state === 'close') {
            $scope.classs = 'open close';
            $timeout(function() {
                $scope.classs = '';
            }, 700);
        } else {
            $scope.classs = 'open';
        }

    };

    $scope.$watch(function() {
        return $ionicSideMenuDelegate.isOpen();
    }, function(value) {
        if (value === false) {
            $scope.toggleMenu("close");
        }
    });

    $scope.searchShow = false;
    $scope.searchAnimClass = false;
    $scope.searched = "";

    $scope.search = function(text) {
        if (text === "" && $scope.searched === "") {
            $scope.toggleSearch();
        }
        $scope.searched = text;
        if (text === '' || text.length <= 2) {
            $scope.poiSearchList = [];
            return;
        }
        $scope.isSearching = true;
        dbData.getPoiData({process: "ap_prcss=poiSearch", search: text, ln: $rootScope.language}).then(function(data) {
            $scope.poiSearchData = data;
            $scope.poiSearchList = data.poi_list;
            $timeout(function() {
                $scope.isSearching = false;
            }, 800);

        }, function() {

            var obj = $ionicHistory.backView();
            if (obj && obj.stateName) {
                $state.go(obj.stateName, obj.stateParams);
            } else {
                $state.go('main.poicategories');
            }

            $rootScope.makeToast($rootScope.labelz.error_poi_search);

        });
    };


    $scope.toggleSearch = function() {
        $rootScope.$broadcast("searchToggled", !$scope.searchShow);

        $scope.searchAnimClass = !$scope.searchAnimClass;
        $timeout(function() {
            $scope.searchShow = !$scope.searchShow;
            $scope.poiSearchList = [];
        }, 500);

    };

    $scope.scrollTo = function(id) {
        $location.hash(id);
        var handle = $ionicScrollDelegate.$getByHandle('content');
        handle.anchorScroll(true);
    };
});

appControllers.controller('dashboardCtrl', function($rootScope, $state,userID, $location, language,$stateParams, dbData, $scope, $timeout) {
    $timeout(function() {
        $scope.gridShow = true;
    }, 800);
  
//    try{
//        if ($stateParams.extra) {
//            window.location.hash = $stateParams.extra;
//        }
//    }catch(e){}
   
});

appControllers.controller('transportCtrl', function($rootScope, $scope, $ionicPopover, $state, dbData, appConfig, $timeout, $stateParams, osmlayers) {
    $timeout(function() {
        $scope.gridShow = true;
    }, 500);
});

appControllers.controller('ptransportCtrl', function($rootScope, $scope, $ionicPopover, $state, dbData, appConfig, $timeout, $stateParams, osmlayers) {
    $scope.showFullSpinner = true;

    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 1500);

    if (!$scope.title) {
        if (!$rootScope.labelz) {
            $rootScope.$on("gotLabelz", function() {
                $scope.title = ($stateParams.type === 'publicTransport') ? $rootScope.labelz.public_transport : $rootScope.labelz.public_transport_interurban;
            })
        } else {
            $scope.title = ($stateParams.type === 'publicTransport') ? $rootScope.labelz.public_transport : $rootScope.labelz.public_transport_interurban;
        }
    }



    var geoObj;

    var myyIcon = L.icon({
        iconUrl: 'assets/graphics/mapicons/busstop.png',
        iconRetinaUrl: 'assets/graphics/mapicons/busstop.png',
        iconSize: [28, 28],
        iconAnchor: [14, 14], /* shtohen si margin top, left me minus pozicionit te markerit */
        popupAnchor: [0, -14]
    });

    $scope.stateParams = $stateParams;
    var mapStations, pTransportData;


    $scope.$on("mapInited", function(event, mapData) {
        mapStations = mapData.map;
        var transportTypeData = $stateParams.type || 'publicTransport';
        geoObj = dbData.getData(transportTypeData).then(function(data) {
            pTransportData = data;
            $scope.pTransportNames = data.emrat;
            $scope.pTransportColors = data.ngjyrat;
            $scope.pTransportLines = data.linjat;
            $scope.pTransportStations = data.stacionet;
            markerByStationData(data.stacionet, myyIcon);
            $scope.$broadcast('gotMapData');
        }, function() {
            $state.go('main.dashboard');
        });

        $rootScope.$broadcast("myLocationRequest", {
            map: mapData.map
        });
    });

    /*
     * Show Bus Lines by id
     */
    var layerzGeo;
    /*
     * If no param specified
     * it will visualize all lines
     */
    function showLinesById(lineIds) {

        if (layerzGeo) {
            mapStations.removeLayer(layerzGeo);
        }
        layerzGeo = L.geoJson(pTransportData.linjat,
                {
                    style: $rootScope.layerStyle,
                    filter: function(feature, layer) {
                        if (!lineIds) {
                            return true;
                        }

                        for (var i = 0; i < lineIds.length; i++) {
                            if (feature.properties.LINJA === lineIds[i]) {
                                return true;
                            }
                        }
                    }
                }
        ).addTo(mapStations);
    }


    /* Adds markers to the map
     * 1. param geojson data
     * 2. icon of marker */
    function markerByStationData(data, icon) {
        L.geoJson(data, {
            pointToLayer: function(feature, latlong) {
                return pointToLayer(feature, latlong, icon);
            }
        }).addTo(mapStations);
    }

    /*
     * Add markers
     */
    var activeMarkers = [];
    function pointToLayer(feature, latlong, icon) {
        var html = '', lineIds = [], i = 1, j = 0;

        if (feature.properties.emri) {
            html = '<div class="item  item-divider">' + feature.properties.emri + '</div>';
        }

        for (var i = 1; i < 6; i++) {
            if (feature.properties["LINJA_" + i]) {
                lineIds.push(feature.properties["LINJA_" + i]);
                html += '<div class="popup-line item item-icon-right" data-lineId="' + feature.properties["LINJA_" + i] + '"> <span class="line-label" style="color: ' + pTransportData.ngjyrat[feature.properties["LINJA_" + i]] + ' ">' + feature.properties["LINJA_" + i] + '</span>  ' + pTransportData.emrat[feature.properties["LINJA_" + i]] + '<i class="icon ion-arrow-right-c"></i> </div>';
            }
        }

        if (!html) {
            html = '<div class="item item-divider">' + $rootScope.labelz.no_data + '</div>';
        }

        html = '<div class="list alpha_v"> ' + html + ' </div>';

        var marker = L.marker(
                latlong,
                {
                    icon: icon,
                    lineIds: lineIds
                }
        ).addTo(mapStations).bindPopup(html, {className: 'leaflet-popup-ptransport'}).on("popupopen", markerClicked);
        activeMarkers.push(marker);
        return marker;
    }

    /*
     * Function called when one station
     * marker is clicked
     */
    function markerClicked() {
        var popupLines = this._popup._container.getElementsByClassName('popup-line');

        for (var i = 0; i < popupLines.length; i++) {
            popupLines[i].addEventListener("click", function() {
                var lineId = this.getAttribute("data-lineid");
                $scope.lineSelected([lineId]);
            }, false);
        }
    }

    $scope.toggleSelected = function(activeLine, fromPopoverlist) {
        if (activeLine) {
            if (fromPopoverlist) {
                $scope.activeLine = activeLine;
            } else {
                $scope.$apply(function() {
                    $scope.activeLine = activeLine;
                });
            }
        } else {
            $scope.lineSelected([]);
            $scope.activeLine = '';
        }
    };

    $scope.lineSelected = function(lineIDs, fromPopoverlist) {

        /*
         * Showing current lines
         */
        showLinesById(lineIDs);

        var features;
        if (lineIDs.length) {
            features = markerFeaturesByLineId(lineIDs);
            /**
             * active line
             */
            $scope.toggleSelected({id: lineIDs, name: $scope.pTransportNames[lineIDs]}, fromPopoverlist);
        } else {

            features = ($scope.pTransportStations && $scope.pTransportStations.features) ? angular.copy($scope.pTransportStations.features) : [];
            showLinesById();
        }
        var i;
        for (i = 0; i < activeMarkers.length; i++) {
            mapStations.removeLayer(activeMarkers[i]);
        }

        markerByStationData({
            "type": "FeatureCollection",
            "features": features
        }, myyIcon);
    };

    function markerFeaturesByLineId(lineIds) {

        var features = [];
        var i;
        var j;
        var k;
        if (!pTransportData.stacionet) {
            return features; // in this case will be an empty array
        }
        for (i = 0; i < pTransportData.stacionet.features.length; i++) {
            for (j = 0; j < lineIds.length; j++) {
                for (k = 1; k < 6; k++) {
                    if (pTransportData.stacionet.features[i].properties["LINJA_" + k]
                            && (pTransportData.stacionet.features[i].properties["LINJA_" + k] === lineIds[j])) {
                        features.push(pTransportData.stacionet.features[i]);
                    }
                }
            }
        }
        return features;
    }

    $scope.$on('gotMapData', function() {
        showLinesById();
    });

    $timeout(function() {
        $scope.openPopoverTransport();
    });

    $scope.openPopoverTransport = function($e) {
        if ($scope.popoverPTransport) {
            $scope.popoverPTransport.show($e);
            $scope.showPopupMaterial = true;
        } else {
            createPopover();
        }
    };

    var createPopover = function() {
        $ionicPopover.fromTemplateUrl('templates/popover/popover-ptransport.html', {
            scope: $scope
        }).then(function(popoverPTransport) {
            $scope.popoverPTransport = popoverPTransport;
        });
    };

});

appControllers.controller('taxiCtrl', function($rootScope, $ionicPopover, $stateParams, $state, language, $timeout, $scope, dbData) {
    $scope.stateParams = $stateParams;
    $scope.language = language;
    $scope.showFullSpinner = true;
    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 1500);

    var map;
    $scope.$on("mapInited", function(event, mapDataObj) {
        map = mapDataObj.map;

        dbData.getData('getTaxi', "&lng" + language).then(function(data) {
            $scope.mapData = data;
            showItemsByGroupID();
        }, function() {
            $state.go('main.dashboard');
        });

        $rootScope.$broadcast("myLocationRequest", {
        });
    });
    var layerzGeo, activeItems = [];
    function showItemsByGroupID(ids) {

        if (layerzGeo) {
            map.removeLayer(layerzGeo);
        }
        layerzGeo = L.geoJson($scope.mapData.geodata,
                {
                    pointToLayer: function(feature, latlng) {

                        var iconUrl = 'assets/graphics/mapicons/2-my_location_navigation_mode75x75.png';
                        for (var i = 0; i < $scope.mapData.kategorite.length; i++) {
                            if (feature.properties.kategoria == $scope.mapData.kategorite[i].id) {
                                iconUrl = $scope.mapData.kategorite[i].icon;
                            }
                        }

                        return L.marker(latlng, {
                            icon: L.icon({
                                iconUrl: iconUrl,
                                iconRetinaUrl: iconUrl,
                                iconSize: [32, 37],
                                iconAnchor: [16, 18],
                                popupAnchor: [0, 0]
                            })});

                    },
                    filter: function(feature, layer) {
                        activeItems.push(feature);
                        if (!ids) {
                            return true;
                        }

                        for (var i = 0; i < ids.length; i++) {
                            if (feature.properties.kategoria === ids[i]) {
                                return true;
                            }
                        }
                    }
                }
        ).addTo(map);



        layerzGeo.eachLayer(function(layer) {

            var title, i;
            var html = "";
            for (i = 0; i < $scope.mapData.kategorite.length; i++) {
                if (layer.feature.properties.kategoria == $scope.mapData.kategorite[i].id) {
                    title = $scope.mapData.kategorite[i]["name" + language];
                }
            }
            if (title) {
                html = '<div class="item  item-divider">' + title + '</div>';
            }
            if (layer.feature.properties.notes) {
                html += '<div class="popup-line item item-icon-right" data-lineId="' + layer.feature.properties.kategoria + '">' + layer.feature.properties.notes + '</div>';
            }
            html = '<div class="list alpha_v"> ' + html + ' </div>';
            layer.bindPopup(html);
        });
    }

    function getCategoryFromFeature(categories, feature) {
        var i;
        for (i = 0; i < categories.length; i++) {
            if (feature.properties.kategoria == categories[i].id) {
                return categories[i];
            }
        }
    }

    $scope.groupSelected = function(ids, fromPopoverlist) {
        /*
         * Showing current lines
         */
        showItemsByGroupID(ids);

        var features;
        if (ids.length) {
            features = itemsFeaturesByGroupId(ids);
            /**
             * active line
             */
            var catActive;
            var i;
            for (i = 0; i < $scope.mapData.kategorite.length; i++) {
                if (ids[0] == $scope.mapData.kategorite[i].id) {
                    catActive = $scope.mapData.kategorite[i];
                }
            }
            $scope.toggleSelected({id: ids, name: catActive["name" + language], iconsrc: catActive.icon}, fromPopoverlist);
        } else {
            features = angular.copy($scope.mapData.geodata.features);
            showItemsByGroupID();
        }
        var i;
        for (i = 0; i < activeItems.length; i++) {
            map.removeLayer(activeItems[i]);
        }
    };

    function itemsFeaturesByGroupId(ids) {

        var features = [];
        var i;
        var j;
        for (i = 0; i < $scope.mapData.geodata.features.length; i++) {
            for (j = 0; j < ids.length; j++) {
                if (($scope.mapData.geodata.features[i].properties.kategoria == ids[j])) {

                    features.push($scope.mapData.geodata.features[i]);
                }
            }
        }
        return features;
    }


    $scope.toggleSelected = function(activeGroup, fromPopoverlist) {
        if (activeGroup) {
            if (fromPopoverlist) {
                $scope.activeGroup = activeGroup;
            } else {
                $scope.$apply(function() {
                    $scope.activeGroup = activeGroup;
                });
            }
        } else {
            $scope.groupSelected([]);
            $scope.activeGroup = '';
        }
    };
    $timeout(function() {
        $scope.openPopoverTaxi();
    });

    $scope.openPopoverTaxi = function($e) {
        if ($scope.popoverTaxi) {
            $scope.popoverTaxi.show($e);
            $scope.showPopupMaterial = true;
        } else {
            createPopover();
        }
    };

    var createPopover = function() {
        $ionicPopover.fromTemplateUrl('templates/popover/popover-taxi.html', {
            scope: $scope
        }).then(function(popoverTaxi) {
            $scope.popoverTaxi = popoverTaxi;
        });
    };

});

appControllers.controller('parkingCtrl', function($rootScope, $ionicPopover, $stateParams, $state, language, $timeout, $scope, dbData) {
    $scope.stateParams = $stateParams;
    $scope.language = language;

    $scope.showFullSpinner = true;
    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 1500);

    var map;
    $scope.$on("mapInited", function(event, mapDataObj) {
        map = mapDataObj.map;
        dbData.getData('getParking', "&lng" + language).then(function(data) {
            $scope.mapData = data;
            showItemsByGroupID();
        }, function() {
            $state.go('main.dashboard');
        });

        $rootScope.$broadcast("myLocationRequest", {
        });
    });
    var layerzGeo, activeItems = [];
    function showItemsByGroupID(ids) {

        if (layerzGeo) {
            map.removeLayer(layerzGeo);
        }
        layerzGeo = L.geoJson($scope.mapData.geodata,
                {
                    style: function(feature) {
                        return {
                            color: $scope.mapData.kategorite["kategori_" + feature.properties.kategoria].color,
                            weight: 6,
                            opacity: 0.8
                        };
                    },
                    filter: function(feature, layer) {
                        activeItems.push(feature);
                        if (!ids) {
                            return true;
                        }

                        for (var i = 0; i < ids.length; i++) {
                            if (feature.properties.kategoria === ids[i]) {
                                return true;
                            }
                        }
                    },
                    pointToLayer: function(feature, latlng) {

                        return L.marker(
                                latlng,
                                {
                                    icon: L.icon({
                                        iconUrl: $scope.mapData.kategorite["kategori_" + feature.properties.kategoria].icon,
                                        iconRetinaUrl: $scope.mapData.kategorite["kategori_" + feature.properties.kategoria].icon,
                                        iconSize: [32, 37],
                                        iconAnchor: [16, 37],
                                        popupAnchor: [0, -37]
                                    })
                                });
                    }
                }
        ).addTo(map);

        layerzGeo.eachLayer(function(layer) {


            var html = "";
            var categoryid = layer.feature.properties.kategoria;
            var category = $scope.mapData.kategorite["kategori_" + categoryid];

            var metaid = layer.feature.properties.metaid;
            var meta = $scope.mapData.metadata["meta_" + metaid];

            /*parkim rruge*/
            if (Number(meta.zap)) {
                var pretitle = '<span class="bold" style="color: ' + category.color + ' ;">ZAP #' + meta.zap + ': </span>' + meta.rruga;
                var parkingInfo = '<div class="popup-line  pad_v item">' + $rootScope.labelz.parkingfree + ' <span class="item-note">' + meta.free + '</span></div>';
                parkingInfo += '<div class="popup-line  pad_v item">' + $rootScope.labelz.parkingpaid + ' <span class="item-note">' + meta.paid + '</span></div>';
            } else {
                var pretitle = '<span  class="bold" style="color: ' + category.color + ' ;">' + meta.zap + ': </span>' + meta.rruga;
                var parkingInfo = '<div class="popup-line pad_v item">' + $rootScope.labelz.places + ' <span class="item-note">' + meta.free + '</span></div>';
            }

            if (pretitle) {
                html += '<div class="item item-divider">' + pretitle + '</div>';
            }

            var parkingtype = $scope.mapData.kategorite["kategori_" + categoryid]["name" + language];
            if (parkingtype) {
                html += '<div class="popup-line pad_v item">' + parkingtype + '</div>';
            }
            
            if (parkingInfo) {
                html += parkingInfo;
            }

            

            html = '<div class="list alpha_v"> ' + html + ' </div>';
            layer.bindPopup(html);
        });
    }


    $scope.toggleSelected = function(activeGroup, fromPopoverlist) {
        if (activeGroup) {
            if (fromPopoverlist) {
                $scope.activeGroup = activeGroup;
            } else {
                $scope.$apply(function() {
                    $scope.activeGroup = activeGroup;
                });
            }
        } else {
            $scope.groupSelected([]);
            $scope.activeGroup = '';
        }
    };

    $scope.groupSelected = function(ids, fromPopoverlist) {
        /*
         * Showing current lines
         */
        showItemsByGroupID(ids);

        var features;
        if (ids.length) {
            features = itemsFeaturesByGroupId(ids);
            /**
             * active line
             */
            var catActive = $scope.mapData.kategorite['kategori_' + ids[0]];

            $scope.toggleSelected({id: ids, name: catActive["name" + language], iconsrc: catActive.icon}, fromPopoverlist);
        } else {
            features = angular.copy($scope.mapData.geodata.features);
            showItemsByGroupID();
        }
        var i;
        for (i = 0; i < activeItems.length; i++) {
            map.removeLayer(activeItems[i]);
        }
    };

    function itemsFeaturesByGroupId(ids) {

        var features = [];
        var i;
        var j;
        for (i = 0; i < $scope.mapData.geodata.features.length; i++) {
            for (j = 0; j < ids.length; j++) {
                if (($scope.mapData.geodata.features[i].properties.kategoria == ids[j])) {

                    features.push($scope.mapData.geodata.features[i]);
                }
            }
        }
        return features;
    }

    $timeout(function() {
        $scope.openPopoverParking();
    });

    $scope.openPopoverParking = function($e) {
        if ($scope.popoverParking) {
            $scope.popoverParking.show($e);
            $scope.showPopupMaterial = true;
        } else {
            createPopover();
        }
    };

    var createPopover = function() {
        $ionicPopover.fromTemplateUrl('templates/popover/popover-parking.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popoverParking = popover;
        });
    };

});

appControllers.controller('poiCategoriesCtrl', function($rootScope, $stateParams, dbData, $state, $scope, $timeout) {

    $scope.showFullSpinner = true;

    $rootScope.poiCatInited = true;

    $scope.$on('dataReturned', function() {

        $timeout(function() {
            /* remove loading spinner */
            $scope.showFullSpinner = false;

            $scope.gridShow = true;

        }, 1000);

    });

    $scope.stateParams = $stateParams;

    $timeout(function() {

        dbData.getPoiData({ln: $rootScope.language}).then(function(data) {
            $rootScope.categoryData = data;
            $rootScope.fromCategory = data.requesturl;
            $scope.$broadcast('dataReturned');
        }, function() {
            $state.go('main.dashboard');
            $rootScope.makeToast($rootScope.labelz.error_poi_categories);
        });

    }, $rootScope.delayOnTransition);

});

appControllers.controller('poiMapCtrl', function($rootScope, $scope, $state, $ionicPopover, language, appConfig, osmlayers, $stateParams, $timeout, dbData) {

    $scope.showFullSpinner = true;
    $scope.stateParams = $stateParams;


    $scope.fromList = 'ap_prcss=poiDetails';


    var map, layerzGeo;
    $scope.$on("mapInited", function(event, mapData) {
        map = mapData.map;
        $rootScope.$broadcast("myLocationRequest", {
        });

        dbData.getData('getPoi', '&lng=' + language).then(function(data) {
            $scope.mapData = data;
            // setLayers(data);
            $scope.showFullSpinner = false;

            $scope.$broadcast("gotMapData", data);
        }, function() {

        });

    });

    function setLayers(poiMapData) {
        if (layerzGeo) {
            map.removeLayer(layerzGeo);
        }

        layerzGeo = L.geoJson(poiMapData,
                {
                    pointToLayer: function(feature, latlong) {
                        var i;
                        var iconsrc, catTitle, html;

                        for (i = 0; i < $scope.mapData.kategorite.length; i++) {
                            if ($scope.mapData.kategorite[i].id === feature.properties.category_id) {
                                iconsrc = $scope.mapData.kategorite[i].icon;
                                catTitle = $scope.mapData.kategorite[i].name;
                            }
                        }

                        if (feature.properties.poi_title) {
                            html = '<div class="item  item-divider">' + catTitle + '</div>';
                        }
                        var avatarClass = "", avatarBg = "";
                        if (feature.properties.poi_simg_src) {
                            avatarClass = " item-avatar";
                            avatarBg = '<span class="avatar no_radius" style="background-image : url(' + feature.properties.poi_simg_src + ');"></span>';
                        }
                        html += '<a href="#main/poi/details/' + feature.properties.poi_id + '/' + $scope.fromList + '/' + $stateParams.activeNr + '/' + $stateParams.color + '" class="item item-thumbnail-left ' + avatarClass + ' search_item item-text-wrap">' + avatarBg + '<div class="font_20 pad_v alpha_v ng-binding">' + feature.properties.poi_title + '</div><p  style="line-height:20px; max-height: 60px; overflow: hidden;margin: 0;">' + feature.properties.poi_desc + '</p></a>';

                        if (!html) {
                            html = '<div class="item item-divider">' + $rootScope.labelz.no_data + '</div>';
                        }

                        html = '<div class="list alpha_v"> ' + html + ' </div>';

                        return L.marker(
                                [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
                                {
                                    icon: L.icon({
                                        iconUrl: iconsrc, iconRetinaUrl: iconsrc,
                                        iconSize: [30, 30],
                                        iconAnchor: [15, 30], /* shtohen si margin top, left me minus pozicionit te markerit */
                                        popupAnchor: [0, -8]})
                                }
                        ).addTo(map).bindPopup(html);

                    }
                }
        );
        layerzGeo.addTo(map);
    }

    function geoDataByCategories(enableOnFirstTime) {
        var i, j;
        var featuresActive = [];
        var length = $scope.mapData.geodata.features.length;

        for (j = 0; j < $scope.catt.length; j++) {

            if (($scope.catt[j].isShown === true) || enableOnFirstTime) {
                if (enableOnFirstTime) {
                    $scope.catt[j].isShown = true;
                }
                for (i = 0; i < length; i++) {

                    if ($scope.mapData.geodata.features[i].properties.category_id == $scope.catt[j].id) {
                        featuresActive.push($scope.mapData.geodata.features[i]);
                    }

                }
            }
        }

        return {type: "FeatureCollection", features: featuresActive};
    }
    var timer;
    $scope.$on("gotMapData", function(event, data) {
        $scope.catt = angular.copy(data.kategorite);
        var geoData = geoDataByCategories(true);
        setLayers(geoData);
        $scope.$watch('catt', function(newValue, oldValue) {
            if (newValue !== oldValue) {

                $timeout.cancel(timer);
                timer = $timeout(function() {
                    var geoData = geoDataByCategories(false);

                    setLayers(geoData);
                }, 300);
            }
        }, true);
    });

//    $rootScope.$on("searchToggled", function(event, opened) {
//        if (opened) {
//            $scope.poiCategoryMenu = false;
//        } else {
//            $timeout(function() {
//                $scope.poiCategoryMenu = true;
//            }, 600);
//        }
//    });

    $scope.$on("gotMapData", function() {
        $timeout(function() {
            $scope.poiCategoryMenu = false;
        }, 100);
    });


});

/*  Lista poi nga kategoria klikuar */
appControllers.controller('poiListCtrl', function($rootScope, $scope, $stateParams, dbData, $state, $timeout) {

    $scope.showFullSpinner = true;

    $scope.$on('dataReturned', function() {
        $timeout(function() {
            $scope.showFullSpinner = false;

            $scope.gridShow = true;
        }, 500);
    });

    $scope.stateParams = $stateParams;
    $scope.category_title = $stateParams.category_title;
    $timeout(function() {
        $scope.requesturl = $stateParams.requesturl;
        dbData.getPoiData({process: $stateParams.requesturl, id: $stateParams.caregory_id, ln: $rootScope.language}).then(function(data) {

            $scope.poiListData = data;
            $scope.poiList = data.poi_list;
            $scope.fromList = data.requesturl;
            $scope.$broadcast('dataReturned');
        }, function() {
            $state.go('main.poicategories');
            $rootScope.makeToast($rootScope.labelz.error_poi_list);
        });
    }, $rootScope.delayOnTransition);

});

/* Detajet e POI-t */
appControllers.controller('poiDetailsCtrl', function($ionicHistory, $rootScope, $scope, dbData, appConfig, $state, $stateParams, $ionicModal, $timeout, osmlayers) {

    var poiLat = appConfig.defaultLat;
    var poiLon = appConfig.defaultLon;
    $scope.stateParams = $stateParams;
    $scope.fromList = 'ap_prcss=poiDetails';

    $scope.showFullSpinner = true;

    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 1500);
    $scope.showFullMapSpinner = true;

    $scope.$on('dataReturned', function() {

        navigator.geolocation.getCurrentPosition(successgeo, errorgeo, {enableHighAccuracy: true, timeout: 3000});

        function errorgeo(error) {
            setView(appConfig.defaultLat, appConfig.defaultLon);
            $scope.$broadcast('currentLocationReturned');
        }
        function successgeo(position) {
            setView(position.coords.latitude, position.coords.longitude);
            $scope.$broadcast('currentLocationReturned');
        }

    });

    /* location returned on poi details map */
    $scope.$on('currentLocationReturned', function() {

    });

    $timeout(function() {
        $scope.requesturl = $stateParams.requesturl;
        dbData.getPoiData({process: $stateParams.requesturl, id: $stateParams.poi_id, ln: $rootScope.language}).then(function(data) {
            $scope.poi = data;
            poiLat = data.poi_latitude;
            poiLon = data.poi_longitude;
            $scope.$broadcast('dataReturned');
        }, function() {
            var obj = $ionicHistory.backView();
            if (obj.stateName) {
                $state.go(obj.stateName, obj.stateParams);
            } else {
                $state.go('main.dashboard');
            }
            $rootScope.makeToast($rootScope.labelz.error_poi_details);
        });
    }, $rootScope.delayOnTransition);

    /* NOTE : small map */
    var mappoi;
    /* Map POI */
    function setView(myLat, myLon) {

        mappoi.setView(new L.LatLng(myLat, myLon), 14);

        var iconStart = L.icon({
            iconUrl: 'assets/graphics/mapicons/direction_from.png',
            iconRetinaUrl: 'assets/graphics/mapicons/direction_from.png',
            iconSize: [32, 37],
            iconAnchor: [16, 37]
        });

        var iconEnd = L.icon({
            iconUrl: 'assets/graphics/mapicons/direction_to.png',
            iconRetinaUrl: 'assets/graphics/mapicons/direction_to.png',
            iconSize: [32, 37],
            iconAnchor: [16, 37]
        });

        L.marker([myLat, myLon], {icon: iconStart}).addTo(mappoi);
        L.marker([poiLat, poiLon], {icon: iconEnd}).addTo(mappoi);

        var router = L.Routing.osrm({serviceUrl: 'http://router.project-osrm.org/viaroute'}),
                waypoints = [];
        waypoints.push({latLng: L.latLng(myLat, myLon)});
        waypoints.push({latLng: L.latLng(poiLat, poiLon)});

        router.route(waypoints, function(err, routes) {
            
            if (line) {
                mappoi.removeLayer(line);
            }
            try{
                var line = L.Routing.line(routes[0]).addTo(mappoi);
            }catch(e){
                console.log("Caught "+e);
            }
        });
    }

    function initmap() {
        /** Remove old map */
        var oldMapContainer = document.getElementById("mappoi");
        var mapContainerParent = oldMapContainer.parentNode;
        mapContainerParent.removeChild(oldMapContainer);

        /** Create new map */
        var newMapContainer = document.createElement('div');
        var random = new Date().getTime();
        newMapContainer.id = "mappoi" + random;
        newMapContainer.setAttribute("class", "media_ratio_16_9");
        newMapContainer.setAttribute("style", "height:100%;width:100%;");

        /** Add new map */
        mapContainerParent.appendChild(newMapContainer);

        /** Init new map */
        mappoi = new L.Map('mappoi' + random, {zoomControl: false});

        var osm = new L.TileLayer(osmlayers.mapquest, {
            minZoom: 9,
            maxZoom: 19,
            attribution: appConfig.mapAttributation
        });

        mappoi.attributionControl.setPrefix("");

        mappoi.addLayer(osm);

        mappoi.setView(new L.LatLng(appConfig.defaultLat, appConfig.defaultLon), appConfig.defaultZoom);
    }

    $timeout(function() {
        initmap();
    }, 50);

    /* map */
    $timeout(function() {
        $scope.showFullMapSpinner = false;
    }, 2500);


    $scope.showImages = function(index) {
        $scope.activeSlide = index;
        $scope.showModal('templates/modal/image-gallery.html');
    };

    $scope.showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };

    // Close the modal
    $scope.closeModal = function() {
        $scope.modal.hide();
//        $scope.modal.remove();
    };

});
appControllers.controller('trafficCtrl', function($timeout, $scope, dbData, $rootScope, language, userID) {

    var timer;
    function refreshNoticationBadge() {

        dbData.getData("notificationsList", '&userID=' + userID + '&lng=' + language).then(function(data) {
            $rootScope.notificationsList = data;
            $scope.animateClass = true;
            $timeout(function() {
                $scope.animateClass = false;
            }, 350);

        }, function() {
            $rootScope.makeToast($rootScope.labelz.error_notification_list);
        });

        $timeout.cancel(timer);
        timer = $timeout(refreshNoticationBadge, 240000);

    }


    $timeout(refreshNoticationBadge, 700);

    $timeout(function() {
        $scope.gridShow = true;
    }, 300);
});

/* Real Time Traffic Controller */
appControllers.controller('rltrafficCtrl', function($rootScope, $ionicGesture, $state, $scope, dbData, appConfig, osmlayers, getColorForPercentage, $timeout, stateColor) {

    $scope.showFullSpinner = true;

    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 1500);


    $scope.mapDataType = [false, false, true];
    $scope.mapType = function(index) {
        $scope.mapDataType = [false, false, false];
        $scope.mapDataType[index] = true;
        if (index === 1) {
            setMapData("stats_count");
        } else if (index === 2) {
            setMapData("stats_speed");
        } else {
            setMapData("stats_occupancy");
        }
    };

    var mapRlt;
    var osm = new L.TileLayer(
            osmlayers.transport,
            {minZoom: 9, maxZoom: 19, crs: L.CRS.EPSG3857});

    var swarcoTrafficLayer = L.tileLayer.wms("http://infomobility.tirana.gov.al/ms/services/netstate/OBS_flow", {
        crs: L.CRS.EPSG4326,
        layers: 'theLayer',
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        attribution: appConfig.mapAttributation
    }).setZIndex(999);

    var swarcoSpeedLayer = L.tileLayer.wms("http://infomobility.tirana.gov.al/ms/services/netstate/OBS_speed", {
        crs: L.CRS.EPSG4326,
        layers: 'theLayer',
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        attribution: appConfig.mapAttributation
    }).setZIndex(999);

    /* krijon harten */
    function initmap() {
        mapRlt = new L.Map('maprltraffic', {
            zoomControl: false,
            layers: [
                osm,
                swarcoSpeedLayer
            ]
        });

        mapRlt.attributionControl.setPrefix("");

        mapRlt.setView(new L.LatLng(appConfig.defaultLat, appConfig.defaultLon), appConfig.defaultZoom);
        $scope.$broadcast('routesDataReturned');

    }
    initmap();


    var trafficDataTimer;
    /* merr llojet e te dhenave (traffic, flux) per rruget  */

    var layerzGeo;
    function setMapData(dataType) {

        if (dataType === "stats_count") {
            mapRlt.removeLayer(swarcoSpeedLayer);
            swarcoTrafficLayer.addTo(mapRlt);
        } else {
            mapRlt.removeLayer(swarcoTrafficLayer);
            swarcoSpeedLayer.addTo(mapRlt);
        }
    }
    ;

    var currLocMarker;
    function setView(mapLat, mapLng) {


        if (!currLocMarker) {
            mapRlt.setView(new L.LatLng(mapLat, mapLng), 14);
            currLocMarker = L.rotatedMarker({lat: mapLat, lng: mapLng}, {
                icon: L.icon({
                    iconUrl: 'assets/graphics/mapicons/2-my_location_navigation_mode75x75.png',
                    iconRetinaUrl: 'assets/graphics/mapicons/2-my_location_navigation_mode75x75.png',
                    iconSize: [35, 35],
                    iconAnchor: [17, 35],
                    popupAnchor: [-35, -17]
                })
            }).addTo(mapRlt);
        } else {
            currLocMarker.setLatLng({lat: mapLat, lng: mapLng});
        }

    }

    $scope.setView = function() {
        getLocation();
    };

    function getLocation() {

        var testLat = appConfig.defaultLat;
        var testLon = appConfig.defaultLon;

        navigator.geolocation.watchPosition(successgeo, errorgeo, {enableHighAccuracy: true});

        function errorgeo(error) {
            setView(testLat, testLon);
        }

        function successgeo(position) {
            setView(position.coords.latitude, position.coords.longitude);
        }
    }

    $timeout(function() {
//        getLocation();
    }, $rootScope.delayOnTransition);

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        clearTimeout(trafficDataTimer);
    });

});

/* Driving Mode Controller */
appControllers.controller('drivingmodeCtrl', function($rootScope, $ionicGesture, $state, $scope, dbData, osmlayers, appConfig, getColorForPercentage, $timeout, stateColor) {

    $scope.showFullSpinner = true;

    $scope.$on('routesDataReturned', function() {
        $timeout(function() {
            $scope.showFullSpinner = false;
        }, 100);
    });


    $scope.mapDataType = [true, false, false];
    $scope.mapTypeLabel = $rootScope.labelz.measurements_occupancy;
    $scope.mapType = function(index) {
        $scope.mapDataType = [false, false, false];
        $scope.mapDataType[index] = true;
        if (index === 1) {
            $scope.mapTypeLabel = $rootScope.labelz.measurements_flux;
            setMapData("stats_count");
        } else if (index === 2) {
            $scope.mapTypeLabel = $rootScope.labelz.measurements_speed;
            setMapData("stats_speed");
        } else {
            $scope.mapTypeLabel = $rootScope.labelz.measurements_occupancy;
            setMapData("stats_occupancy");
        }
    };

    var mapRlt;
    var geocoder;
    var control;
    /* krijon harten */
    function initmap() {

        var maxBounds = L.latLngBounds(
                L.latLng(39.762823, 19.447291), //Southwest
                L.latLng(43.101667, 21.095240)  //Northeast
                );

        mapRlt = new L.Map('maprltraffic', {zoomControl: false, maxBounds: maxBounds}).fitBounds(maxBounds);

        var osm = new L.TileLayer(
                osmlayers.transport,
                {
                    minZoom: 9,
                    maxZoom: 19,
                    attribution: appConfig.mapAttributation
                });

        mapRlt.addLayer(osm);
        /* Removes leaflet prefix to map */
        mapRlt.attributionControl.setPrefix("");
        var startLatLng = {lat: 41.3275459, lng: 19.8186982};
        mapRlt.setView(startLatLng, 14);

        $scope.$broadcast('streetByCoordinate', {latlng: startLatLng});

        geocoder = L.Control.Geocoder.nominatim();
        control = L.Control.geocoder({
            geocoder: geocoder
        });

        var routeGetsNum = 0;
        /* get data from server */
        function getRoutes() {
            dbData.localData('getStreets').then(function(data) {

                if (data.type && data.type === "FeatureCollection") {
                    $rootScope.routesObj = data;
                    /* kerko te dhenat per rruget qe erdhen */
                    routesData();
                } else {

                    if (routeGetsNum === 0) {
                        getRoutes();
                    } else {
                        $state.go('main.dashboard');
                        $rootScope.makeToast($rootScope.labelz.error_get_streets);
                    }
                    routeGetsNum = 1;
                }
            }, function() {
                $state.go('main.dashboard');
                $rootScope.makeToast($rootScope.labelz.error_get_streets);
            });
        }
        getRoutes();

    }
    var trafficDataTimer;
    /* merr llojet e te dhenave (traffic, flux) per rruget  */
    function routesData() {

        var thisData = dbData.getData('routesData').then(function(routedata) {
            $scope.$broadcast('routesDataReturned');
            $rootScope.mapRouteData = routedata;


            if ($scope.mapDataType[1] === true) {
                setMapData("stats_count");
            } else if ($scope.mapDataType[2] === true) {
                setMapData("stats_speed");
            } else {
                setMapData("stats_occupancy");
            }

            $scope.$broadcast('afterRouteData');

        }, function() {
            $state.go('main.dashboard');
            $rootScope.makeToast($rootScope.labelz.error_get_streetdata);
        });
        clearTimeout(trafficDataTimer);
        trafficDataTimer = setTimeout(routesData, 180000);
    }
    var routeCallbackFirstTime;
    $scope.navigationMode = true;

    $scope.$on('afterRouteData', function() {

        /* ndryshon preferencat sipas navigation mode on/off */
        callMapData();

        if (!routeCallbackFirstTime) {
            checkGPS();

            /* vendos eventet location found, location error */
            locationEvents();
            /* 
             *  INSOMNIA PLUGIN CALL
             *  */
            Insomnia.keepAwake();

            routeCallbackFirstTime = true;
        }
    });

//    var recallTimeout;
//    function recallWithTimeout(){
//        clearTimeout(recallTimeout);
//        recallTimeout = setTimeout(function(){
//            checkGPS();
//        }, 5000);
//    }

    function checkGPS() {
        /* Native check - cordova call*/
        if (($rootScope.gpsMsgShow && $rootScope.gpsMsgShow !== false) && $scope.navigationMode === true) {
//            dbData.localData('gpsState').then(function(data){
//                if(data.gps === true){
//                    $scope.gpsOpened = true;
//                }
//                else{
//                     $scope.gpsOpened = false;
//                     recallWithTimeout();
//                }
//            }, function(){
//                $scope.gpsOpened = false;
//                recallWithTimeout();
//            });
            $rootScope.makeToast($rootScope.labelz.activate_gps_message);
        } else {
//            $scope.gpsOpened = false;
        }
    }
    ;

    $scope.openGps = function() {
        /* cordova call */
        dbData.localData('gpsSettings').then(function() {
        }, function() {
        });
    };

    $scope.closeGpsMsg = function() {
        $rootScope.gpsMsgShow = false;
    };

    $scope.closeUpMode = false;
    $scope.changeCloseUpMode = function() {
        $scope.closeUpMode = !$scope.closeUpMode;
        callMapData();
    };


    var getIcon = function(accuracy) {

        var iconSrc = 'assets/graphics/mapicons/8-2-drejtimi105x105.png';

        iconSrc = (accuracy && accuracy < 100) ? 'assets/graphics/mapicons/8-drejtimi105x105.png' : iconSrc;

        return L.icon({
            iconUrl: iconSrc,
            iconRetinaUrl: iconSrc,
            iconSize: [35, 35],
            iconAnchor: [17, 35],
            popupAnchor: [-35, -17]
        });

    };


    var currLocMarker;

    var dataRefreshDelay;
    var mapOptions;

    function callMapData() {
        var navMode = angular.copy($scope.navigationMode);
        var closeUpMode = angular.copy($scope.closeUpMode);

        dataRefreshDelay = (navMode === true) ? 2000 : 10000;


        if (navMode === true && closeUpMode === true) {       /* navigation mode me zoom-in ekzistues */


            mapRlt._layersMaxZoom = 17;
            mapRlt._layersMinZoom = 17;
            mapRlt._zoom = 17;


            mapRlt._locateOptions.watch = true;
            mapRlt._locateOptions.setView = true;
        } else {


            var thisZoom = mapRlt.getZoom();

            mapRlt.stopLocate();

            mapRlt._layersMaxZoom = thisZoom;
            mapRlt._layersMinZoom = thisZoom;
            mapRlt._zoom = thisZoom;

            mapOptions = mapRlt.locate({watch: true, setView: true, enableHighAccuracy: true});

        }
    }

    var pinchTimer;
    $scope.reportEvent = function(event) {

        $scope.pinching = true;

        $timeout.cancel(pinchTimer);
        pinchTimer = $timeout(function() {
            var mpZmLv = mapRlt.getZoom();

            var mapCenter = mapRlt.getCenter();


            var newZoom;

            if (event.type === "pinchin") {
                newZoom = mpZmLv - 1;
            } else {
                newZoom = mpZmLv + 1;
            }
            newZoom = (newZoom < 7 || newZoom > 19) ? mpZmLv : newZoom;
            mapRlt._layersMaxZoom = newZoom;
            mapRlt._layersMinZoom = newZoom;
            mapRlt._zoom = newZoom;

            mapOptions = mapRlt.setView(mapCenter, newZoom);

            $scope.pinching = false;

        }, 100);

    };

    $scope.$on('headingAvailable', function(name, obj) {

        var angle = Math.round(obj.heading);

        switch (true) {
            case (angle > 338 || angle <= 23):
                $scope.directionLabel = $rootScope.labelz.north;
                break;
            case (angle > 23 && angle <= 68):
                $scope.directionLabel = $rootScope.labelz.north_east;
                break;
            case (angle > 68 && angle <= 113):
                $scope.directionLabel = $rootScope.labelz.east;
                break;
            case (angle > 113 && angle <= 158):
                $scope.directionLabel = $rootScope.labelz.south_east;
                break;
            case (angle > 158 && angle <= 203):
                $scope.directionLabel = $rootScope.labelz.south;
                break;
            case (angle > 203 && angle <= 248):
                $scope.directionLabel = $rootScope.labelz.south_west;
                break;
            case (angle > 248 && angle <= 283):
                $scope.directionLabel = $rootScope.labelz.west;
                break;
            case (angle > 293 && angle <= 338):
                $scope.directionLabel = $rootScope.labelz.north_west;
                break;
        }
    });


    /*  Location found/error events  -> than set marker  */
    function locationEvents() {

        var locationTimer;
        var framesPerSecond = 48;
        var locationDelay = Math.round(1000 / framesPerSecond);

        mapOptions.on('locationfound', function(e) {
            /* Do nothing while pinching */
            if ($scope.pinching === true) {
                return;
            }
            /* in case heading is undefined we take it as 0 */
            var headingGrade = (e.heading) ? e.heading : 0;
            $scope.$broadcast('headingAvailable', {heading: headingGrade});
            /* If there is an old heading angle */
            if ($scope.oldHeading) {

                var diff = headingGrade - $scope.oldHeading;

                var isPositive = (diff >= 0) ? true : false;

                if ((isPositive === true && diff < 30)) {
                    /* Do nothing if angle less than 20deg */
                } else if (isPositive === false && diff > -30) {
                    /* Do nothing if angle less than 20deg */
                } else {
                    $scope.markerRotateDegree = mapDegree(headingGrade);
                    $scope.oldHeading = angular.copy($scope.markerRotateDegree);
                }
            } else {
                /* Only at First Time */
                $scope.markerRotateDegree = mapDegree(headingGrade);
                $scope.oldHeading = angular.copy($scope.markerRotateDegree);
            }

            if (!$scope.navigationMode) {
                $scope.markerRotateDegree = 0;
            }

            function mapDegree(heading) {

                if (!$scope.oldHeading) {
                    return heading;
                } else { /*  */

                    var diff = heading - $scope.oldHeading;
                    var isPositive = (diff > 0) ? true : false;

                    if ((isPositive === true && diff > 180)) {
                        return Math.round(heading - 360);
                    } else {
                        return Math.round(heading);
                    }

                }
            }

            $timeout.cancel(locationTimer);

            locationTimer = $timeout(function() {
                $scope.ourSpeed = (typeof e.speed !== "undefined") ? Math.round(e.speed * 3.6) : 0;
                var thisIcon = getIcon(e.accuracy);
                $scope.mapRotateDegree = -angular.copy($scope.markerRotateDegree);
                if (typeof currLocMarker !== "undefined") {

                    currLocMarker.options.angle = angular.copy($scope.markerRotateDegree); // kendi i markerit eshte
                    // ne kah te kundert me harten duke qendruar gjithmone 
                    // me te njetin drejtim si koka paisjes

                    currLocMarker.setLatLng(e.latlng);
                    currLocMarker.setIcon(thisIcon);

                } else {
                    /* first time added */
                    currLocMarker = L.rotatedMarker(e.latlng, {icon: thisIcon}).addTo(mapRlt);
                }
                var latlng = e.latlng;
                $scope.$broadcast('streetByCoordinate', {latlng: latlng});

            }, locationDelay);

        });

        $scope.$on('streetByCoordinate', function(event, obj) {
            geocoder.reverse(obj.latlng, mapRlt.options.crs.scale(mapRlt.getZoom()), function(results) {
                if (results[0] && results[0].name) {
                    var street = results[0].name;
                    $scope.streetName = street;
                }
            });
        });

        mapOptions.on('locationerror', function(e) {

            var thisIcon = getIcon();
            if (typeof currLocMarker !== "undefined") {
                mapRlt.removeLayer(currLocMarker);
            }
            $scope.$broadcast('headingAvailable', {heading: 0});

            var testlatlng = {lat: 41.3275459, lng: 19.8186982};
            currLocMarker = L.rotatedMarker(testlatlng, {icon: thisIcon}).addTo(mapRlt);

        });
    }

    var layerzGeo;
    function setMapData(dataType) {
        var green = "#8bd13a";
        var yellow = "#ffcc00";
        var orange = "#ff6500";
        var red = "#ec008c";
        if (layerzGeo) {
            mapRlt.removeLayer(layerzGeo);
        }
        layerzGeo = L.geoJson($rootScope.routesObj,
                {
                    style: function(feature) {
                        var dashArray = null;
                        var color;

                        if (dataType === "stats_speed") {
                            var num;
                            if ($rootScope.mapRouteData[feature.properties.id] && $rootScope.mapRouteData[feature.properties.id][dataType]) {
                                num = parseFloat($rootScope.mapRouteData[feature.properties.id][dataType]);
                            } else {
                                num = 0;
                            }
                            if (num < 20) {
                                color = red;
                            } else if (num >= 20 && num < 40) {
                                color = orange;
                            } else if (num >= 40 && num < 60) {
                                color = yellow;
                            } else {
                                color = green;
                            }
                        }
                        else if (dataType === "stats_count") {

                            var num;
                            if ($rootScope.mapRouteData[feature.properties.id] && $rootScope.mapRouteData[feature.properties.id][dataType]) {
                                num = parseFloat($rootScope.mapRouteData[feature.properties.id][dataType]);
                            } else {
                                num = 0;
                            }

                            if (num * 12 < 500) {
                                color = green;
                            } else if (num * 12 >= 500 && num * 12 < 1000) {
                                color = yellow;
                            } else if (num * 12 >= 1000 && num * 12 < 1500) {
                                color = orange;
                            } else {
                                color = red;
                            }

                        } else {
                            /* ne rast se kerkohet ngarkesa */

                            var num;
                            if ($rootScope.mapRouteData[feature.properties.id] && $rootScope.mapRouteData[feature.properties.id][dataType]) {
                                num = parseFloat($rootScope.mapRouteData[feature.properties.id][dataType]).toFixed(2);
                                num = Math.ceil(parseFloat(num));
                            } else {
                                num = 0;
                            }

                            if (num < 25) {
                                color = green;
                            } else if (num >= 25 && num < 50) {
                                color = yellow;
                            } else if (num >= 50 && num < 80) {
                                color = orange;
                            } else {
                                color = red;
                            }

                        }

                        if ($rootScope.mapRouteData[feature.properties.id] && $rootScope.mapRouteData[feature.properties.id].is_live === false) {
                            dashArray = "15, 10, 5, 10";
                            if (parseInt($rootScope.mapRouteData[feature.properties.id].stats_age) > 1440) {
                                color = "gray";
                            }
                        }

                        return {color: color, fillOpacity: 0, weight: 2, opacity: 1, dashArray: dashArray};

                    },
                    filter: function(featureData, layer) {
                        if (featureData.type === "Feature") {
                            return true;
                        }
                    }
                }
        ).addTo(mapRlt);
    }
    ;

    $timeout(function() {
        initmap();
    }, $rootScope.delayOnTransition);

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        mapRlt.stopLocate();
        Insomnia.allowSleepAgain();
        clearTimeout(trafficDataTimer);
    });


});

appControllers.controller('cctvCtrl', function($rootScope, $scope, $state, dbData, osmlayers, appConfig, $timeout, stateColor) {

    var mapCctv;

    var myIcon = L.icon({
        iconUrl: 'assets/graphics/mapicons/3-kamera_location75x75_strong.png',
        iconRetinaUrl: 'assets/graphics/mapicons/3-kamera_location75x75_strong.png',
        iconSize: [63, 63],
        iconAnchor: [31, 31], /* shtohen si margin top, left me minus pozicionit te markerit */
        popupAnchor: [0, -15]});

    $scope.$on("mapInited", function(event, mapDataObj) {
        mapCctv = mapDataObj.map;
        var geoObj = dbData.getData('markers').then(function(data) {
            mapData(data);
        }, function() {
            $state.go('main.dashboard');
            $rootScope.makeToast($rootScope.labelz.error_cctv);
        });

        $rootScope.$broadcast("myLocationRequest", {
            map: mapCctv
        });

    });

    function mapData(geoObj) {
        L.geoJson(geoObj, {
            pointToLayer: function(feature, latlong) {

                var imgSrc = feature.properties.img;
                var popupIndex = geoObj.features.indexOf(feature);

                return L.marker(
                        feature.geometry.coordinates,
                        {icon: myIcon}
                ).addTo(mapCctv)
                        .bindPopup('<div>\n\
                                <div class="bg violet marker_popup_bg" data-img="' + imgSrc + '" style="width:352px;height:288px;max-width: 100%;\n\
                                background-image: url(' + imgSrc + ');"></div>\n\
                                <div class="font_18 pad_double pad_v_double">' + feature.properties.address + '<button class="cctv_popup_close bg violet button button-fab button-fab-bottom-right icon ion-android-close"></button></div>\n\
                                </div>', {className: 'leaflet-popup-cctv'}).addEventListener("click", imageRefresh);
            }
        }).addTo(mapCctv);
    }


    var imagetimer;
    function imageRefresh() {

        clearTimeout(imagetimer);

        imagetimer = setTimeout(function() {

            var markerBgDomArray = document.getElementsByClassName('marker_popup_bg');

            if (markerBgDomArray && markerBgDomArray.length !== 0) {

                var markerBgDom = markerBgDomArray[0];

                var markerBg = markerBgDom.getAttribute('data-img');

                var newMarkerBg = markerBg + '?' + (Math.floor(Math.random() * (10000 - 1)) + 1);

                markerBgDom.style.backgroundImage = 'url(' + newMarkerBg + ')';

                imageRefresh();
            }

        }, $rootScope.cctvImgRefreshDelay);
        document.getElementsByClassName('cctv_popup_close')[0].addEventListener('click', function() {
            mapCctv.closePopup();
        });

    }

    $scope.showFullSpinner = true;

    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 2000);


});

/* Notifications Controller */
appControllers.controller('notificationsCtrl', function($rootScope, $ionicPlatform, $state, osmlayers, userID, $scope, language, dbData, $ionicModal, $timeout, $stateParams, stateColor) {


    $scope.showFullSpinner = true;
    $timeout(function() {
        if (!$rootScope.notificationsList) {
            notificationList();
        } else {
            $scope.showFullSpinner = false;
            listTypeTitles();
        }
    }, $rootScope.delayOnTransition);
    
    $ionicPlatform.registerBackButtonAction(function(event) {
        if ($stateParams.extra) {
            $state.go('main.dashboard');
        }
        else {
            navigator.app.backHistory();
        }
    }, 100);


    $scope.stateParams = $stateParams;
    /* Used to get list data */
    var notificationList = function() {
        dbData.getData("notificationsList", '&userID=' + userID + '&lng=' + language).then(function(data) {
            $rootScope.notificationsList = data;
            $scope.showFullSpinner = false;

            listTypeTitles();

        }, function() {
            $state.go('main.dashboard');
            $rootScope.makeToast($rootScope.labelz.error_notification_list);
        });
    };
    
    (function notificationsConfig() {
        if (localStorage.getItem("configSeen")) {
            $scope.notificationShow = false;
        } else {
            $scope.notificationShow = true;
        }
    })();

    $scope.notificationsConfigChange = function(){
        localStorage.setItem("configSeen", true);
        $scope.notificationShow = false;
    };


    function listTypeTitles() {
        return;
        for (var i = 0; i < $rootScope.notificationsList.heavy.length; i++) {
            if ($rootScope.notificationsList.heavy[i].isFavorite === true) {
                $scope.showIsHeavyFavorite = true;
            }

            if ($rootScope.notificationsList.heavy[i].isFavorite === false) {
                $scope.showIsHeavyNotFavorite = true;
            }
        }

        for (var i = 0; i < $rootScope.notificationsList.blocked.length; i++) {
            if ($rootScope.notificationsList.blocked[i].isFavorite === true) {
                $scope.showIsBlockedFavorite = true;
            }

            if ($rootScope.notificationsList.blocked[i].isFavorite === false) {
                $scope.showIsBlockedNotFavorite = true;
            }
        }



        for (var i = 0; i < $rootScope.notificationsList.planned.length; i++) {

            if ($rootScope.notificationsList.planned[i].isFavorite === true) {
                $scope.showIsPlannedFavorite = true;
            }

            if ($rootScope.notificationsList.planned[i].isFavorite === false) {
                $scope.showIsPlannedNotFavorite = true;
            }

        }

    }
    ;
    $scope.mynotific = true;

});

appControllers.controller('notificationDetailsCtrl', function($rootScope, $state, osmlayers, appConfig, userID, $scope, language, dbData, $ionicModal, $timeout, $stateParams, stateColor) {

    $scope.showFullSpinner = true;

    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 1500);

    /* Used to get list data */
    var notificationList = function() {

        if (typeof $rootScope.notificationsList !== "undefined") {
            findActiveNotification();
        } else {
            dbData.getData("notificationsList", '&userID=' + userID + '&lng=' + language).then(function(data) {
                $rootScope.notificationsList = data;
                findActiveNotification();
            }, function() {
                $state.go('main.dashboard');
                $rootScope.makeToast($rootScope.labelz.error_notification_list);
            });
        }

    };

    function findActiveNotification() {
        /* Sets active notification object */
        for (var i = 0; i < $rootScope.notificationsList.blocked.length; i++) {
            if ($rootScope.notificationsList.blocked[i].id + "" === $stateParams.notification_id) {
                $scope.activeNotification = $rootScope.notificationsList.blocked[i];
                $scope.activeNotificationType = "blocked";
                notificationMap();
                return;
            }
        }

        for (var i = 0; i < $rootScope.notificationsList.heavy.length; i++) {
            if ($rootScope.notificationsList.heavy[i].id + "" === $stateParams.notification_id) {
                $scope.activeNotification = $rootScope.notificationsList.heavy[i];
                $scope.activeNotificationType = "heavy";
                notificationMap();
                return;
            }
        }

        for (var i = 0; i < $rootScope.notificationsList.planned.length; i++) {
            if ($rootScope.notificationsList.planned[i].id + "" === $stateParams.notification_id) {
                $scope.activeNotification = $rootScope.notificationsList.planned[i];
                $scope.activeNotificationType = "planned";
                notificationMap();
                return;
            }
        }

    }



    var notificationMap = function() {
        var geoOb = dbData.getData('getStreets').then(function(data) {
            $rootScope.routesObj = data;
            mapData();
//            dbData.getData('routesData').then(function(routedata) {
//                $rootScope.mapRouteData = routedata;
//                
//            }, function() {
//                $state.go('main.dashboard');
//                $rootScope.makeToast($rootScope.labelz.error_get_streetdata);
//            });
        }, function() {
            $state.go('main.dashboard');
            $rootScope.makeToast($rootScope.labelz.error_get_streets);
        });
    };

    var map;
    $scope.$on("mapInited", function(event, mapDataObj) {
        map = mapDataObj.map;
        notificationList();

        $rootScope.$broadcast("myLocationRequest", {
            map: map
        });

    });

    function mapData() {

        L.geoJson($rootScope.routesObj,
                {
                    style: function(feature) {
                        var color = "red";
                        return {color: color, fillOpacity: 0, weight: 3, opacity: 1};
                    },
                    filter: function(featureData, layer) {

                        for (var i = 0; i < $scope.activeNotification.segmentsAffected.length; i++) {
                            if (featureData.properties.id === $scope.activeNotification.segmentsAffected[i] + "") {
                                return true;
                            }
                        }

                    }
                }
        ).addTo(map);

        if (!$scope.activeNotification.pointsRelated || !$scope.activeNotification.pointsRelated.length) {
            return;
        }

        for (var i = 0; i < $scope.activeNotification.pointsRelated.length; i++) {
            var latlng = {};
            latlng.lat = $scope.activeNotification.pointsRelated[i].latitude;
            latlng.lng = $scope.activeNotification.pointsRelated[i].longitude;
            var marker = $scope.activeNotification.pointsRelated[i].marker;
            var iconUrl = (marker.length > 2) ? marker : 'assets/graphics/mapicons/6-vendodhja_nje_ngjarjeje75x75.png';
            L.marker(latlng, {icon: L.icon({
                    iconUrl: iconUrl,
                    iconRetinaUrl: iconUrl,
                    iconSize: [35, 35],
                    iconAnchor: [17, 35]})
            }).addTo(map);
            map.setView(latlng, 13)
        }

    }



});

/* Statistics Controller */
appControllers.controller('statisticsCtrl', function($rootScope, $scope, $timeout, stateColor) {

    $scope.showFullSpinner = true;

    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 1000);

});

appControllers.controller('infoCtrl', function($timeout, $scope, dbData) {
    dbData.getData('getInfo').then(function(data) {
        if (!data.lista) {
            $scope.info = data;
            return;
        }

    }, function() {
        $state.go('main.dashboard');
    });
    $timeout(function() {
        $scope.gridShow = true;
    }, 500);
});

appControllers.controller('infoDetailsCtrl', function($scope, dbData, $ionicModal, $stateParams, $timeout, NgTableParams) {

    $scope.showFullSpinner = true;

    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 1000);

    $scope.stateParams = $stateParams;
    if ($stateParams.getfunc) {
        dbData.getData($stateParams.getfunc).then(function(data) {
            if (!data.lista) {
                $scope.data = data;
                return;
            }
            $scope.tableData = data.lista;
            $scope.tableParams = new NgTableParams(
                    {
                        count: 25
                    },
            {
                counts: [],
                dataset: $scope.tableData
            }
            );
        }, function() {

        });
    }

    /* Street Modal */
    $scope.infoMapModal = function() {

        $ionicModal.fromTemplateUrl("templates/modal/info-map.html", {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false
        }).then(function(modal) {
            $scope.modal = modal;
            $timeout(function() {
                $scope.modal.show();
            }, 100);
        });
    };

    // Close the modal
    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove();
    };

});

appControllers.controller('administrationMapCtrl', function($rootScope, $ionicPopover, $scope, dbData, $state, $timeout) {
    $scope.showFullSpinner = true;


    var map;

    $scope.$on("mapInited", function(event, mapDataObj) {
        map = mapDataObj.map;

        dbData.getData('getFshatrat').then(function(data) {
            mapData(data)
        }, function(error) {
            console.error(error);
            $state.go('main.dashboard');
        });

        dbData.getData('getNjesiteLayers').then(function(data) {
            $scope.admUnits = data.features;
            mapLayers(data);
        }, function() {

        });

        $rootScope.$broadcast("myLocationRequest", {
            map: map
        });

    });

    var myIcon = L.icon({
        iconUrl: 'assets/graphics/mapicons/map_point.png',
        iconRetinaUrl: 'assets/graphics/mapicons/map_point.png',
        iconSize: [7, 7],
        iconAnchor: [7, 7], /* shtohen si margin top, left me minus pozicionit te markerit */
        popupAnchor: [-3, -7]});



    function mapData(geoObj) {
        L.geoJson(geoObj, {
            pointToLayer: function(feature, latlong) {
                var imgSrc = feature.properties.img;
                var popupIndex = geoObj.features.indexOf(feature);
                return L.marker(
                        latlong,
                        {icon: myIcon}
                ).addTo(map)
                        .bindPopup('<div class="item  item-divider">' + feature.properties.emertim_ko + '</div>');
            }
        }).addTo(map);
    }

    var layerzGeo;
    function mapLayers(geoObj) {
        if (layerzGeo) {
            map.removeLayer(layerzGeo);
        }
        layerzGeo = L.geoJson(geoObj, {
            style: $rootScope.layerStyle
        }).addTo(map);

        layerzGeo.eachLayer(function(layer) {

            var html = ['<div class="item item-divider">Njësia: ' + (layer.feature.properties.njesia || 'N/A') + '</div>']
            if (layer.feature.properties.Population) {
                html.push('<div class="item pad_v">Popullsia: <span class="item-note">' + layer.feature.properties.Population + '</span></div>');
            }
            if (layer.feature.properties.Buildings) {
                html.push('<div class="item pad_v">Ndërtesa: <span class="item-note">' + layer.feature.properties.Buildings + '</span></div>');
            }
            if (layer.feature.properties.Dwellings) {
                html.push('<div class="item pad_v">Banesa: <span class="item-note">' + layer.feature.properties.Dwellings + '</span></div>');
            }
            if (layer.feature.properties.Adresa) {
                html.push('<div class="item pad_v">Adresa: <span class="item-note" style="white-space: normal;">' + layer.feature.properties.Adresa + '</span></div>');
            }
            if (layer.feature.properties.email) {
                html.push('<a class="item pad_v" href="mailto:' + layer.feature.properties.email + '">E-mail: <span class="item-note">' + layer.feature.properties.email + '</span></a>')
            }
            if (layer.feature.properties.tel) {
                html.push('<a class="item pad_v" href="tel:' + layer.feature.properties.tel + '">Tel: <span class="item-note">' + layer.feature.properties.tel + '</span></a>');
            }
            if (layer.feature.properties.tel1) {
                html.push('<a class="item pad_v" href="tel:' + layer.feature.properties.tel1 + '">Tel: <span class="item-note">' + layer.feature.properties.tel1 + '</span></a>');
            }
            if (layer.feature.properties.tel2) {
                html.push('<a class="item pad_v" href="tel:' + layer.feature.properties.tel2 + '">Tel: <span class="item-note">' + layer.feature.properties.tel2 + '</span></a>');
            }
            html = '<div class="list alpha_v"> ' + html.join('') + ' </div>';
            layer.bindPopup(html);
        });
    }

    $scope.lineSelected = function(text) {
        if (!text) {
            mapLayers({
                "type": "FeatureCollection",
                "features": $scope.admUnits
            })
            $scope.activeLine = undefined;
            return;
        }
        for (var i = 0; i < $scope.admUnits.length; i++) {
            if ((text + "").toLowerCase() === ($scope.admUnits[i].properties.njesia + "").toLowerCase()) {
                $scope.activeLine = $scope.admUnits[i];

                mapLayers({
                    "type": "FeatureCollection",
                    "features": [$scope.admUnits[i]]
                });
                return;
            }
        }

    };


    $scope.openPopoverAdministration = function($e) {
        if ($scope.popoverAdministration) {
            $scope.popoverAdministration.show($e);
            $scope.showPopupMaterial = true;
        } else {
            createPopover($e);
        }
    };

    var createPopover = function(e) {
        $ionicPopover.fromTemplateUrl('templates/popover/popover-administration.html', {
            scope: $scope
        }).then(function(popoverAdministration) {
            $scope.popoverAdministration = popoverAdministration;
            $scope.popoverAdministration.show(e);
            $scope.showPopupMaterial = true;
        });
    };

    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 1000);
});

appControllers.controller('bicycleMapCtrl', function($rootScope, $scope, $state, dbData, $timeout) {
    $scope.showFullSpinner = true;

    var map;

    $scope.$on("mapInited", function(event, mapDataObj) {
        map = mapDataObj.map;

        dbData.getData('getBicycles').then(function(data) {
            mapData(data);
        }, function(error) {
            console.error(error);
            $state.go('main.dashboard');
        });

        $rootScope.$broadcast("myLocationRequest", {
            map: map
        });

    });

    var myIcon = L.icon({
        iconUrl: 'http://tiranamobility.altirana.com/poi/mapiconscollection-markers/bicycle_parking.png',
        iconRetinaUrl: 'http://tiranamobility.altirana.com/poi/mapiconscollection-markers/bicycle_parking.png',
        iconSize: [32, 37],
        iconAnchor: [16, 37], /* shtohen si margin top, left me minus pozicionit te markerit */
        popupAnchor: [0, -37]});

    function mapData(geoObj) {

        L.geoJson(geoObj, {
            style: $rootScope.layerStyle,
            pointToLayer: function(feature, latlng) {
                var html = '<div class="item item-divider">' + feature.properties.name + '</div>';
                html += '<div class="item">Numri <span class="item-note">' + feature.properties.numri + '</span></div>';

                return L.marker(
                        latlng,
                        {icon: myIcon}
                ).addTo(map).bindPopup(html);
            }
        }).addTo(map);
    }

    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 1000);
});

appControllers.controller('reportCtrl', function($rootScope, $scope, $state, userID, language, $stateParams, $ionicPopup, $timeout, dbData, $ionicLoading) {

    $scope.showFullSpinner = true;

    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 1500);

    $scope.stateParams = $stateParams;

    $scope.form = {
        user: userID,
        category: "",
        imgs: [],
        description: "",
        streetName: "",
        lat: 0,
        lon: 0,
        anonymous: true,
        email: "",
        phone: ""
    };


    $scope.categoriesToggle = true;

    if ($rootScope.labelz) {
        getCategories();
    } else {
        $rootScope.$on("gotLabelz", function() {
            getCategories();
        });
    }

    function getCategories() {

        $scope.categories = [];

        dbData.getData('getReportCategories').then(
                function(data) {

                    var i;
                    for (var key in data) {
                        $scope.categories.push({
                            id: data[key].id,
                            label: data[key]["name" + language],
                            desc: data[key]["desc" + language]
                        });
                    }

                    $scope.$broadcast("gotCategories");

                }, function(error) {
            console.log(error);
        });

        $scope.$on("gotCategories", function() {

            if ($scope.stateParams && typeof $scope.stateParams.id !== "undefined") {

                var i = 0;
                for (i; i < $scope.categories.length; i++) {
                    if ($scope.stateParams.id == $scope.categories[i].id) {
                        $scope.activeCategory = $scope.categories[i];
                        $scope.form.category = $scope.activeCategory.id;
                    }
                }

                if ($scope.stateParams.id != -1) {
                    $scope.categoryNotChangable = true;
                    $scope.categoryLabelActive = $scope.activeCategory.label;
//                    $scope.categoryDescriptionActive = "Z";
                }
            }

        });

    }


    $scope.categorySelect = function(category) {
        $scope.form.category = category.id;
        $scope.activeCategory = category;
        $scope.categoryLabelActive = category.label;
        $scope.categoriesToggle = false;
    };

    $scope.reportLocation = function() {
//        watchPosition
        navigator.geolocation.watchPosition(function(position) {
            var coord = {lat: position.coords.latitude, lng: position.coords.longitude};
            $scope.form.lat = position.coords.latitude;
            $scope.form.lon = position.coords.longitude;
            var geocoder = L.Control.Geocoder.nominatim();
            var control = L.Control.geocoder({
                geocoder: geocoder
            });

            dbData.getData("getAdress", "&latlng=" + position.coords.latitude + "," + position.coords.longitude).then(function(data) {

                if (data && data.results[0]
                        && data.results[0].address_components
                        && data.results[0].address_components[0]
                        && data.results[0].address_components[0].long_name) {

                    var street = data.results[0].address_components[0].long_name;
                    $scope.form.streetName = street;
                } else if (data && data.results[0] && data.results[0].formatted_address) {

                    var street = data.results[0].formatted_address;
                    $scope.form.streetName = street;
                }
            }, function(error) {

            });

        }, function(error) {
            console.error("Location not available ", error);
        }, {enableHighAccuracy: true, timeout: 3000});

    };



    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    $scope.postReport = function() {

        var form = angular.copy($scope.form);
        if (!form.category) {
            $rootScope.makeToast($rootScope.labelz.report_category_shouldnt_be_empty);
            return;
        }

        if (!form.imgs.length && !form.description) {
            $rootScope.makeToast($rootScope.labelz.report_description_or_image_shouldnt_be_empty);
            return;
        }

        if (!$scope.anonymous && (($scope.form.email && !validateEmail($scope.form.email)))) {
            $rootScope.makeToast($rootScope.labelz.report_provide_valid_email);
            return;
        }


        $ionicLoading.show({
            template: '<ion-spinner icon="ripple"></ion-spinner><div class="color black font_20 marg_v">' + $rootScope.labelz.report_posting + '</div>',
            hideOnStateChange: true
        });

        dbData.localData('postReport', form).then(function(data) {

            $rootScope.reportData = undefined;
            $rootScope.reportsPublic = undefined;

            if (data && data.status === false && data.limit === false) {

                $scope.reportMsg = $rootScope.labelz.report_failed;

            } else if (data && data.status === false && data.limit === true) {

                $scope.reportMsg = $rootScope.labelz.report_failed;
            } else {

                $scope.reportMsg = $rootScope.labelz.report_sent;
                $state.go('main.reportactions', {'iconClass': 'ion-paper-airplane', 'activeNr': 10, 'color': 'red'});
            }
            $ionicLoading.hide();


            $rootScope.makeToast($scope.reportMsg);
        }, function() {
            $ionicLoading.hide();
            $scope.reportMsg = $rootScope.labelz.report_failed;
            $rootScope.makeToast($scope.reportMsg);
        });
    };

    $scope.fileNrLimit = 3;
    $scope.imgCount = 1;

    /* after file add event */
//    $scope.processFiles = function(file, flow) {
//
//        if ($scope.imgCount >= $scope.fileNrLimit) {
//            return;
//        }
//        $scope.imgCount = $scope.imgCount + 1;
//        var fileReader = new FileReader();
//        fileReader.onload = function(event) {
//            var uri = event.target.result;
//            $scope.form.imgs.push(uri);
//        };
//        console.log(file, file.file)
//        fileReader.readAsDataURL(file.file);
//    };

    $scope.getImage = function() {

        if (!reachedLimit()) {
            dbData.localData("getImage").then(function(data) {
                $scope.form.imgs.push(data);
            }, function(e) {
                console.error(e);
            });
        }
    };

    var reachedLimit = function() {

        if ($scope.form.imgs.length >= $scope.fileNrLimit) {
            $rootScope.makeToast($rootScope.labelz.report_upload_img_limit);
            return true;
        } else {
            return false;
        }
    };

    /* Remove uploaded img */
    $scope.removeThisImg = function(index) {
        $scope.form.imgs.splice(index, 1);
        $scope.imgCount = $scope.imgCount - 1;
        ($scope.imgCount < 0) ? 0 : $scope.imgCount;
    };

    // An alert dialog
    $scope.showPopup = function($event) {
        var description = $scope.activeCategory["desc"] || $rootScope.labelz.no_description_label;
        var alertPopup = $ionicPopup.alert({
            title: $scope.activeCategory.label,
            template: description
        });
        alertPopup.then(function(res) {
//            console.log("closed");
        });
        $event.stopPropagation();
    };

});

/**/
appControllers.controller('reportactionsCtrl', function($rootScope, $scope, $timeout, $state, $stateParams, dbData, userID, language) {
    $scope.showFullSpinner = true;
    $scope.$on('$ionicView.enter', function() {
        console.log('$ionicView.enter')
        $rootScope.reportCategories = undefined;/**/
        if($rootScope.getReportsShouldCall()){
            $scope.showFullSpinner = true;
        }
        $scope.stateParams = $stateParams;
        $scope.reportIcon = $stateParams.iconClass;
        $scope.language = language;

        $scope.myreporttoggle = true;
        $scope.reportLang = (language === "1") ? "code_al" : "code_en";
        $scope.reportStatuses;
        if($rootScope.getReportsShouldCall()){
            $rootScope.getReports();
        }
        $rootScope.$on("publicreports", function(event, publicReports) {
            $scope.reportsPublic10 = publicReports.report.slice().splice(0, 10);
        });


        $scope.calculateReportsNr = function(id) {

            if (id == -1) {
                return $rootScope.reportData.report.length;
            }

            var length = 0;
            var i;
            for (i = 0; i < $rootScope.reportData.report.length; i++) {
                if ($rootScope.reportData.report[i].status == id) {
                    length++;
                }
            }
            return length;
        };

        $timeout(function() {
            $scope.showFullSpinner = false;
        }, 1500);

    });
});

/**/
appControllers.controller('myreportsCtrl', function($rootScope, $scope, $stateParams, appConfig, language) {

    $scope.stateParams = $stateParams;
    $scope.reportLang = (language === "1") ? "code_al" : "code_en";

    var activeContext;

    /* contains an array width undefineds and only
     * the active one true */
    $scope.reportsActive = [];
    
     $scope.dataIndex = undefined;
     $scope.viewIndex = undefined;
    
    function getDataIndex( rid ){
        for(var i = 0; i<$rootScope.reportData.report.length;i++){
           if ($rootScope.reportData.report[i] && ($rootScope.reportData.report[i].rid == rid) ) {
                  return i;
           }
        }
    }
    
    /*
     * Two types of index 
     * (one report index according reportData,
     *  one preview index)
     * @param {Boolean} open
     * @param {type} rid
     * @param {type} $index
     * @returns {void}
     */
    $scope.toggleDetails = function(open, rid, $index) {
        if (open) {
            
            $scope.dataIndex = getDataIndex(rid);
            $scope.viewIndex = $index;
            
            $scope.reportsActive[$scope.viewIndex] = true;
            $scope.detailsOpenClass = "details";
        } else {
            $scope.reportsActive[$scope.viewIndex] = undefined;
            $scope.detailsOpenClass = "";
        }
    };

    if($rootScope.getReportsShouldCall){
            $rootScope.getReports();
        }

    $rootScope.$on("userreports", function() {
        $scope.getReportByStatus();
        if ($stateParams.rid) {
            for (var i = 0; i < $rootScope.reportData.report.length; i++) {
                if ($rootScope.reportData.report[i].rid &&
                        $rootScope.reportData.report[i].rid === $stateParams.rid) {
                    $scope.toggleDetails(true, $stateParams.rid);
                }
            }
        }
    });

    $scope.getReportByStatus = function() {
        var arr = [];
        for (var i = 0; i < $rootScope.reportData.report.length; i++) {
            var report = $rootScope.reportData.report[i];
            if ($stateParams.statusId + '' == '-1' || report.status == $stateParams.statusId) {
                arr.push(report);
            }
        }
        $scope.reportByStatus = arr;
    };

    if ($rootScope.reportData) {
        $scope.getReportByStatus();
    }

    var map;
    $scope.$on("mapInited", function(event, data) {
        map = data.map;
        map.setView(new L.LatLng(appConfig.defaultLat, appConfig.defaultLon), appConfig.defaultZoom);
    });

    var reportmarker;
    function resetMarker(lat, lng) {
        if (reportmarker) {
            map.removeLayer(reportmarker);
        }
        if (lat, lng) {
            reportmarker = L.rotatedMarker({lat: lat, lng: lng}, {
                icon: L.icon({
                    iconUrl: 'assets/graphics/mapicons/2-my_location_navigation_mode75x75.png',
                    iconRetinaUrl: 'assets/graphics/mapicons/2-my_location_navigation_mode75x75.png',
                    iconSize: [35, 35],
                    iconAnchor: [17, 35],
                    popupAnchor: [-35, -17]
                })
            }).addTo(map);
        }
    }

    $scope.$watch("detailsOpenClass", function(newVal, oldVal) {
        if (newVal && map) {
            var currReport = angular.copy($rootScope.reportData.report[$scope.dataIndex]);
            var numLat = Number(currReport.lat);
            var numLon = Number(currReport.lon);
            if (numLat && numLon) {
                map.setView(new L.LatLng(numLat, numLon), 14);
                resetMarker(numLat, numLon);
            } else {
                map.setView(new L.LatLng(appConfig.defaultLat, appConfig.defaultLon), appConfig.defaultZoom);
                resetMarker();
            }
        }
    });

});
/**/
appControllers.controller('publicreportsCtrl', function($rootScope, $ionicScrollDelegate, dbData, $state, $scope, $stateParams, appConfig, language) {

    $scope.stateParams = $stateParams;
    $scope.reportLang = (language === "1") ? "code_al" : "code_en";

    var activeContext, reportDetails;
    if (!reportDetails) {
        reportDetails = document.getElementById("reportDetails");
    }
    $scope.activeIndex = undefined;
    /* contains an array width undefineds and only
     * the active one true */
    $scope.reportsActive = [];
    $scope.toggleDetails = function(open, index) {

        if (open) {
            reportDetails.scrollTop = 0;
            $scope.activeIndex = index;
            $scope.reportsActive[index] = true;
            $scope.detailsOpenClass = "details";
        } else {
            $scope.reportsActive[$scope.activeIndex] = undefined;
            $scope.detailsOpenClass = "";
        }
    };
    if (typeof $rootScope.reportCategories === "undefined") {
        dbData.getData("getReportCategories").then(function(data) {
            $rootScope.reportCategories = data;
        }, function() {
            $state.go('main.dashboard');
        });
    }

    if (typeof $rootScope.reportsPublic === "undefined") {
        dbData.getData("getPublicReports").then(function(data) {

            $rootScope.reportsPublic = data;
            activeSelected();
        }, function(error) {
            $state.go('main.dashboard');
        });
    } else {
        activeSelected();
    }

    function activeSelected() {
        var indexActive = $scope.stateParams.index;
        if (indexActive) {
            $scope.toggleDetails(true, indexActive);
        }
    }

    var map;
    $scope.$on("mapInited", function(event, data) {
        map = data.map;
        var currReport = angular.copy($rootScope.reportsPublic.report[$scope.activeIndex]);
        var numLat, numLon, zoom;
        if (currReport) {
            if (currReport.lat && currReport.lat != 0
                    && currReport.lon && currReport.lon != 0) {
                numLat = Number(currReport.lat);
                numLon = Number(currReport.lon);
                zoom = 14;
            } else {
                numLat = appConfig.defaultLat;
                numLon = appConfig.defaultLon;
                zoom = appConfig.defaultZoom;
            }
        } else {
            numLat = appConfig.defaultLat;
            numLon = appConfig.defaultLon;
            zoom = appConfig.defaultZoom;
        }
        map.setView(new L.LatLng(numLat, numLon), zoom);
    });
    var reportmarker;
    function resetMarker(lat, lng) {
        if (reportmarker) {
            map.removeLayer(reportmarker);
        }
        if (lat, lng) {
            reportmarker = L.rotatedMarker({lat: lat, lng: lng}, {
                icon: L.icon({
                    iconUrl: 'assets/graphics/mapicons/2-my_location_navigation_mode75x75.png',
                    iconRetinaUrl: 'assets/graphics/mapicons/2-my_location_navigation_mode75x75.png',
                    iconSize: [35, 35],
                    iconAnchor: [17, 35],
                    popupAnchor: [-35, -17]
                })
            }).addTo(map);
        }
    }

    $scope.$watch("detailsOpenClass", function(newVal, oldVal) {

        if (newVal && map) {
            var currReport = angular.copy($rootScope.reportsPublic.report[$scope.activeIndex]);
            var numLat, numLon;
            if (currReport) {
                numLat = Number(currReport.lat);
                numLon = Number(currReport.lon);
            }

            if (currReport && numLat && numLon) {
                map.setView(new L.LatLng(numLat, numLon), 14);
                resetMarker(numLat, numLon);
            } else {
                map.setView(new L.LatLng(appConfig.defaultLat, appConfig.defaultLon), appConfig.defaultZoom);
                resetMarker();
            }
        }
    });

});


/* Settings Controller */
appControllers.controller('settingsCtrl', function($ionicHistory, $rootScope, $ionicPopover, $state, $ionicModal, $scope, userID, language, $timeout, dbData, week, stateColor) {

    $scope.showFullSpinner = true;

    /* get user setting after 5000ms */
    $timeout(function() {
        getSettings();
    }, $rootScope.delayOnTransition);

    /* remove loader after 1s */
    $scope.$on('settingsTurned', function() {
        $timeout(function() {
            $scope.showFullSpinner = false;
        }, 300);
    });

    $scope.toChangeLanguage = function(lng) {
        $scope.userSettings.language = lng;
        $rootScope.language = lng;
        $ionicHistory.clearCache();
    };


    $scope.$watch('userSettings.language', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            dbData.getData("language").then(function(data) {
                $scope.$broadcast('settingsTurned');
                $rootScope.labelz = data[($scope.userSettings.language === "2") ? "EN" : "AL" ];
            }, function() {
                $state.go('main.dashboard');
            });
        }
    });

    var lang = (language && language === "2") ? "2" : "1";

    $scope.userSettings = {};
    function getSettings(reCalled) {

        dbData.getData('getSettings', '&userID=' + userID + '&lng=' + lang).then(function(dataa) {

            var data = typeof dataa === "object" ? dataa : JSON.parse(dataa);

            if (data.found !== true) {
                if (reCalled && reCalled === true) {
                    $state.go('main.dashboard');
                }
                getSettings(true);
            }
            var dataBind = data;

            dataBind.digest.start = dateStringToObject(data.digest.start);
            dataBind.digest.finish = dateStringToObject(data.digest.finish);

            $scope.userSettings = dataBind;

            $scope.digestWeek = ($scope.userSettings.digest.weekdays[0] ||
                    $scope.userSettings.digest.weekdays[1] || $scope.userSettings.digest.weekdays[2] ||
                    $scope.userSettings.digest.weekdays[3] || $scope.userSettings.digest.weekdays[4] ||
                    $scope.userSettings.digest.weekdays[5] || $scope.userSettings.digest.weekdays[6]);

            if (!$scope.userSettings.streetsAll) {
                selectedStreets();
            }

        }, function(e) {
            $state.go('main.dashboard');
            $rootScope.makeToast($rootScope.labelz.error_get_settings);
        });
    }
    /* Street Modal */
    $scope.streetModal = function() {
        if (!$scope.modal) {
            $ionicModal.fromTemplateUrl("templates/modal/street-list.html", {
                scope: $scope,
                animation: 'slide-in-up'
//                ,backdropClickToClose: false
            }).then(function(modal) {
                $scope.modal = modal;
                $timeout(function() {
                    $scope.modal.show();
                }, 100);
            });
        } else {
            $scope.modal.show();
        }
    };

    // Close the modal
    $scope.closeStreetModal = function() {
        $scope.modal.hide();
//        $scope.modal.remove();
    };

    function selectedStreets() {
        $scope.selectedStreets = [];
        var i = 0;

        for (i; i < $scope.userSettings.streets.length; i++) {
            if ($scope.userSettings.streets[i].segments) {
                var j = 0;
                var streetIsSelected = false;
                for (j; j < $scope.userSettings.streets[i].segments.length; j++) {
                    if ($scope.userSettings.streets[i].segments[j].isSelected) {
                        streetIsSelected = true;
                    }
                }
                if (streetIsSelected === true) {
                    $scope.selectedStreets.push($scope.userSettings.streets[i].streetName);
                }
            }
        }

    }

    $scope.selectAll = function(bool) {
        var i = 0;
        for (i; i < $scope.userSettings.streets.length; i++) {
            if ($scope.userSettings.streets[i].segments) {
                var j = 0;
                for (j; j < $scope.userSettings.streets[i].segments.length; j++) {
                    $scope.userSettings.streets[i].segments[j].isSelected = bool;
                }
            }
        }
        $scope.popoverStreets.hide();
    };


    $scope.saveCloseStreetmodal = function() {
        $timeout(function() {
            getSettings(true);
            $scope.modal.hide();
        }, 450);

//        $scope.modal.remove();
    };


    function dateObjectToString(thisdate) {
        if (!thisdate) {
            return '00:00';
        }
        var hours = thisdate.getHours();
        var minutez = thisdate.getMinutes();
        if (hours + '' === '0') {
            hours = '00';
        }
        if (minutez + '' === '0') {
            minutez = '00';
        }
        return hours + ':' + minutez;
    }

    function dateStringToObject(thisdate) {
        if (!thisdate) {
            return new Date(1970, 0, 1, 0, 0, 0);
        }
        return new Date(1970, 0, 1, thisdate.split(":")[0], thisdate.split(":")[1], 0);
    }

    $scope.timeOnChange = function() {
        var zz = $scope.userSettings.digest.start;

        if (zz === null || typeof zz === "undefined") {
            $scope.userSettings.digest.start = dateStringToObject("00:00");
        }
    };

    var postTimer;
    var firstTime = true;

    $scope.$watch('userSettings', function(newVal, oldVal) {

        if (typeof $scope.userSettings === "undefined") {
            return;
        }

        $timeout.cancel(postTimer);
        if (!firstTime) {

            postTimer = $timeout(function() {
                var datePost = angular.copy($scope.userSettings);
                if (typeof datePost === "undefined") {
                    return;
                }

                datePost.digest.start = dateObjectToString(datePost.digest.start);
                datePost.digest.finish = dateObjectToString(datePost.digest.finish);

                dbData.localData('postSettings', datePost).then(function(data) {

                }, function(error) {
                    /* if settings not saved get those from server */
                    getSettings();

                    $rootScope.makeToast($rootScope.labelz.error_post_settings);

                });

            }, 400);

        } else {
            firstTime = false;
        }

    }, true);

    $scope.openPopoverStreets = function($e) {
        if ($scope.popoverStreets) {

            $scope.popoverStreets.show($e);
        } else {
            createPopover($e);
        }
        $rootScope.showPopupMaterial = true;
    };

    var createPopover = function(e) {
        $ionicPopover.fromTemplateUrl('templates/popover/popover-settings-streets.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popoverStreets = popover;
            $scope.popoverStreets.show(e);
        });
    };


    $scope.changed = function() {
        console.log("changed");
    };

});

/* Credits Controller */
appControllers.controller('creditsCtrl', function($rootScope, $scope, $timeout, stateColor) {
    $scope.showFullSpinner = true;

    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 1000);

});

/* Terms and conditions Controller */
appControllers.controller('termsCtrl', function($rootScope, $scope, $timeout, stateColor) {

    $scope.showFullSpinner = true;

    $timeout(function() {
        $scope.showFullSpinner = false;
    }, 1000);

});