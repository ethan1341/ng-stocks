angular.module('ngStocks').controller('registerController',['$scope','userService','API',function($scope,userService,API){
    $scope.signUp = function(){
        console.log('hello')
        userService.registerUser('get',API.register,function(data){console.log(data)},function(){})
    };
}]);

