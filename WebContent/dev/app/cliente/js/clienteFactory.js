"use strict";
(function(){

	angular.module("stapiApp")

	.factory("clienteUtil", clienteUtil);

	function clienteUtil(){

		_getControllerOptions = function(){
			return{
				detalheController: "clienteDetalheCtrl",
				listController: "clienteListCtrl",
				detalheTemplateUrl:"app/cliente/html/clienteDetalhe.html",
				listTemplateUrl:"app/cliente/html/clienteDetalhe.html",
				detalheControllerAs: "$clienteDetalheCtrl",
			}
		}
		
		return: {
			
			
		}

	}

})();
