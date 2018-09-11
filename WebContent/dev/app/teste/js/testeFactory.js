"use strict";
(function(){

	angular.module("stapiApp")

	.factory("testeUtil",function($mdDialog){
		
           
		var _openItem = function(item, callback){
			
			$mdDialog.show({
				animation: true,
				backdrop: 'static',

				templateUrl:"app/teste/html/detalhe.html",
				size:'lg',
				controllerAs:"vm",
				controller:"detalhetesteController",
				resolve:{
					item: function(){return item},
					
					callback: function(){ return callback}
				}
			});
			
		}

		return {
			openItem :_openItem
		
		};

	})

})();
