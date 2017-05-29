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