
"use strict";
(function(){
	angular.module("stapiApp").controller("inicioController",function($rootScope, $route, $scope, $ocLazyLoad, dateUtil, $timeout, stService,$compile ,config, $http, $templateCache, $controller, $mdColorUtil, $mdColors,  ChartJs, $mdColorPalette){

		if(!$rootScope.carregou || $rootScope.carregou==false){
	
			$ocLazyLoad.load({
					files: ["http://localhost:8080/StApi/dev/app/login/js/moduloTest.js"]
					
		       	} 
			    ).then(function(){
				
				
				console.log("Carregou!!!");
				$route.reload();
				$rootScope.carregou = true;
				
			});
		}
		
	

	
	})

})();