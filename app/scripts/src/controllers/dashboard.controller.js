/**
 * The Parent Controller(Abstract) for profile and overview. Must functions will be called and ran in this controller for re-usability
 */

/**
 * IMPORTANT
 * $scope.dashboard.stocks is what updates that STOCK TABLE
 * $scope.graphMap contains ALL THE GRAPH DATA
 * $scope.currentGraph contains the DATA FOR THE GRAPH WANTING TO BE DISPLAYED
 * $scope.graphMap is also the map that shows the symbols in the small grey buttons
 */

angular.module('ngStocks').controller('dashboardController', ['$scope', 'stockService', '$q', 'API', '$window','SAMPLE_DATA','$state',function ($scope, stockService, $q, API, $window,SAMPLE_DATA,$state) {
    $scope.dashboard = {
        stocks:{}
    };
    $scope.currentGraph;
    $scope.returnedSymbols;
    $scope.graphMap = {};
    $scope.chart = SAMPLE_DATA.chart;
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
            if (symbol == "" || symbol == undefined) {
                deferred.reject({error: 'no stock entered'})
            } else {
                deferred.resolve(symbolURL);
            }
            return deferred.promise;
        };

        stockAPIURL(ticker).then(function (URL) {
            console.log('this ran')
            stockService.stockTickerAutoComplete('GET', URL, {}, {}, function (data) {
                $scope.returnedSymbols = data.data.ResultSet.Result;
                console.log($scope.returnedSymbols)
            }, function (error) {
                console.log('error', error)
            })
        }, function (error) {
            console.log('there was an error',error)
        })
    };
    /**
     * Post a stock selected from the INPUT in the NAVBAR:HTML
     * @param symbol
     */
    $scope.postStock = function (symbol) {
        var data = {};
        var selectedStock = symbol.split(':');
        data.symbol = selectedStock[1];
        if (data.symbol == undefined) {

        } else {
            stockService.postStockSymbol('POST', API.userStocks, data, {headers: {'Content-Type': 'application/json'}}, function (data) {
                var stockSymbol = data.data.Symbol;
                console.log(data);
                if(data.data.status == 'existed'){
                    console.log('existed');
                }else{
                    console.log('did not exist');
                }

                //$scope.getStockCharts();
            }, function (error) {
            })
        }

    };
    /**
     * Gets all the stocks the user has chosen to follow
     * @returns {Promise}
     */
    $scope.getStocks = function () {
        var deferred = $q.defer();
        stockService.getUserStocks('GET', API.userStocks, {}, {}, function (data) {
            for(var i = 0; i < data.data.length;i++){
                var mapKey = data.data[i].Symbol;
                $scope.dashboard.stocks[mapKey] = data.data[i];
            };
            deferred.resolve($scope.dashboard.stocks);
        }, function (err) {
            deferred.reject(err)
        });
        return deferred.promise;
    };
    /**
     * Removes stock by posting a symbol:HTML
     * @param symbol i.e  string:APPL
     */
    $scope.removeStock = function (symbol) {
        console.log(symbol);
        stockService.removeUserStock('POST', API.removeStock, {symbol: symbol}, {headers: {'Content-Type': 'application/json'}}, function (data) {
            for(var i = 0; i < $scope.dashboard.stocks.length;i++){
              if($scope.dashboard.stocks[symbol].Symbol == symbol){
                  delete $scope.dashboard.stocks[symbol]
              }
            };
        }, function (err) {
            console.log(err);
        });
    };
    /**
     * Returns data which is stored in scope variables allowing angular chart js to make graphs
     */
    $scope.getStockCharts = function () {
        console.log('e');
        stockService.getUserStockCharts('GET', API.stockCharts, {}, {}, function (data) {
           if(data.data == '404'){
               $window.sessionStorage.clear();
               $state.go('login')
           };
            if (data.data.length == 0) {
                $scope.realGraph = false ;
            } else {
                $scope.realGraph = true ;
                for (var i = 0; i < data.data.length; i++) {
                    var symbol = data.data[i].Elements[0].Symbol;
                    var name = data.data[i].Elements[0].Name;
                    console.log( $scope.dashboard.stocks);
                    $scope.dashboard.stocks[symbol].Graph = data.data[i];
                }
                $scope.currentGraph = $scope.dashboard.stocks[ data.data[0].Elements[0].Symbol ].Graph

            }
        }, function (error) {
            console.log(error)
        })
    };

    $scope.getStocks().then(function(){
        $scope.getStockCharts();
    },function(err){console.log(err)});

    $scope.logOut = function () {
        $window.sessionStorage.clear();
    };

}]);