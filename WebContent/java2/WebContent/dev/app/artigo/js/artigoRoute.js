"use strict";
(function(){
	angular.module("stapiApp") 
	.config(function($routeProvider, $httpProvider){

	//Rota para listagem dos objetos
	$routeProvider.when("/artigo",{

		template:"<artigo-list></artigo-list>",
	    
	}); 

})

})();
