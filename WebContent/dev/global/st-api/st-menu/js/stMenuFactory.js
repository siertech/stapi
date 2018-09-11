"use strict";
(function(){

	angular.module("stapi") 

	.factory('stMenuUtil', function($rootScope,$filter, stUtil, $location){


		var _changePath = function(path){

			var item;
			
			var menuItems =  $rootScope.menuItems;

			if(typeof path=='string'){
				path = path.replace("/","");
				var indexItem = stUtil.buscaOb(menuItems, path,"path");
				item = menuItems[indexItem] || {};
			}
			else{
				item = path;
			}
			$rootScope.currentPathIcon= item.icon;
			$rootScope.currentPathLabel = item.label;
			$rootScope.currentPath = item.path;
			document.title = item.label || '';

			//Histórico de navegação
			$rootScope.routeHistory = 	$rootScope.routeHistory || [];
			var routeHistory =   $rootScope.routeHistory;

			//Retira do histórico caso o item seja repetido
			var indexHistory = stUtil.buscaOb(routeHistory, item.label, "label");

			if(indexHistory!=-1){

				routeHistory.splice(indexHistory,1);
			}

			$rootScope.routeHistory.push(item);
			$location.path(item.path);

		}


		var _startOnboard = function(scope){


		}		

		return {

			startOnboard: _startOnboard,
			changePath: _changePath

		}

	})

})();
