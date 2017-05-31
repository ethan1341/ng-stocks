/**
 * The Parent Controller(Abstract) for profile and overview. Must functions will be called and ran in this controller for re-usability
 */


angular.module('ngStocks').controller('dashboardController', ['$scope', 'stockService', '$q', 'API', '$window', 'SAMPLE_DATA', '$state', function ($scope, stockService, $q, API, $window, SAMPLE_DATA, $state) {
    $scope.dashboard = {
        stocks: {}
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
            stockService.stockTickerAutoComplete('GET', URL, {}, {}, function (data) {
                $scope.returnedSymbols = data.data.ResultSet.Result;
                console.log($scope.returnedSymbols)
            }, function (error) {
                console.log('error', error)
            })
        }, function (error) {
            console.log('there was an error', error)
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
                if (data.data.status == 'existed') {
                    console.log('existed');
                } else {
                    $scope.dashboard.stocks[stockSymbol] = data.data
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
            $scope.dashboard.stocks = data.data;
            console.log($scope.dashboard.stocks);
            var graphKey = Object.keys($scope.dashboard.stocks)[0];
            $scope.currentGraph = $scope.dashboard.stocks[graphKey].Graph;
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
        stockService.removeUserStock('POST', API.removeStock, {symbol: symbol}, {headers: {'Content-Type': 'application/json'}}, function (data) {
            delete $scope.dashboard.stocks[symbol]
        }, function (err) {
            console.log(err);
        });
    };

    /**
     * Returns data which is stored in scope variables allowing angular chart js to make graphs
     */
    $scope.getStocks().then(function (data) {
    }, function (err) {
        console.log(err)
    });

    $scope.logOut = function () {
        $window.sessionStorage.clear();
    };

}]);