"use strict";

(function(){

	angular.module("stapi")
	.directive('stTable', stTable)
	
	function stTable(){
		return {
			restrict: 'E', 
			transclude:true,
			scope:{

			columns :"<",
			items: "<",
			openDetail: "<",
			deleteFunction: "<",
			editColumn: "<",
			selectedItems: "="

			},

			templateUrl:'global/st-api/st-table/html/stTable.html',
			bindToController: true,
			controllerAs: "$stTableCtrl",
			controller: function($scope, stUtil, $filter){
				var ctrl = this;
				ctrl.scope = $scope;
				ctrl.getColumnValue = getColumnValue;
				
				function getColumnValue(ob, attr, filter){
					
					var value =  stUtil.getValueOfNivel(ob, attr);
					
					if(filter && filter.length>0){
						
						var parts = filter.split(":");
						
						value = $filter(parts[0])(value, parts[1]);
					}
					
					return value;
					
				}
			}
		}
	}

})();

