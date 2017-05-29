/**
 * Stock Overview child controller generates the graphs when user clicks on one of the buttons
 */

angular.module('ngStocks').controller('dashboardOverviewController',['$stateParams','$scope',function($stateParams,$scope){
    $scope.generateGraph = function(symbol){
        $scope.$parent.currentGraph = $scope.graphMap[symbol];
        $('.stock-button').removeClass('active');
        $('#' + symbol).addClass('active');

    };
}]);