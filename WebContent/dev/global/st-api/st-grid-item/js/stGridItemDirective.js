"use strict";

(function(){

	angular.module("stapi")

	.directive('stGridItem', stGridItem)
	

	function stGridItem(){
		return {
			restrict: 'E', 
			transclude:true,
			scope:{

			  label: "@",
			  icon: "@",
			  deleteFunction: "&",
			  openDetail: "&",
			  item: "<"

			},

			templateUrl:'global/st-api/st-grid-item/html/stGridItem.html',
			bindToController: true,
			controllerAs: "$stGridItemCtrl",
			controller: function(){
				var ctrl = this;
			}
		}
	}

})();

