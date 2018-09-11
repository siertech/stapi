"use strict";
(function(){
angular.module("stapiApp").config(function($routeProvider,$httpProvider, $locationProvider){

	$routeProvider.when("/login",{

		templateUrl:"app/login/html/login.html",
		controller:"loginController",
		controllerAs: "$loginCtrl"
		
	});
	
	$routeProvider.when("/notfound",{

		template: "<p>Página não encontrada</p>"
	
	});
	
	
});

})();

