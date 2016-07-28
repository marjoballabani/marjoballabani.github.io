
app.factory('Utils', ['$timeout', 'Constants', function ($timeout, Constants) {
    'use strict';

    return {
        /**
         * Decode base64 string
         * @param str
         * @returns {string}
         */
        decodeBase64: function (str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        },

        /**
         * Build form data (key=value&key2=value2&)
         */
        buildFormData: function (data) {
            var str = "";
            var key;
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    if (data[key] !== null) {
                        str += key + "=" + data[key] + "&";
                    }
                }
            }
            return str.substr(0, str.length - 1);
        },

        /**
         * Show Loading Mask
         * @nodeTree Takes node where to be shown
         * Add image ../app/images/ball-triangle-loader.svg
         */
        showLoadingMask: function (nodeTree) {
            var loadingDiv = document.createElement("div");
            loadingDiv.style.position = "fixed";
            loadingDiv.style.top = "100px"; //Header height
            loadingDiv.style.bottom = "0";
            loadingDiv.style.right = "0";
            loadingDiv.style.left = "0";
            loadingDiv.style.width = "100%";
            loadingDiv.style.height = "100%";
            // TODO - Delete line below if not needed any more
            loadingDiv.style.backgroundImage= "url('../app/images/tail-spin.svg')";
            loadingDiv.style.backgroundRepeat = "no-repeat";
            loadingDiv.style.backgroundPosition = "center calc(50% - 65px)";
            loadingDiv.style.backgroundColor = "rgba(255, 255,255, 0.4)";
            loadingDiv.style.backgroundSize = "30px";
            loadingDiv.style.zIndex = "500000";
            nodeTree.insertBefore(loadingDiv, nodeTree.firstElementChild);
        },

        /**
         * Hides loading mask from node after 0.3s (delay for good looking)
         * @node where to be hidden from
         * @timeout delay in ms(optional)
         */
        hideLoadingMask: function (node, timeout) {
            if (timeout === null || timeout === undefined) {
                timeout = 0; //Default
            }
            $timeout(function () {
                if (node.firstElementChild) {
                    node.removeChild(node.firstElementChild);
                }
            }, timeout);
        },

        /**
         * Shows popup and hides after some time specified in function
         * @popupType Success | Error | Information | Warning
         * @message to be shown
         */
        showPopup: function (popupType, message) {
            var showHideTimeTransition = 800; // Change both from here and css (same value)
            var hideAfterSeconds = 4000;
            var popupDiv = document.createElement("div");
            popupDiv.className = "popup alert alert-danger";
            if (popupType === Constants.PopupType.SUCCESS) {
                popupDiv.className += " success-popup";
            } else if (popupType === Constants.PopupType.ERROR) {
                popupDiv.className += " error-popup";
            }
            popupDiv.innerHTML = message;
            var removeIcon = document.createElement("span");
            removeIcon.className = "glyphicon glyphicon-remove popup-close-icon";
            removeIcon.onclick = function () {
                if (popupDiv) {
                    document.body.removeChild(popupDiv);
                    popupDiv = null;
                }
            };
            popupDiv.appendChild(removeIcon);
            document.body.appendChild(popupDiv);
            $timeout(function () {
                if (popupDiv) {
                    popupDiv.style.opacity = "0";
                }
            }, hideAfterSeconds);

            $timeout(function () {
                if (popupDiv) {
                    document.body.removeChild(popupDiv);
                }
            }, hideAfterSeconds + showHideTimeTransition);
        }
    };
}]);
