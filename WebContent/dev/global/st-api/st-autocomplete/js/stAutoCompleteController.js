"use strict";
(function(){

	angular.module("stapi") 

	.controller('stAutoCompleteController', stAutoCompleteController)

	function stAutoCompleteController($scope, $element, stService, stUtil, $mdDialog, $timeout ,cacheGet, genericUtil, $log, $mdMedia, $rootScope){

		var $modalInstance;
		var ngModelCtrl = $element.controller('ngModel');

		var ctrl = this;
		ctrl.scope = $scope;
		ctrl.parent     = $scope.$parent;

		//Funções do escopo
		ctrl.buscarItem = buscarItem;
		ctrl.openBusca = openBusca;
		ctrl.fecharDialog  = fecharDialog;
		ctrl.getValueOfNivel = getValueOfNivel;
		ctrl.cadastrarItem = cadastrarItem;
		ctrl.selecionarItem = selecionarItem;
		ctrl.loadingIsVisible = loadingIsVisible;

		if(!ctrl.objectName){
			$log.error("O parâmetro object-name deve ser informado");
			return;
		}

		function fecharDialog(){

			$mdDialog.hide();
		}
		
		function loadingIsVisible(){
			
			return ctrl.loading;
		}

		function openBusca (parentElement){

			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
			$mdDialog.show({
				templateUrl:"global/st-api/st-autocomplete/html/buscaStAutoComplete.html",
				scope: $scope.$new(),
				controller: function($scope){

					//Busca Inicial
					if(ctrl.initialBusca !=undefined ){

						ctrl.buscarItem(ctrl.initialBusca );
					}
				},
				parent: parentElement || angular.element(document.body),
				clickOutsideToClose: false,
				multiple: true,
				fullscreen: useFullScreen

			});

		}

		//Busca de itens
		function buscarItem(valueattr){

			valueattr = valueattr||'';

			//Sem Cache (Busca remota)	
			//!ctrl.useCache || ctrl.useCache==false
			if(!ctrl.useCache || ctrl.useCache==false)	{

				var query = ctrl.attr+" like '%"+valueattr+"%'";
				var qs = [];

				//Adiciona querys das propriedades fixas
				qs = qs.concat(stUtil.transformJSONToSqlComparators(ctrl.fixProperties));
				qs.push(query);
				var objeto = ctrl.objectName;
				objeto = objeto[0].toUpperCase() + objeto.slice(1);
				var subattr="";
				if(ctrl.subattr){

					subattr =","+ctrl.subattr.attr;
				}

				var columnsToQuery="";

				if(genericUtil.isGenericQuery(ctrl.attr)){

					columnsToQuery="";
				}
				else{
					columnsToQuery = "id,"+ctrl.attr+subattr||"*";
				}

				var ops = {
						qs : qs,	
						columns:columnsToQuery,
						groupBy:"id",
						objeto:objeto
				};

				ctrl.loading=true;

				stService.getProjecoes(ops).then(function(data){
					ctrl.loading=false;
					ctrl.obs = data.itens;

				}).catch(function(){
					ctrl.loading=false;
					ctrl.messageResult="Ocorreu um erro, tente novamente.";
				});
			} 

			//Busca em cache
			else{

				var ini = new Date();
				var itens = cacheGet.get(ctrl.objectName.toLowerCase(), ctrl.attr, valueattr);

				itens = jlinq.from(itens)
				.starts(ctrl.attr, valueattr)
				.select();
				var its = [];
				for(var i in itens){

					its.push([itens[i].id,itens[i][ctrl.attr]]);
				}
				ctrl.obs = its;
			}
		}

		function getValueOfNivel(item, attr){

			return stUtil.getValueOfNivel(item, attr);
		}

		function cadastrarItem(value, allFilials){

			var attr = ctrl.attr;
			var fix = ctrl.fixProperties;
			ctrl.loading = true;
			var ob = {};
			stUtil.setValueOfNivel(ob, attr, value);

			//Atributos pre-definidos
			for(var k in fix){
				ob[k] = fix[k];	
			}

			//auxItemFilial
			ob["allFilials"] = allFilials;

			var query = attr+" = '"+stUtil.getValueOfNivel(ob, attr)+"'";
			var qs = [];
			qs.push(query);

			//Propriedades fixas
			qs = qs.concat(stUtil.transformJSONToSqlComparators(ctrl.fixProperties));

			stService.getLikeMap(ctrl.objectName.toLowerCase(), qs ,0, 0, "").then(function(data){

				if(data.itens.length>0){
					stUtil.showMessage("","Já existe um registro com '"+stUtil.getValueOfNivel(ob, attr)+"' cadastrado no sistema","danger");
					ctrl.loading = false;
					return;
				}
				else {

					stService.save(ctrl.objectName.toLowerCase(), ob).then(function(data){

						cacheGet.add(ctrl.objectName.toLowerCase(), [data.item]);
						var objeto=[data.item.id, stUtil.getValueOfNivel(data.item, attr)];
						ctrl.selecionarItem(objeto);
						value="";
						ctrl.loading = false;
						stUtil.showMessage("","'"+stUtil.getValueOfNivel(ob, attr)+"' cadastrado com sucesso!","info");
						$mdDialog.hide();
					}).catch(function(){

						stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet.","danger");
						ctrl.loading = false;
						$mdDialog.hide();
					});
				}

			}).catch(function(){

				stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet.","danger");
				ctrl.loading = false;
			});

		}

		function selecionarItem (item){

			ctrl.labelValue="";

			if(ctrl.getCompleteObject==true || genericUtil.isGenericQuery(ctrl.attr)){
				
				ctrl.loading = true;
				stService.getById(ctrl.objectName.toLowerCase(),item[0] || item.id).then(function(data){

					ctrl.loading = false;
					data.item[ctrl.attr] = item[1] || stUtil.getValueOfNivel(item, ctrl.attr);
					setValueItem(data.item);
					$mdDialog.hide();
				}).catch(function(){
					ctrl.loading = false;
				});
			}
			else{
				var ob = {};
				ob.id = item[0] || item.id;
				ob[ctrl.attr] = item[1] || stUtil.getValueOfNivel(item, ctrl.attr);
				setValueItem(ob);
				$mdDialog.hide();

			}

		}

		function setValueItem(objetoSele){

			var viewValue;
			//Valor simples
			if(ctrl.valueOnly==true){
				viewValue = objetoSele[ctrl.attr];	
				ctrl.showValue =  objetoSele[ctrl.attr];
			}

			//Objeto com atributos genéricos
			else if(genericUtil.isGenericQuery(ctrl.attr)){

				viewValue = objetoSele;
				ctrl.showValue = stUtil.getValueOfNivel(objetoSele, ctrl.attr);

			}

			//Objeto composto
			else{
				viewValue = objetoSele;
				ctrl.showValue =  objetoSele[ctrl.attr];
			}

			ngModelCtrl.$setViewValue(viewValue);
			ctrl.attrValue = objetoSele[ctrl.attr];
			ctrl.obs =null;

		}

	

		function init(){

			if(!ctrl.ngModel)
				return;

			if(ctrl.valueOnly!=true){
				setValueItem(ctrl.ngModel);
				ctrl.definidoNoInit = ctrl.ngModel;
			}
			else{

				ctrl.showValue = ctrl.ngModel;
			}

			ctrl.placeHolderBusca = ctrl.placeHolderBusca ||'Digite um termo para buscar';
			var lastKeyUp = 0;

			if(ctrl.autoShowBusca==true)
				ctrl.openBusca();
		}

		init();
	}
})();
