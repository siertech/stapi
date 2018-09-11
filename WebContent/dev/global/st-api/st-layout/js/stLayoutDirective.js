"use strict";
(function(){

	angular.module("stapi") 
	.directive('stVerticalSpace', stVerticalSpace)
	.directive("stPanel", stPanel)
	.directive("panel", stPanel)
	.directive("stToolbar", stToolbar)
	
	
	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-toolbar
	 * @restrict E
	 **/
	function stToolbar(){

		return{
			restrict:"E",
			transclude: true,
			templateUrl:"global/st-api/st-layout/html/stToolbar.html"
			
		}
	}

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-vertical-space
	 * @restrict E
	 * @description adicionar uma margen  vertical padrão de 15px
	 **/
	function stVerticalSpace(){

		return{
			restrict:"E",
			replace:true,
			template:'<div class="row col-lg-12"><div style="margin: 15px;"></div></div>'
		}
	}

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-panel
	 * @restrict E
	 * @example
	 **/
	function stPanel(){

		return{

			restrict:"E",
			transclude: true,
			template: '<div class="panel"><div class="panel-body"></div></div>',
			link: function(scope, element, attrs, ctrl, transclude) {

				transclude(scope, function(clone) {
					
					element.children(0).children(0).append(clone);
				
				});
			}

		}
	}

})();
