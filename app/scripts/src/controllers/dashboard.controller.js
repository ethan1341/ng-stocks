angular.module('ngStocks').controller('dashboardController', ['$scope', 'stockService','$q','API','$window',function ($scope,stockService,$q,API,$window) {
    $scope.dashboard = {};
    $scope.returnedSymbols;
    $scope.graphMap = {};
    $scope.setActive = function (id) {
        $('li').removeClass('active');
        console.log($scope);
        $('#' + id).addClass('active');
        console.log('#' + id);
    };

    $scope.searchTicker = function (ticker) {

        var stockAPIURL = function (symbol) {
            var deferred = $q.defer();
            var symbolURL = 'https://s.yimg.com/aq/autoc?query=' + symbol + '&region=CA&lang=en-CA';
            if(symbol == "" || symbol == undefined){
                deferred.reject({error:'no stock entered'})
            }else{
                deferred.resolve(symbolURL);
            }
            return deferred.promise;
        };

        stockAPIURL(ticker).then(function(URL){
            console.log('this ran')
            stockService.stockTickerAutoComplete('GET',URL,{},{},function(data){ $scope.returnedSymbols = data.data.ResultSet.Result; console.log($scope.returnedSymbols)},function(error){console.log('error',error)})
        },function(error){
            console.log('there was an error')
        })
    };

    $scope.postStock = function(symbol){
        var data = {};
        var selectedStock = symbol.split(':');
        data.symbol = selectedStock[1];
        if(data.symbol == undefined){

        }else{
         stockService.postStockSymbol('POST',API.userStocks,data,{headers:{'Content-Type': 'application/json'}},function(data){console.log('data',data)},function(error){console.log('error',error)})
        }

    };

    $scope.getStocks = function(){
        stockService.getUserStocks('GET',API.userStocks,{},{},function(data){$scope.dashboard.stocks = data.data; console.log($scope.dashboard.stocks)},function(err){console.log(err)});
    };

    $scope.getStockCharts = function() {
        stockService.getUserStockCharts('GET',API.stockCharts,{},{},function(data){
            console.log(data);
            for(var i = 0; i < data.data.length;i++){
                var symbol = data.data[i].Elements[0].Symbol;
                var name = data.data[i].Elements[0].Name;
                $scope.graphMap[symbol] = data.data[i];
                $scope.graphMap[symbol].symbol = symbol
            }
           $scope.currentGraph = $scope.graphMap[data.data[0].Elements[0].Symbol];
        },function(error){console.log(error)})
    };



    $scope.getStockCharts();
    $scope.getStocks();

    $scope.logOut = function () {
        $window.sessionStorage.clear();
    };

}]);