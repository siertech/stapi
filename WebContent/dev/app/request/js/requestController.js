"use strict";
(function(){

	angular.module("stapi")
	.controller("requestDetalheCtrl", requestDetalheCtrl)
	.controller("requestListCtrl", requestListCtrl);

	var objectName = "Request";

	function requestDetalheCtrl($scope, $controller, item, functionToDetailNotify, objectName, stUtil, stService, $http){
        
		item = item || {};
		item.urlBase =item.urlBase || stService.getBaseUrl();
		
		var ctrl = this;
		angular.extend(ctrl, $controller('genericDetalheController', {
			$scope: $scope,
			functionToDetailNotify: functionToDetailNotify,
			objectName: objectName,
			item: item
		}));
		
		ctrl.executar = function(request){
			
			var url = request.urlBase + request.url;
			
			var req = {
					 method: request.tipo,
					 url: url,
					 headers: {
					   'Content-Type': "application/json"
					 },
					 data: angular.fromJson(request.body)
					}
			
	
				
				$http(req).then(function(data){
					
					ctrl.data.response = data;
					
				});
			
			
		}
	
	
	}

	function requestListCtrl($scope, $controller, config, stCrudTools, stUtil, $route){

		var ctrl = this;
		
		angular.extend(ctrl, $controller('genericListController', {
			$scope: $scope,
			objectName: objectName,
			detalheTemplateUrl:"app/request/html/requestDetalhe.html",
			detalheController: "requestDetalheCtrl",
			detalheControllerAs: "$requestDetalheCtrl",
			filtros:  [ 
				{attr:'descricao', label: 'Descrição'}

				]
		}));
		
		ctrl.data.tableColumns = [
			
			{label: "Descrição", attr: "descricao", orderBy: true, labelIcon: "list"}
			
		];
		
		ctrl.data.orderBy = "descricao";
		
		//Objeto que define as opções para listagem dos itens
		ctrl.data.requestListParams = {	
				objectName: objectName,
				maxItensPerPage: config.confs.maxItemsPerPage || 9,

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
