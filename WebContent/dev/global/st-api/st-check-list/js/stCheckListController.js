"use strict";
(function(){
	angular.module("stapi")

	.controller("stCheckListController", function($scope, stUtil, $filter, stService,  $mdDialog){

		var ctrl  = this;
		ctrl.scope = $scope;
		init();

		$scope.$watch("vm.objetos", function(newValue, oldValue){

			if(newValue.length> oldValue.length){

				for (var i = 0; i < newValue.length; i++) {

					if (angular.equals(newValue[i], oldValue[i])) continue;

					var changedItem = newValue[i];

					if(hasFixProperties(changedItem)==false){

						changedItem =  setFixProperties(changedItem);

						stService.save(ctrl.crudOptions.objectName,changedItem).then(function(data){
							

						});
					}

				}
			}


		}, true);


		function hasFixProperties(ob){
			ob = angular.copy(ob);
			var  fixProperties = ctrl.crudOptions.fixProperties;
			var has = true;
			for(var key in fixProperties){

				if(ob[key] ==  fixProperties[key]){

				}
				else{
					has = false;
					continue;
				}


			}

			return has;

		}

		function reorderItems(){
			var objectName = ctrl.crudOptions.objectName;
			var lista = ctrl.objetos;

			var obj = {};
			obj.objectName = objectName;
			obj.items = [];
			for(var i in lista){
				lista[i].orderIndex = i+"";
				obj.items.push({"id": lista[i].id, "orderIndex": i+""});
			}
			stService.executePost("/reorder-items/", obj);
		}


		ctrl.deleteAll = function(){

			var ids = [];
			ctrl.objetos.filter(function(item){
				ids.push(item.id);
			});

			stService.delete(ctrl.crudOptions.objectName, ids).then(function(){
				stUtil.showMessage("","Itens deletados com sucesso!");
				init();
			});
		}
		ctrl.dragEnd= function () {

			reorderItems();

		}

		ctrl.changeChecked = function(item){

			stService.changeAttrValue(ctrl.crudOptions.objectName, item.id, ctrl.attr, item[ctrl.attr]);

		}


		
		
		ctrl.editItem = function ($event, item, index) {
			
			
			
			
			$mdDialog.show({
				controllerAs: "$clienteDetalheCtrl",
				controller: "clienteDetalheCtrl",
				resolve:{
					item: function(){return  item},
					objectName: function(){ return "Cliente"},
					functionToDetailNotify: function(){
						
						console.log("Chamou functionToDetailNotify no editItem");
					}

				},
				templateUrl: "app/cliente/html/clienteDetalhe.html",

				parent: parent || angular.element(document.body),
				clickOutsideToClose: false,
				
			})
			.then(function(res) {

			}, function() {


			});
		}
		
		/*
		ctrl.editItem = function ($event, item, index) {
			var initalValue =  stUtil.getValue(item, ctrl.attrLabel);
			var confirm = $mdDialog.prompt()
			.title('')
			.textContent("")
			.placeholder("")
			.ariaLabel("")
			.initialValue(initalValue)
			.targetEvent($event)
			.required(true)
			.multiple(true)
			.ok('OK')
			.cancel('Cancelar');

			$mdDialog.show(confirm).then(function(value) {

				stUtil.setValueOfNivel(item, ctrl.attrLabel, value);

				stService.changeAttrValue(ctrl.crudOptions.objectName, item.id, ctrl.attrLabel, value);

			}, function() {

			});

		};
		
		*/

		ctrl.addItem = function(labelValue){

			var ob = stUtil.setValueOfNivel({}, ctrl.attrLabel, labelValue);
			var orderBy = ctrl.orderBy || "orderIndex";
			ob[orderBy] = getNextOrderIndex();

			ctrl.newItem = "";

			ob = setFixProperties(ob);

			stService.save(ctrl.crudOptions.objectName, ob).then(function(data){
				ctrl.objetos.push(data.item);

			});


		}

		function setFixProperties(ob){

			//Incluir as propriedades fixas no objeto
			var fixProperties =ctrl.crudOptions.fixProperties;
			if(fixProperties){
				for(var key in fixProperties){
					ob[key] =  fixProperties[key];
					stUtil.setValueOfNivel(ob, key, fixProperties[key]);

				}
			}

			return ob;

		}

		ctrl.openDetail = function(item){

			if(ctrl.crudOptions && ctrl.crudOptions.openDetail)
				ctrl.crudOptions.openDetail(item);

		}

		ctrl.openMenu = function($event, $mdMenu){

			$event.stopPropagation();
			$mdMenu.open();
		}

		ctrl.deleteFunction = function(item, index){

			ctrl.objetos.splice(index, 1);
			reorderItems();
			stService.delete(ctrl.crudOptions.objectName, [item.id]);

		}

		function getNextOrderIndex(){

			if(ctrl.objetos.length==0)
				return 0;

			return ctrl.objetos.length;

		}

		//Inicialização do controller
		function init(){

			ctrl.trueValue = ctrl.trueValue || "'true'";
			ctrl.falseValue = ctrl.falseValue || "'false'";

			if(ctrl.crudOptions){

				var qs = [];
				qs = qs.concat(stUtil.transformJSONToSqlComparators(ctrl.crudOptions.fixProperties));

				//Recupera a lista de objetos
				stService.getList({

					objectName: ctrl.crudOptions.objectName,
					querys: qs
				}).then(function(data){

					ctrl.objetos  = data.itens || [];
					//Reseolve a ordem inicial dos itens
					resolveInitialOrderForObs(ctrl.objetos);


				});


			}else {

				ctrl.objetos = ctrl.objetos || [];

				//Reseolve a ordem inicial dos itens
				resolveInitialOrderForObs(ctrl.objetos);

			}

		}

		function resolveInitialOrderForObs(obs){

			var orderBy = ctrl.orderBy || "orderIndex";

			for(var i in obs){

				var order = obs[i][orderBy ];

				if(order!=0 && !order)
					order = i;

				obs[i][orderBy] = order;

			}

			obs.sort(function(a, b){

				return a[orderBy] - b[orderBy];

			});

			return obs;
		}

	})
})();
