"use strict";
(function(){

	angular.module("stapi")

	.factory("genericUtil", stInputUtil)
	.factory("stInputUtil", stInputUtil);

	/**
	 * @ngdoc service
	 * @name stapi.stInputUtil
	 * @description 
	 */

	function stInputUtil($http, config, $cookieStore){

		/**
		 * @ngdoc method
		 * @methodOf stapi.genericUtil
		 * @name transformGenericQuerys
		 * @param {String[]}  Array de querys a serem transformada
		 * @description Transforma querys que contem tipos genéricos para o tipo aceito pelo hibernate

		 */

		var _transformGenericQuerys = function(qs){

			for (var i in qs){
				if( _isGenericQuery(qs[i]) ) {
					qs[i] = qs[i].trim();
					var attr = qs[i].substring( qs[i].indexOf("_"),qs[i].indexOf(".")).replace("_","");
					var subAttr =  qs[i].substring( qs[i].indexOf("."),qs[i].indexOf(" ")).replace(".","");
					var restoQuery = qs[i].substring( qs[i].indexOf(subAttr)).replace(subAttr,"");
					var queryTransformed = '_'+attr + '[\''+subAttr+'\']'+restoQuery;
					qs[i] = queryTransformed;
				}
			}

			return qs;
		}

		/**
		 * @ngdoc method
		 * @methodOf stapi.genericUtil
		 * @name isGenericQuery
		 * @description verifica se uma query é do tipo genérico

		 */

		var _isGenericQuery = function(q){

			return q.indexOf("_string.") !=-1  || q.indexOf("_int.") !=-1 ||  q.indexOf("_double.") !=-1  || q.indexOf("_date.") !=-1; 

		}

		return {

			isGenericQuery: _isGenericQuery,
			transformGenericQuerys: _transformGenericQuerys

		};

	}

})();
