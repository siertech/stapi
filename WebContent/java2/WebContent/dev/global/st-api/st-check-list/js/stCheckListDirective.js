"use strict";
(function(){
angular.module("stapi")

.directive("stCheckList", function(stUtil) {
	return {
		templateUrl: function(element, attrs){
			
			if(attrs.type){
				
				return  "global/st-api/st-check-list/html/"+attrs.type+".html";
			}
			//Template padrão
			else{
				return "global/st-api/st-check-list/html/stCheckList.html";
			}
		},
			
		scope: {
			crudOptions: "<",
			attrLabel:"@",
			attr:"@",
			trueValue: "@",
			falseValue:"@",
			showCrudTools:"<"
			
		},
		restrict: "E",
		bindToController: true,
		controllerAs:"vm",
		controller: "stCheckListController"
	}
})
})();