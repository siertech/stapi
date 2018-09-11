"use strict";
(function(){

	angular.module("stapi")

	.directive("stStringCheck", stInputChip)

	function stInputChip(stUtil){

		return {

			restrict:"E",
			templateUrl: 'global/st-api/st-string-check/html/stStringCheck.html',
			controllerAs: "ctrl",
			bindToController: true,
			scope: {
				ngModel:"=",
				items: "<",
				titulo: "@"
			},
			controller: function($scope){

				var ctrl = this;
				ctrl.selected = ctrl.ngModel?   ctrl.ngModel.split(",") : [];
			
				
				$scope.$watch("ctrl.selected", function(value){

					ctrl.ngModel = value.join();
				}, true);
				
				ctrl.toggle = function (item, list) {
					
					var idx = stUtil.buscaOb(list, item, "attr");
					if (idx > -1) {
						list.splice(idx, 1);
					}
					else {
						list.push(item);
					}
				};

				ctrl.exists = function (item, list) {
					return stUtil.buscaOb(list, item, "attr") > -1;
				};

				ctrl.isIndeterminate = function() {
					return (ctrl.selected.length !== 0 &&
							ctrl.selected.length !== ctrl.items.length);
				};

				ctrl.isChecked = function() {
					return ctrl.selected.length === ctrl.items.length;
				};

				ctrl.toggleAll = function() {
					if (ctrl.selected.length === ctrl.items.length) {
						ctrl.selected = [];
					} else if (ctrl.selected.length === 0 || ctrl.selected.length > 0) {
						var array =  ctrl.items.slice(0);
						var arrayInt = [];
						for(var i in array){

							arrayInt.push(array[i].attr);
						}
						ctrl.selected  =arrayInt;
					}
				};

			}
		}

	}


})();
