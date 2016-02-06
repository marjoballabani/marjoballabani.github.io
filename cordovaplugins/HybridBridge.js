
var HybridBridge = {};


HybridBridge.makeToast = function(text){

		cordova.exec(function() {
               
        }, function(error) {
		
        }, "HybridBridge", "toast", [text]);
		
};

HybridBridge.notificationsNumber = function(callback){

		cordova.exec(function(data) {
                callback(data)
        }, function(error) {
                callback(error);
        }, "HybridBridge", "notificationsNumber", []);	
		
};

HybridBridge.openUrl = function(url){

		cordova.exec(function() {
              
        }, function(error) {
                callback(error);
        }, "HybridBridge", "openUrl", []);
		
};
