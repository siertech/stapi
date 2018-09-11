"use strict";
(function(){

	angular.module("stapiApp")
	
	.directive("testeGridView",function(){
           
		
		return {
			
			restrict:"E",
			templateUrl:"app/teste/html/gridView.html",
			scope:{
				objetos:"=",
				editFunction:"=",
				deleteFunction:"="
			},
			controllerAs:"vm",
		    bindToController: true,
		    controller: function(){
		    	
		    	
		    }
		};

	})
	
	.directive("testeTableView",function(){
           
		
		return {
			
			restrict:"E",
			templateUrl:"app/teste/html/tableView.html",
			scope:{
				objetos:"=",
				editFunction:"=",
				deleteFunction:"="
			},
			controllerAs:"vm",
		    bindToController: true,
		    controller: function(){
		    	
		    	
		    }
		};

	})


	.directive("testeForm",function(){
           
		
		return {
			
			restrict:"E",
			templateUrl:"app/teste/html/form.html",
			scope:{
				item:"="
			},
			controllerAs:"vm",
		    bindToController: true,
		    controller: function(){
		    	
		    	
		    }
		};

	})

})();
