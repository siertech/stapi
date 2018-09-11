
"use strict";
(function(){
angular.module("stapiApp").config(function($routeProvider, $httpProvider){

	//Inicio
	$routeProvider.when("/inicio",{

		templateUrl:"app/inicio/html/inicio.html",
		controller:"inicioController",
		controllerAs: "$inicioCtrl"

	}); 

})
})();

