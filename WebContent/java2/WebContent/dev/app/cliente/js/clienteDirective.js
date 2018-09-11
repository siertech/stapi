"use strict";
(function(){

	angular.module("stapiApp")

	.directive("clienteGridView", clienteGridView)
	.directive("clienteTableView", clienteTableView)
	.directive("clienteList", clienteList)
	.directive("clienteDetalhe", clienteList)
	.directive("clienteForm", clienteForm);
	
	function clienteDetalhe(){

		return {

			restrict:"E",
			templateUrl:"app/cliente/html/clienteDetalhe.html",
			controller: "clienteDetalheCtrl",
			controllerAs:"$clienteDetalheCtrl"

		};

	}
	
	function clienteList(){

		return {

			restrict:"E",
			templateUrl:"app/cliente/html/clienteList.html",
			controller: "clienteListCtrl",
			controllerAs:"$clienteListCtrl"

		};

	}

	function clienteGridView(){

		return {

			restrict:"E",
			templateUrl:"app/cliente/html/clienteGridView.html"

		};

	}

	function clienteTableView(){

		return {

			restrict:"E",
			templateUrl:"app/cliente/html/clienteTableView.html"
			
		};

	}

	function clienteForm(){

		return {

			restrict:"E",
			templateUrl:"app/cliente/html/clienteForm.html"
			
		};

	}

})();
