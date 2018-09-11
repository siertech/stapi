"use strict";
(function(){

	angular.module("stapi")

	/**
	 * @ngdoc service
	 * @name stapi.stService
	 * @description Auxiliar de operações CRUD
	 */
	.factory("stService", stService);


	function stService($http, config, $cookieStore, genericUtil, $location, $window, $q){

		var _getBaseUrl = function(){

			var pathApp = config.confs.path;

			var base = new $window.URL($location.absUrl()).origin+"/";

			if($location.absUrl().indexOf(pathApp)!=-1)
				base+=pathApp+"/";

			return base;

		}

		var _getPromise = function(obRequest){

			var deferred = $q.defer();

			obRequest.then(function onSucess(res){

			    var data = res.data || {};
			    data.status = res.status;
			    data.response = res;
				deferred.resolve(res.data);

			}, function onError(response){

				deferred.reject(response);
			});

			return deferred.promise;

		}

		var _executeSQLQuery = function(query){

			var req ={

					method:"GET",
					params:{query: query}
			};
			
			var obRequest =  $http.get(_getBaseUrl()+"/projecao/execute-sql-query",req);
			
			return _getPromise(obRequest);

		}

		var _executeQuery = function(query){

			var req ={

					method:"GET",
					params:{query: query}
			};
			var obRequest =  $http.get(_getBaseUrl()+"/projecao/execute-query",req);
			
			return _getPromise(obRequest);

		}

		/**
		 * @ngdoc method
		 * @methodOf stapi.stService
		 * @name save
		 * @description Salva um objeto específico
		 * @param {String}  nomeObjeto Rota do objeto, ex: produto
		 * @param {Object}  Objeto a ser salvo, ex: {nome:"Produto teste"}
		 *  @example
		 * <pre>
		 * stService.save("produto",{nome:"Produto Teste"}).sucess(function(){}).catch(function(){})
		 * </pre>
		 */
		var _save  = function(nomeObjeto,objeto){

			var obRequest = $http.post(_getBaseUrl()+nomeObjeto.toLowerCase()+"/add/",objeto);
			
			return _getPromise(obRequest);

		};

		/**
		 * @ngdoc method
		 * @methodOf stapi.stService
		 * @name delete
		 * @param {String}  nomeObjeto Rota do objeto, ex: produto
		 * @param {Int[]}  ids Lista de ids a serem deletados
		 * @description Deleta itens especificando seus respectivos ids
		 * @example
		 * <pre>
		 * stService.delete("produto",[10,12]).sucess(function(){}).catch(function(){})
		 * </pre>
		 */
		var _delete  = function(nomeObjeto,ids){

			var obRequest =  $http.post(_getBaseUrl()+nomeObjeto.toLowerCase()+"/delete/",ids);
			
			return _getPromise(obRequest);

		};

		/**
		 * @ngdoc method
		 * @methodOf stapi.stService
		 * @name getById(nomeObjeto,id)
		 * @description Retorna um objeto completo especificando seu id
		 * @example
		 * <pre>
		 * stService.getById("produto",10).sucess(function(res){
		 *      console.log(res.item);
		 * })
		 * </pre>
		 * 
		 */

		var _getById =  function(nomeObjeto,id){

			var req ={

					method:"GET",
					params:{id:id}
			};
			var obRequest =  $http.get(_getBaseUrl()+nomeObjeto.toLowerCase()+"/get",req);
			
			return _getPromise(obRequest);
		};

		var _getLike =  function(nomeObjeto,queryBusca, prop){

			var req ={

					method:"GET",
					params:{query:queryBusca,propriedade:prop}
			};

			var obRequest =  $http.get(_getBaseUrl()+nomeObjeto+"/busca/",req);
			
			return _getPromise(obRequest);
		};

		/**
		 * @ngdoc method
		 * @methodOf stapi.stService
		 * @name getLikeMap(nomeObjeto, querys ,pagina, max, extra)
		 * @description Retorna uma lista de de objetos especificando diversos filtros
		 * @example
		 * <pre>
		 * stService.getLikeMap("produto",["preco=10","quantidade>20"],0,0,"").sucess(function(res){
		 *      console.log(res.itens);
		 * })
		 * </pre>
		 * 
		 */
		var _getLikeMap =  function(nomeObjeto,qs,pagina,max, extra){

			qs = genericUtil.transformGenericQuerys(qs);

			var req ={

					method:"GET",
					params:{qs:qs,pagina:pagina,max:max, extra: extra}
			};

			var obRequest =  $http.get(_getBaseUrl()+nomeObjeto+"/busca/map",req);
			
			return _getPromise(obRequest);
		};

		/**
		 * @ngdoc method
		 * @methodOf stapi.stService
		 * @name getAll(nomeObjeto)
		 * @description Retorna todos os objetos
		 * @example
		 * <pre>
		 * stService.getAll("produto").sucess(function(res){
		 *      console.log(res.itens);
		 * })
		 * </pre>
		 * 
		 */

		var _getList =  function(queryOptions){
			
			
			if(!queryOptions.querys ||  queryOptions.querys.length==0)
				queryOptions.querys = [""];
			
			queryOptions.pagina = queryOptions.pagina || 0;
			queryOptions.extra = queryOptions.extra || "";
			queryOptions.maxItensPerPage = queryOptions.maxItensPerPage || 0;
			
			queryOptions.objectName = queryOptions.objectName || queryOptions.nomeObjeto;

			//TODO
			//se queryOptions.max não estiver definido, queryOptions.max = config.confs.maxItensPerPage

			//Trasnforma query no formato _string.nome em _string["nome"], formato compatível com HQL
			var qs = genericUtil.transformGenericQuerys(queryOptions.querys);
			
			console.log("Querys transformadas: ");
			console.log(qs);
			qs

			var req ={
					method:"GET",
					params:{qs: queryOptions.querys, pagina: queryOptions.pagina, max: queryOptions.maxItensPerPage, extra: queryOptions.extra}
			};

			var obRequest = $http.get(_getBaseUrl() + queryOptions.objectName.toLowerCase()+"/busca/map",req);
			
			return _getPromise(obRequest);
		};

		var _getAll =  function(nomeObjeto){
			var req ={

					method:"GET",

			};

			var obRequest = $http.get(_getBaseUrl()+nomeObjeto,req);

			return _getPromise(obRequest);

		};

		var _getValues =  function(nomeOb,attr,extras){

			var req ={

					method:"GET",
					params:{

						nomeOb:nomeOb,
						attr:attr,
						extras:extras||['']

					}
			};

			var obRequest =  $http.get(_getBaseUrl()+"opcao/get-values",req);
			
			return _getPromise(obRequest);
		};

		var _apagar = function(nomeObjeto,ids){

			var obRequest =  $http.post(_getBaseUrl()+nomeObjeto+"/delete/",ids);
			
			return _getPromise(obRequest);
		};

		var _executePost = function(url,objeto){

			var obRequest = $http.post(_getBaseUrl()+url, objeto);

			return _getPromise(obRequest);
		};

		var _executeGet =  function(url,params){

			var req ={

					method:"GET",
					params:params
			};

			var obRequest =  $http.get(_getBaseUrl()+url,req);
			
			return _getPromise(obRequest);
		};

		//Projeções utilizando Control do próprio objeto
		var _getProjecoesFromObject = function(objeto,ops){

			ops.extra = ops.extra||'';
			ops.qs = ops.qs||[''];
			ops.max = ops.max||0;

			ops.qs = 	genericUtil.transformGenericQuerys(ops.qs);

			var req ={

					method:"GET",
					params:ops
			};
			

			var obRequest =  $http.get(_getBaseUrl()+objeto+"/projecoes",req);
			
			return _getPromise(obRequest);

		}

		var _getProjecoes = function(ops){

			ops.extra = ops.extra||'';
			ops.qs = ops.qs||[''];
			ops.max = ops.max||0;
			ops.qs = genericUtil.transformGenericQuerys(ops.qs);
			var obRequest =  $http.post(_getBaseUrl()+"projecao/get-projecoes/",ops);
			
			return _getPromise(obRequest);

		}
		
		var _changeAttrValue =  function(objeto ,id, key, value){

			//Adicionar aspas simples
		     value="'"+value+"'";
			
			var req ={

					method:"GET",
					params:{id: id, key: key, value: value}
			};

			var obRequest =  $http.get(_getBaseUrl()+objeto.toLowerCase()+"/change-attr-value", req);
			
			return _getPromise(obRequest);
		};

		return {

			//CRUD
			getLikeMap: _getLikeMap,
			getLike: _getLike,
			getAll : _getAll,
			save: _save,
			delete:_delete,
			getById: _getById,

			//Relatórios
			getProjecoes:_getProjecoes,
			getProjecoesFromObject:_getProjecoesFromObject,

			//Outros
			getValues: _getValues,
			apagar :_apagar,//Mesmo que 'save'
			executePost: _executePost,
			executeGet: _executeGet,
			executeQuery : _executeQuery,
			executeSQLQuery: _executeSQLQuery,
			getBaseUrl:_getBaseUrl,
			getList: _getList,
			changeAttrValue: _changeAttrValue


		};

	}

})();
