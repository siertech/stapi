"use strict";
(function(){

	angular.module("stapi") 

	.controller("stFilterController", stFilterController)

	.controller("stFilterPaginationController", stFilterPaginationController)

	function stFilterPaginationController($scope, config, $anchorScroll,  $location){

		var vm = this;
		vm.scope = $scope;

		vm.setPagina = function(pagina){

			$location.hash('top');
			$anchorScroll();
			vm.queryOptions.pagina = pagina;
			vm.getList(vm.queryOptions);

		}
	}

	function stFilterController($scope){

		var vm = this;
		vm.scope = $scope;

		vm.openMenuFiltros = function($mdMenu, ev){

			$mdMenu.open(ev);
		}

		vm.executarBusca = function(){

			var query = getQueryFromFilter(vm.filtroAtivo);
			vm.queryOptions.querys = [query]; 

			//Garante que a busca comece na primeira página
			vm.queryOptions.pagina = 0;

			//Excuta a função de busca bindada ao componente
			vm.getList(vm.queryOptions);
		}


		//Altera o filtro ativo
		vm.changeFiltroAtivo = function(filtro){

			vm.filtroAtivo = filtro;

		}

		function getQueryFromFilter(filtro){

			var queryValue = filtro.value;
			var query  = "";

			if(filtro.value.length>0){

				//Definie like como operador padrão caso não seja definido
				filtro.operator  = filtro.operator || "like";
				var operator =  filtro.operator;

				//Adiciona aspas na query caso o operador seja do tipo like
				if(operator === "like"){
					queryValue = "'%"+queryValue+"%'";
				}

				query = filtro.attr +" "+  operator + " " + queryValue+" ";

			}
			return query;
		}

		function init(){

			vm.filtroAtivo = vm.filtros[0];
		}
		init();
	}

})();
