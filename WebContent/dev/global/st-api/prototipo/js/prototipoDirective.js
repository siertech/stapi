"use strict";
(function(){

	angular.module("stapi")

	.directive("prototipoGridView", prototipoGridView)
	.directive("prototipoTableView", prototipoTableView)
	.directive("prototipoList", prototipoList)
	.directive("prototipoDetalhe", prototipoList)
	.directive("prototipoForm", prototipoForm);
	
	function prototipoDetalhe(){

		return {

			restrict:"E",
			templateUrl:"global/st-api/prototipo/html/prototipoDetalhe.html",
			controller: "prototipoDetalheCtrl",
			controllerAs:"$prototipoDetalheCtrl"

		};

	}
	
	function prototipoList(){

		return {

			restrict:"E",
			templateUrl:"global/st-api/prototipo/html/prototipoList.html",
			controller: "prototipoListCtrl",
			controllerAs:"$prototipoListCtrl"

		};

	}

	function prototipoGridView(){

		return {

			restrict:"E",
			templateUrl:"global/st-api/prototipo/html/prototipoGridView.html"

		};

	}

	function prototipoTableView(){

		return {

			restrict:"E",
			templateUrl:"global/st-api/prototipo/html/prototipoTableView.html"
			
		};

	}

	function prototipoForm(){

		return {

			restrict:"E",
			templateUrl:"global/st-api/prototipo/html/prototipoForm.html"
			
		};

	}

})();
