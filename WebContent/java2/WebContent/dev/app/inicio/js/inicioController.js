
"use strict";
(function(){
	angular.module("stapiApp").controller("inicioController",function($scope, dateUtil, $timeout, stService,$compile ,config, $http, $templateCache, $controller, $mdColorUtil, $mdColors,  ChartJs, $mdColorPalette){

		
		var obj = {
			"objectName":"Cliente",	 
			"items" : [
			  {"id":"3", "orderIndex":"4"}	
			]
		}
		
		stService.executePost("/reorder-items/", obj);
	
	})

})();