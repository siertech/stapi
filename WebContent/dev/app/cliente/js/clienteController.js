"use strict";
(function(){

	angular.module("stapiApp")
	.controller("clienteDetalheCtrl", clienteDetalheCtrl)
	.controller("clienteListCtrl", clienteListCtrl);

	var objectName = "Cliente";

	function clienteDetalheCtrl($scope, $controller, item, functionToDetailNotify, objectName, stUtil){

		var ctrl = this;
		angular.extend(ctrl, $controller('genericDetalheController', {
			$scope: $scope,
			functionToDetailNotify: functionToDetailNotify,
			objectName: objectName,
			item: item
		}));
	
	}

	function clienteListCtrl($scope, $controller, config, stCrudTools, stUtil, $route){

		var ctrl = this;
		
		angular.extend(ctrl, $controller('genericListControl', {
			$scope: $scope,
			options: {
				objectName: objectName,
				detalheTemplateUrl:"app/cliente/html/clienteDetalhe.html",
				detalheController: "clienteDetalheCtrl",
				detalheControllerAs: "$clienteDetalheCtrl",
				fixProperties: ctrl.fixProperties || {}
			},
			filtros:  [ 
				{attr:'principalAttr', label: ' Buscar pelo principalAttr '}

				]
		}));
		
		ctrl.data.tableColumns = [
			
			{label: "principalLabel", attr: "principalAttr", orderBy: true, labelIcon: "principalIcon"}
			
		];
	
		ctrl.data.orderBy = "principalAttr";
		
		//Objeto que define as opções para listagem dos itens
		ctrl.data.requestListParams = {	
				objectName: objectName,
				maxItensPerPage: config.confs.maxItemsPerPage || 9

		}
		
		//Override
		/*
		ctrl.data.saveSuccesResolve = saveSuccessResolve;
		ctrl.data.cancelResolve = cancelResolve;
		
		function saveSuccessResolve(obj){
			stUtil.showMessage("","Salvo com sucesso!");
			obj.$mdDialog.hide();
			$route.reload();
		}
		
		function cancelResolve(){
			
		}
		*/

		//Inicializa a lista de objetos
		ctrl.data.getList();

	}

})();
