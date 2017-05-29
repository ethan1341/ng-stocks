/**
 * Error Controller redirect if something goes wrong destroys sessionStorage
 */

angular.module('ngStocks').controller('redirectController',['userService','API','$window','$state',function(userService,API,$window,$state){
    $window.sessionStorage.clear();
}]);