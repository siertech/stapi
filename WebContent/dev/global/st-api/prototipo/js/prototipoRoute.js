"use strict";
(function(){
	angular.module("stapi") 
	.config(function($routeProvider, $httpProvider){

	//Rota para listagem dos objetos
	$routeProvider.when("/prototipo",{

		template:"<prototipo-list></prototipo-list>",
	    
	}); 
	
	//Rota para listagem dos objetos
	$routeProvider.when("/prototipo/:id",{

		templateUrl:"global/st-api/prototipo/html/prototipoDetalhe.html",
		controller: "prototipoDetalheCtrl",
		controllerAs: "$prototipoDetalheCtrl",
		resolve: {
			itemId: function($route){
				return $route.current.params.id;
			}
		}
	    
	}); 

})

})();
