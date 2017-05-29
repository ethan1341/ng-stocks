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