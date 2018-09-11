"use strict";
(function(){

	angular.module("stapiApp")
	.controller("democomponentDetalheCtrl", democomponentDetalheCtrl)
	.controller("democomponentListCtrl", democomponentListCtrl);

	var objectName = "DemoComponent";

	function democomponentDetalheCtrl($scope, $controller, item, functionToDetailNotify, objectName, stUtil){

		var ctrl = this;
		
		
		angular.extend(ctrl, $controller('genericDetalheController', {
			$scope: $scope,
			functionToDetailNotify: functionToDetailNotify,
			objectName: objectName,
			item: item
		}));
	
	
	}

	function democomponentListCtrl($scope, $controller, config, stCrudTools, stUtil, $route){

		var ctrl = this;
		
	
		
		angular.extend(ctrl, $controller('genericListController', {
			$scope: $scope,
			objectName: objectName,
			detalheTemplateUrl:"app/democomponent/html/democomponentDetalhe.html",
			detalheController: "democomponentDetalheCtrl",
			detalheControllerAs: "$democomponentDetalheCtrl",
			filtros:  [ 
				{attr:'_string.nome', label: 'Buscar pelo nome do democomponent'},
				{attr:'id', operator: '=', label: 'Buscar pelo id'}

				]
		}));
		
		ctrl.data.orderBy = "_string.nome";
		
		//Objeto que define as opções para listagem dos itens
		ctrl.data.requestListParams = {	
				objectName: objectName,
				maxItensPerPage: config.maxItensPerPage || 50

		}
		
		//Override
		ctrl.data.saveSuccesResolve = saveSuccessResolve;
		ctrl.data.cancelResolve = cancelResolve;
		
		function saveSuccessResolve(obj){
			stUtil.showMessage("","O objeto foi salvo com sucesso no override!");
			obj.$mdDialog.hide();
			$route.reload();
		}
		
		function cancelResolve(){
			stUtil.showMessage("","Fechado pelo usuário");
		}

		//Inicializa a lista de objetos
		ctrl.data.getList();

	}

})();
