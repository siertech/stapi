"use strict";
(function(){

	angular.module("stapi") 

	.directive('stModalContent', stModalContent)
	.directive('modalContent', stModalContent)
	.directive('stDetalheContent', stDetalheContent)
	.directive("stModal", stModal);

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-modal-content 
	 * @restrict E
	 * @example
	 * <pre>
	 *    <st-modal-content item="vm.item" modal-instance="this" loading-ok-action="vm.salvandoItem" ok-action="vm.salvarItem"  delete-action="vm.deletarItem"icone-titulo="'list'" titulo="' Titulo  '">
	 *    </st-modal-content>
	 * </pre>
	 **/

	function stModalContent() {

		return {
			//templateUrl:'global/st-api/st-modal/template-module/modalContent.html',
			templateUrl:'global/st-api/st-modal/html/modalContent.html',
			restrict:"E",
			transclude:true,
			scope:{

				titulo: "=",
				iconeTitulo: "=",
				modalInstance: "=",
				labelCloseButton: "=",
				disableOkButton:"=",
				loadingOkAction:"=",
				okAction:"<",
				okActionLabel:"=",
				forceOkActionShowLabel:"=",//se true força a exibição do label presente no okAcion
				okActionIcon:"=",
				cancelAction:"=",
				deleteAction:"=",
				item: "="//Objeto referencia, ex: pdv

			},
			bindToController: true,
			controllerAs: "vm",
			controller: function($scope, $timeout){

				var vm = this;
				vm.callToCancelAction= function(ctrl){

					if(vm.cancelAction)
						vm.cancelAction(ctrl);

					else if(vm.modalInstance)
						vm.modalInstance.$dismiss("cancel");

				}


			}

		};
	}
	
	
	function stDetalheContent() {

		return{

			templateUrl:"global/st-api/st-modal/html/detalheContent.html",
		    transclude: true,
		    replace: true,
		    scope: {
		    	controller: "<"
		    },
		    bindToController: true,
		    controllerAs:"$stDetalheCtrl",
		    controller: function($scope){
		    	var ctrl = this;
		    	ctrl.parent = ctrl.controller;
		      
		    }
		   
		}

	}


	function stModal($filter){

		return {

			templateUrl:"global/st-api/st-modal/html/stModal.html",
			restrict:"AE",
			transclude:true,
			scope:{

				titulo:"@",
				icon:"@",
				idmodal:"@",
				size:"@",
				okIcon:"@",
				okLabel:"@"

			},

			link: function($scope, element, attrs) {

			}

		}

	}

})();
