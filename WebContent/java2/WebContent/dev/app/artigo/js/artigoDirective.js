"use strict";
(function(){

	angular.module("stapiApp")

	.directive("artigoGridView", artigoGridView)
	.directive("artigoTableView", artigoTableView)
	.directive("artigoList", artigoList)
	.directive("artigoDetalhe", artigoList)
	.directive("artigoForm", artigoForm);
	
	function artigoDetalhe(){

		return {

			restrict:"E",
			templateUrl:"app/artigo/html/artigoDetalhe.html",
			controller: "artigoDetalheCtrl",
			controllerAs:"$artigoDetalheCtrl"

		};

	}
	
	function artigoList(){

		return {

			restrict:"E",
			templateUrl:"app/artigo/html/artigoList.html",
			controller: "artigoListCtrl",
			controllerAs:"$artigoListCtrl"

		};

	}

	function artigoGridView(){

		return {

			restrict:"E",
			templateUrl:"app/artigo/html/artigoGridView.html"

		};

	}

	function artigoTableView(){

		return {

			restrict:"E",
			templateUrl:"app/artigo/html/artigoTableView.html"
			
		};

	}

	function artigoForm(){

		return {

			restrict:"E",
			templateUrl:"app/artigo/html/artigoForm.html"
			
		};

	}

})();
