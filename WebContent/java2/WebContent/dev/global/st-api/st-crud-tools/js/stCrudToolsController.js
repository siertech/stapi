"use strict";

(function(){

	angular.module("stapi")
	.controller("stDetalheCtrl", stDetalheController)

	function stDetalheController($scope, objectName, item, controllerAs, functionToNotify, stCrudToolsUtils, $mdDialog){

		var ctrl = this;
        $scope.controllerAs = controllerAs; 
        ctrl.tarefas = [
        	{titulo: "Titulo da tarefa", ok: 'true'}
        ];
		ctrl.cancelFunction = cancelFunction;
		ctrl.deleteFunction = deleteFunction;
		ctrl.saveFunction  = saveFunction;

		function cancelFunction (ctrl){

			$mdDialog.cancel();
		}

		function saveFunction (item){
			
			console.log("item a ser salvo: ");
			console.log(item);

			ctrl.savingItem = true;

			stCrudToolsUtils.saveAndNotify(objectName, item, $mdDialog , functionToNotify).then(function(obj){

				ctrl.savingItem= false;

			}).catch(function(){

				ctrl.salvandoItem = false;
			});


		}

		function deleteFunction(item){

			ctrl.deletingItem= true;

			stCrudToolsUtils.deleteAndNotify(objectName, item, $mdDialog , functionToNotify).then(function(obj){

				$mdDialog.hide();  
				ctrl.deletingItem= false;

			}).catch(function(){

				ctrl.deletingItem= false;
			});


		}

		function getBasicCallbackObj(){

			var obj = {};
			obj.modal = $mdDialogInstance;
			return obj;
		}

		function init(){
			ctrl.item = item || {};
			ctrl.salvandoItem  =  false;
		}
		init();

	}

})();

