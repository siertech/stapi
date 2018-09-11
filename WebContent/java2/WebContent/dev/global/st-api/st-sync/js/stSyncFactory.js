"use strict";
(function(){

	angular.module("stapi") 

	.factory("cachePost", cachePost)
    .factory("cacheGet", cacheGet);

	function cacheGet($localStorage, $cookieStore, stUtil,$injector){

		var _getCacheName = function(){

			var login = $cookieStore.get("usuarioSistema").originalLogin;
			return "cacheGet"+login;
		}

		var _add = function(url, objetos){
			
			var nomeCache = _getCacheName();
		
			//Cria o objeto de cache caso não exista
			if(!$localStorage[nomeCache])
				$localStorage[nomeCache] = {};
			
			//Cria o objeto de cache caso não exista
			if(!$localStorage[nomeCache][url])
				$localStorage[nomeCache][url] = [];
			
            //Caso objetos seja um array
			if(objetos.length){
				for(var i in objetos){
				    _updateObject(url, objetos[i]);
				}
			}else {
				 _updateObject(url, objetos);
			}

		}

		//Atualiza um objeto dentro de cacheGet utilizando id como referencia
		var _updateObject = function(url, objeto){

			var index = stUtil.buscaOb( $localStorage[_getCacheName()][url],objeto.id,"id");

			if(index!=-1){

				$localStorage[_getCacheName()][url][index] = objeto;

			}
			else{

				$localStorage[_getCacheName()][url].push(objeto);
			}

		}
		
		
		var _getAll = function(url){

			var nomeCache = _getCacheName();

			if(!$localStorage[nomeCache])
				return [];

			var itens =   $localStorage[nomeCache][url];

			return itens;

		}

		var _get = function(url, label, like){

			var nomeCache = _getCacheName();

			if(!$localStorage[nomeCache])
				return [];

			var itens =   $localStorage[nomeCache][url];

			if(label && like){

				itens = itens.filter(function(item){

					if(item[label]  && item[label].toLowerCase().indexOf(like.toLowerCase())!=-1)
						return item;
				});
			}

			return itens;

		}

		var _getObjectById = function(url, id){

			var index = stUtil.buscaOb( $localStorage[_getCacheName()][url],id,"id");

			return $localStorage[_getCacheName()][url][index];

		}

		var _cleanAll = function(url){

			if($localStorage[_getCacheName()])
				delete $localStorage[_getCacheName()][url];
		}

		var _del = function(url,id){

			var index = stUtil.buscaOb( $localStorage[_getCacheName()][url],id,"id");

			$localStorage[_getCacheName()][url].splice(index,1);

		}

		//Cache de itens offline,por enquanto cliente e produtos para otimizar vendas
		var _getOfflineCache = function(callback){

			var stService = $injector.get("stService");

			//Limpa cache
			_cleanAll("cliente");
			_cleanAll("produto");
			_cleanAll("tagsProduto");

			//Cache de clientes e produtos para otimizar vendas
			stService.getLikeMap("cliente",["disable=0"],0,0,'').then(function(clientes){

				_add("cliente",clientes.itens);

				stService.getLikeMap("produto",["disable=0"],0,0,'').then(function(produtos){

					var prods = produtos.itens;
					_add("produto",prods);

					//Cache de tags
					var tags = [];
					for(var i in prods){ 

						if(prods[i].tag && tags.indexOf(prods[i].tag)==-1)
							tags.push(prods[i].tag);
					}

					_add("tagsProduto",tags);

					callback("ok");


				}).catch(function(){

					callback();
				});

			}).catch(function(){

				callback();

			});

		}

		return{
			add: _add,
			getCacheName: _getCacheName,
			getAll: _getAll,
			get: _get,
			cleanAll: _cleanAll,
			updateObject: _updateObject,
			getObjectById: _getObjectById,
			delObjectById:_del,
			getOfflineCache:_getOfflineCache
		}

	}


	function cachePost($localStorage,$cookieStore,$rootScope){

		//Adiciona ou edita um objeto ao cache
		var _add = function(url, objeto, callback){

			//Filial corrente
			var idFilial = 0;

			if($rootScope.currentFilial){

				idFilial  =  $rootScope.currentFilial.id;

			}

			objeto.idFilial = idFilial;
			url = url +"?filialId="+idFilial+"&&isCachePost=true";

			if(!$localStorage.cachePost)
				$localStorage.cachePost = [];

			var uS = $cookieStore.get("usuarioSistema");

			var login;
			if(uS){
				//login garante que o cache pertença ao usuário correto
				login = uS.originalLogin;
			}
			else {
				login="shared@shared";
			}

			var obCache = {
					url:url,
					objeto:objeto,
					login:login

			}

			$localStorage.cachePost.push(obCache);

			//Retorna o objeto com 'idCachePost' para futuras referencias
			if(callback)
				callback(objeto);
		}

		return{

			add:_add
		}

	}

})();
