"use strict";

(function(){

	angular.module("stapi")
	.factory("stCrudTools", stCrudToolsUtils)
	.factory("stCrudToolsUtils", stCrudToolsUtils)

	function stCrudToolsUtils(stService, $q, $mdMedia,  $mdDialog){

		var CANCEL = "CANCEL";
		var SAVE_SUCCESS = "SAVE_SUCCESS";
		var SAVE_ERROR = "SAVE_ERROR";

		var DELETE_SUCCESS = "DELETE_SUCCESS";
		var DELETE_ERROR = "DELETE_ERROR";

		var _cancelAndNotify = function(functionToNotify){

			var objNotify = {};
			objNotify.event = CANCEL;
			functionToNotify(objNotify);
		}

		/*
		 * options: {
                objectName:,
                item,
                $mdDialog,
                functionToNotify
           }
		 */
		var _saveAndNotify = function(options){

			var deferred = $q.defer();
			var objNotify = {};
			objNotify.$mdDialog = $mdDialog;
			objNotify.itemAnt = angular.copy(options.item);
			
			stService.save(options.objectName, options.item).then(function onSucess(response){

				objNotify.response = response;
				objNotify.item = response.item;
				objNotify.event = SAVE_SUCCESS;
				options.functionToNotify(objNotify);
				deferred.resolve(response);

			}, function onError(response){

				objNotify.event = SAVE_ERROR;
				objNotify.response = response;
				options.functionToNotify(objNotify);
				deferred.reject(response);
			});

			return deferred.promise;

		}
		
		/*
		 * options: {
                objectName:,
                item,
                $mdDialog,
                functionToNotify
           }
		 */

		var _deleteAndNotify = function(options){

			var deferred = $q.defer();
			var objNotify = {};
			objNotify.$mdDialog = options.$mdDialog;
			objNotify.item = options.item;
			stService.delete(options.objectName, [options.item.id]).then(function onSucess(response){

				objNotify.response = response;
				objNotify.event = DELETE_SUCCESS;
				options.functionToNotify(objNotify);
				deferred.resolve(response);

			}, function onError(response){

				objNotify.event = DELETE_ERROR;
				objNotify.response = response;
				options.functionToNotify(objNotify);
				deferred.reject(response);
			});

			return deferred.promise;

		}

		return{
			saveAndNotify: _saveAndNotify,
			deleteAndNotify: _deleteAndNotify,
			cancelAndNotify: _cancelAndNotify,
			CANCEL: CANCEL,
			SAVE_SUCCESS: SAVE_SUCCESS,
			SAVE_ERROR: SAVE_ERROR,
			DELETE_SUCCESS: DELETE_SUCCESS,
			DELETE_ERROR: DELETE_ERROR
		}
	}

})();

