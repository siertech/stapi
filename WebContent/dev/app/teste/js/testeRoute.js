"use strict";
(function(){
	angular.module("stapiApp") 
	.config(function($routeProvider, $httpProvider){

	//Rota para listagem dos objetos
	$routeProvider.when("/teste",{

		templateUrl:"app/teste/html/list.html",
		controller: "listtesteController",
		controllerAs:"vm"

	}); 

})

})();
