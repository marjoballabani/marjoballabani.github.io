/**
 * Created by User on 22/06/2016.
 */
app.factory('DataFactory', ['$rootScope', function ($rootScope) {
    console.log('DataFactory started...');
    var dataFactory = {};
    
    dataFactory.url = [
        {
            title: 'dashboard',
            url: 'components/views/dashboard/dashboard.html'
        }
    ];
    
    return dataFactory;
}]);