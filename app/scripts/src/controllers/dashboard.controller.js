/**
 * The Parent Controller(Abstract) for profile and overview. Must functions will be called and ran in this controller for re-usability
 */

angular.module('ngStocks').controller('dashboardController', ['$scope', 'stockService', '$q', 'API', '$window','SAMPLE_DATA','$state',function ($scope, stockService, $q, API, $window,SAMPLE_DATA,$state) {
    $scope.dashboard = {};
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
                $scope.getStocks();
                $scope.getStockCharts();
            }, function (error) {
                console.log('error', error)
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
            $scope.dashboard.stocks = data.data;
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
            console.log(data);
            $scope.getStocks().then(function(){
                $scope.getStockCharts();
            });

        }, function (err) {
        });
    };
    /**
     * Returns data which is stored in scope variables allowing angular chart js to make graphs
     */
    $scope.getStockCharts = function () {
        console.log('e');
        stockService.getUserStockCharts('GET', API.stockCharts, {}, {}, function (data) {
            console.log('f');
            console.log(data.data.length,'length')
           if(data.data == '404'){
               $window.sessionStorage.clear();
               $state.go('login')
           };
            if (data.data.length == 0) {
                console.log('0')
                $scope.realGraph = false ;
                console.log($scope.currentGraph,'graph');
            } else {
                $scope.realGraph = true ;
                $scope.graphMap = {};
                for (var i = 0; i < data.data.length; i++) {
                    var symbol = data.data[i].Elements[0].Symbol;
                    var name = data.data[i].Elements[0].Name;
                    $scope.graphMap[symbol] = data.data[i];
                    $scope.graphMap[symbol].symbol = symbol
                }
                $scope.currentGraph = $scope.graphMap[data.data[0].Elements[0].Symbol];
                console.log('this si current graph', $scope.graphMap);
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