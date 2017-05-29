angular.module('ngStocks').controller('dashboardOverviewController',['$stateParams','$scope',function($stateParams,$scope){
   $scope.parent = $scope.$parent;
    $scope.generateGraph = function(symbol){
        $scope.currentGraph = $scope.parent.graphMap[symbol];
        $('.stock-button').removeClass('active');
        $('#' + symbol).addClass('active');

    };
}]);