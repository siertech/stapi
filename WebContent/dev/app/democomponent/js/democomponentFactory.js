"use strict";
(function(){

	angular.module("stapiApp")

	.factory("democomponentUtil", democomponentUtil);

	function democomponentUtil($mdDialogstService, $q, $mdDialog, $mdMedia, stCrudToolsUtils){


		var _deletar = function(_item, callback){

			stService.delete("democomponent", [_item.id]).then(function(){

				callback(_item);

			}).catch(function(){

				callback();
			});

		}

		var _mostrarDetalhe = function(item, functionToNotify){

			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
		    $mdDialog.show({
		    	controllerAs:"$detalheCtrl",
				controller:"democomponentDetalheCtrl",
				resolve:{
					item: function(){return item},
                    
					functionToNotify: function(){ return functionToNotify},
					deferred: function(){
						return {};
					}
				},
		      templateUrl: 'app/democomponent/html/democomponentDetalhe.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		      fullscreen: useFullScreen
		    })
		    .then(function(res) {
		    
		    	console.log("res: ");
		    	console.log(res);
		    }, function() {
		      
		    	console.log("Cancelou!");
		    	stCrudToolsUtils.cancelAndNotify(functionToNotify);
		    
		    });
			
			
			/*
			var deferred = $q.defer();
			
			var modal = $mdDialog.show({
				animation: true,
				templateUrl:"app/democomponent/html/democomponentDetalhe.html",
				size:'lg',
				controllerAs:"$democomponentDetalheCtrl",
				controller:"democomponentDetalheCtrl",
				resolve:{
					item: function(){return item},
                    
					functionToNotify: function(){ return functionToNotify},
					deferred: function(){
						return deferred;
					}
				}
			});
			
			*/
			
		

		}

		return {

			deletar: _deletar,
			mostrarDetalhe: _mostrarDetalhe

		};

	}

})();
