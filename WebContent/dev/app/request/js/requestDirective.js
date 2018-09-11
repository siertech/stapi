"use strict";
(function(){

	angular.module("stapi")

	.directive("requestGridView", requestGridView)
	.directive("requestTableView", requestTableView)
	.directive("requestList", requestList)
	.directive("requestDetalhe", requestList)
	.directive("requestForm", requestForm);
	
	function requestDetalhe(){

		return {

			restrict:"E",
			templateUrl:"app/request/html/requestDetalhe.html",
			controller: "requestDetalheCtrl",
			controllerAs:"$requestDetalheCtrl"

		};

	}
	
	function requestList(){

		return {

			restrict:"E",
			templateUrl:"app/request/html/requestList.html",
			controller: "requestListCtrl",
			controllerAs:"$requestListCtrl"

		};

	}

	function requestGridView(){

		return {

			restrict:"E",
			templateUrl:"app/request/html/requestGridView.html"

		};

	}

	function requestTableView(){

		return {

			restrict:"E",
			templateUrl:"app/request/html/requestTableView.html"
			
		};

	}

	function requestForm(){

		return {

			restrict:"E",
			templateUrl:"app/request/html/requestForm.html"
			
		};

	}

})();
