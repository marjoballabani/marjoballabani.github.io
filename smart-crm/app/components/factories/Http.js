
app.factory('Http', ['$http', 'Utils', function ($http, Utils) {
    'use strict';
    return {
        /**
         * GET Request
         * @param url
         * @param data
         * @param success callback
         * @param error callback
         */
        GET: function (url, data, success, error) {
            $http({
                url: url,
                method: "GET",
                params: data
            }).then(success, error);
        },
        /**
         * PUT Request
         * @param url
         * @param data
         * @param success callback
         * @param error callback
         */
        PUT: function (url, data, success, error) {
            $http({
                url: url,
                method: "PUT",
                data: Utils.buildFormData(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(success).error(error);
        },
        /**
         * POST Request
         * @param url
         * @param data
         * @param success callback
         * @param error callback
         */
        POST: function (url, data, success, error) {
            $http({
                url: url,
                method: "POST",
                data: Utils.buildFormData(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(success).error(error);
        },
        /**
         * POST Request
         * @param url
         * @param data
         * @param success callback
         * @param error callback
         */
        DELETE: function (url, data, success, error) {
            $http({
                url: url,
                method: "DELETE",
                params: data
            }).success(success).error(error);
        }
    };
}]);