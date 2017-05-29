/**
 * Generic request function used with ALL API requests
 */

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