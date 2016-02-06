
var Insomnia = {};
Insomnia.keepAwake = function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "Insomnia", "keepAwake", []);
};

Insomnia.allowSleepAgain = function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "Insomnia", "allowSleepAgain", []);
};
