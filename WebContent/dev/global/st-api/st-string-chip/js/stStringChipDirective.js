"use strict";
(function(){

	angular.module("stapi")
	
	.directive("stStringChip", stInputChip)
	
	function stInputChip(){
		
		return {
			
			restrict:"E",
			template: ' <md-chips ng-model="ctrl.items"  placeholder="{{ctrl.placeholder}}"></md-chips>',
			controllerAs: "ctrl",
			bindToController: true,
			scope: {
			   ngModel:"=",
			   placeholder: "@"
			},
			controller: function($scope){
				
				var ctrl = this;
				ctrl.items = ctrl.ngModel ? ctrl.ngModel.split(",") : [];
				
				$scope.$watch("ctrl.items", function(value){
					
					if(value)
					ctrl.ngModel = value.join();
				});
			}
		}
		
	}
	
	  
})();
