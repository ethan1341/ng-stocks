var app = angular.module('ngStocks', ['ui.router','chart.js']);

app.run(['$rootScope', '$window', '$state', 'userService',
    function ($rootScope, $window, $state, userService) {
        /**
         * Set the App to watch for login status for every state change
         */
    if($window.sessionStorage["userInfo"]){
        $state.go('dashboard.overview')
    }else{
        $state.go('login')
    }

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            userService.loginCheck(event, toState, toParams, fromState, fromParams)
        })




}]);

app.constant('API',{
    userStocks:'/stocks',
    register:'/facebook',
    stockCharts:'/stockCharts',
    userInfo:'/userInfo'
});
angular.module("ngStocks")
    .config(function ($stateProvider) {
        $stateProvider
            .state("login", {
                url: "/login",
                controller: "loginController",
                templateUrl: "app/html/login.html"
            })
            .state("register", {
                url: "/register",
                controller: "registerController",
                templateUrl: "app/html/register.html"
            })
            .state("dashboard", {
                url: "/dashboard",
                abstract: true,
                controller: "dashboardController",
                templateUrl: "app/html/dashboard.html"
            })
            .state("dashboard.overview", {
                url: "/overview",
                controller: "dashboardOverviewController",
                templateUrl: "app/html/dashboard-overview.html"
            })
            .state("dashboard.portfolio", {
                url: "/portfolio",
                controller: "dashboardPortfolioController",
                templateUrl: "app/html/dashboard-portfolio.html"
            })
            .state("redirect", {
                url: "/redirect",
                controller: "redirectController",
                templateUrl: "app/html/login-redirect.html"
            });

    });

app.service('stockService',['requestWrapper','API',function(requestWrapper,API){
    var stockTickerAutoComplete = function(action,URL,data,options,successCB,errorCB){
        requestWrapper.makeRequest(action,URL,data,options,successCB,errorCB);
    };
    var postStockSymbol = function(action,URL,data,options,successCB,errorCB){
        requestWrapper.makeRequest(action,URL,data,options,successCB,errorCB);
    };
    var getUserStocks = function(action,URL,data,options,successCB,errorCB){
        requestWrapper.makeRequest(action,URL,data,options,successCB,errorCB);
    };
    var getUserStockCharts = function(action,URL,data,options,successCB,errorCB){
        requestWrapper.makeRequest(action,URL,data,options,successCB,errorCB)
    };
    return{
        stockTickerAutoComplete:stockTickerAutoComplete,
        postStockSymbol:postStockSymbol,
        getUserStocks:getUserStocks,
        getUserStockCharts:getUserStockCharts
    }
}]);
app.service('userService', ['requestWrapper', 'API', '$window', '$state', function (requestWrapper, API, $window, $state) {
    var watchLoginChange = function () {

    };

    var registerUser = function (action, URL, data, successCB, errorCB) {
        requestWrapper.makeRequest(action, URL, data, successCB, errorCB)
    };

    var getUserInfo = function (action, URL, data, successCB, errorCB) {
        console.log('adfadf')
        requestWrapper.makeRequest(action, URL, data, successCB
            , errorCB)
    };
    var loginCheck = function (event, toState, toParams, fromState, fromParams) {
        var parentRoute = toState.name.split('.');

        if (!$window.sessionStorage["userInfo"]) {
            if (toState.name == 'dashboard' || parentRoute[0] == 'dashboard') {
                event.preventDefault()
                $state.go('login')
            }else{
                console.log(toState);
            }
        }


    };


    return {
        watchLoginChange: watchLoginChange,
        registerUser: registerUser,
        getUserInfo: getUserInfo,
        loginCheck: loginCheck


    }
}]);
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
angular.module('ngStocks').controller('dashboardOverviewController',['$stateParams','$scope',function($stateParams,$scope){
   $scope.parent = $scope.$parent;
    $scope.generateGraph = function(symbol){
        $scope.currentGraph = $scope.parent.graphMap[symbol];
        $('.stock-button').removeClass('active');
        $('#' + symbol).addClass('active');

    };
}]);
angular.module('ngStocks').controller('dashboardPortfolioController',['userService','API',function(userService,API){

}]);
angular.module('ngStocks').controller('homeController',['$state','$rootScope',function($state,$rootScope){

}]);
angular.module('ngStocks').controller('loginController',['$state','$scope','userService',function($state,$scope,userService){
    console.log($scope);

}]);
angular.module('ngStocks').controller('redirectController',['userService','API','$window','$state',function(userService,API,$window,$state){
    userService.getUserInfo('GET',API.userInfo,{},{},function(data){
        if(data.data.name){
            $window.sessionStorage["userInfo"] = JSON.stringify(data.data);
            $state.go('dashboard.overview');
        }else{
            $state.go('login')
        }
    },function(err){console.log(err)})
}]);
angular.module('ngStocks').controller('registerController',['$scope','userService','API',function($scope,userService,API){
    $scope.signUp = function(){
        console.log('hello')
        userService.registerUser('get',API.register,function(data){console.log(data)},function(){})
    };
}]);


app.service('requestWrapper', function($http, $q){

    var basePath = 'http://localhost:4000';
    //  => http://domain.com/api/path/foo/bar

    function makeRequest(verb, uri, data,options,successCB,errorCB){
        var defer = $q.defer();
        verb = verb.toLowerCase();
        //start with the uri
        var httpArgs = [basePath + uri];
        if (verb.match(/post|put/)){
            $http[verb](uri,data,options)
                .then(successCB,errorCB);
        }else{
            $http[verb](uri,data)
                .then(successCB,errorCB);
        }

        return defer.promise
    }

    return {
        makeRequest:makeRequest,
        get: function( uri ){
            return makeRequest( 'get', uri );
        }
        ,post: function( uri, data ){
            return makeRequest( 'post', uri,data,options );
        }
        ,put: function( uri, data ){
            return makeRequest( 'put', uri, data );
        }
        ,delete: function( uri ){
            return makeRequest( 'delete', uri );
        }
    };
});