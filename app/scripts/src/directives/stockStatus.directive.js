angular.module('ngStocks').directive('stockStatus', function () {
    return {
        restrict: 'E',
        compile: function (ele, att) {
            console.log('ran')
        }, // DOM manipulation before the link function element is the directive element attr are the associated attributes
        templateUrl: '/app/html/directives/stock-status.html',
        scope: {stocks: '='},
        link: function (scope, ele, attr) {
            console.log(scope, 'scope');
            console.log(ele, 'ele');
            console.log(attr, 'att');
        }

    }
});