"use strict";
(function(){

	angular.module("stapiApp")

	.directive("democomponentGridView", democomponentGridView)
	.directive("democomponentTableView", democomponentTableView)
	.directive("democomponentList", democomponentList)
	.directive("democomponentDetalhe", democomponentList)
	.directive("democomponentForm", democomponentForm);
	
	function democomponentDetalhe(){

		return {

			restrict:"E",
			templateUrl:"app/democomponent/html/democomponentDetalhe.html",
			controller: "democomponentDetalheCtrl",
			controllerAs:"$democomponentDetalheCtrl"

		};

	}
	
	
	function democomponentList(){

		return {

			restrict:"E",
			templateUrl:"app/democomponent/html/democomponentList.html",
			controller: "democomponentListCtrl",
			controllerAs:"$democomponentListCtrl"

		};

	}

	function democomponentGridView(){

		return {

			restrict:"E",
			templateUrl:"app/democomponent/html/democomponentGridView.html"

		};

	}

	function democomponentTableView(){

		return {

			restrict:"E",
			templateUrl:"app/democomponent/html/democomponentTableView.html"
			
		};

	}

	function democomponentForm(){

		return {

			restrict:"E",
			templateUrl:"app/democomponent/html/democomponentForm.html"
			
		};

	}

})();
