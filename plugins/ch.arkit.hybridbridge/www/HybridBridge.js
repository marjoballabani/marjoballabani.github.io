cordova.define("ch.arkit.hybridbridge.HybridBridge", function(require, exports, module) { var exec = require('cordova/exec');

var HybridBridge = {};


HybridBridge.makeToast = function(text){

		cordova.exec(function() {
               
        }, function(error) {
		
        }, "HybridBridge", "toast", [text]);
		
}

HybridBridge.notificationsNumber = function(callback){

		cordova.exec(function(data) {
                callback(data)
        }, function(error) {
                callback(error);
        }, "HybridBridge", "notificationsNumber", []);	
		
}

HybridBridge.openUrl = function(url){

		cordova.exec(function() {
              
        }, function(error) {
                callback(error);
        }, "HybridBridge", "openUrl", []);
		
}

HybridBridge.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.HybridBridge = HybridBridge;
  return window.plugins.HybridBridge;
};

cordova.addConstructor(HybridBridge.install);
});
