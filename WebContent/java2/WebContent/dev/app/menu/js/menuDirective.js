"use strict";

(function(){

	angular.module("stapiApp")
	.directive("appMenu", appMenu);
	
	function appMenu(){
		
		return{
			restrict:"E",
			templateUrl:"app/menu/html/menu.html",
			controllerAs:"$menuCtrl",
		    controller:"menuCtrl" 
			
		}
	};
	

	
})();

