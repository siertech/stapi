"use strict";
(function(){
var app;
try{
 app  = angular.module("adm",["angular-growl","angularSpinner","ngRoute","ds.clock","FBAngular","ng-mfb","ngCookies","angular.filter","ngStorage","ngAudio","ngDraggable","ui.bootstrap","ui.transition","angular-confirm","ngMessages","chart.js","youtube-embed","ui.utils.masks","angular-json-tree","ngAnimate","ngSanitize", "textAngular","angular-chrono","ui.checkbox","ng.deviceDetector","ngOnboarding"]);
}catch(e){
	window.alert(e);
}
app.run(['$rootScope', '$route','$modalStack','$localStorage','$location','st','$filter','deviceDetector', function($rootScope, $route,$modalStack, $localStorage,$location,st,$filter,deviceDetector) {
	
	
	try{
		
		//
		
  
	if('serviceWorker' in navigator) {
		  navigator.serviceWorker
		           .register('service-worker.js')
		           .then(function() { console.log("Service r Registered"); });
		}
	
	
	
	
	
	//Desabiliar zoom (Necessário para safari)
	document.documentElement.addEventListener('gesturestart', function (event) {
	    event.preventDefault();      
	}, false);
	

	//Configuração da lib de Chart
	Chart.moneyFormat= function(value) {
		return $filter('number')(value,2);
	}

    //Evento para contabilizar o tempo de carregamento do sistema
    var tempoCarregamento = (new Date().getTime()-window.inicioCarregamento)/1000;
	st.evt({evento:"tempo_carregamento_sistema",descricao:tempoCarregamento});
	
    $rootScope.$on('$routeChangeStart', function(event, next, current) { 
    	
    	if(!next.$$route){
    		$location.path("/login");
    	}
    	
    	//Caso o usuário não esteja logado, é direcionado para página de login
    	else if(!$rootScope.usuarioSistema && (!next.$$route || next.$$route.originalPath.indexOf("/login/:login")==-1) && next.$$route.originalPath.indexOf("/cadastro/:login")==-1 && next.$$route.originalPath.indexOf("/teste")==-1 && next.$$route.originalPath.indexOf("/prot/:template")==-1 && next.$$route.originalPath.indexOf("/lavoura")==-1){
    		console.log("PATH: "+next.$$route.originalPath);
    		console.log("Não existe usuário logado no sistema");
    		$location.path("/login");
    	}
    	
    	
    	//Google analytics
    	if(next.templateUrl) {
            // interagindo com o Analytics através do objeto global ga
            ga('send', 'pageview', { page: next.templateUrl });
        }
    	
    	//Define se irá chamar event.preventDefault()
    	var preventDefault = false;
    	
    	
    	//Caso o menu mobile esteja visivel, é fechado
    	if($("#nav-header")[0] && $("#nav-header")[0].className.indexOf("open")!=-1){
    		$("#nav-header").removeClass("open");
    	}
        
    	//Caso tenha backdrop aberto, este é removido
    	$(".modal-backdrop").remove();
    	
    	var isModalOpen = function(){
    		
    		var modals = $(".modal");
    		   		
    		for(var i in modals){
    			
    			if(modals[i].className=='modal in'){
    				
    				//Caso no-change-path seja definida no modal como 'true', no fechamento não ocorre a mudança de path
    				if(modals[i].getAttribute('no-change-path')=='true');
    				  preventDefault =true;
    				  
    				return true;
    			}
    		}
    		return false;
    	}
    	
    	if(isModalOpen()){
    		  $(".modal").modal('hide');
    	 }

    	var top = $modalStack.getTop();
    	
         if (top) {
             $modalStack.dismiss(top.key);
         }
         
         
         if(preventDefault==true)
            event.preventDefault();
           
     });
    
    
    
    
	}catch(e){
		window.alert("O CeasaPlus não é compatível com seu navegador!\n"+e);
		console.log(e);
	}
}]);
 
})();


"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	//Teste de pagamento
	$routeProvider.when("/teste-pagamento",{

		templateUrl:"view/inicio.html",
		controller:function($scope,stService){

			var items = [{'title':'Mensalidade Albar','quantity':1,'currency_id':'BRL','unit_price':150.0}];

			var payer = {name:'Silvio',email:'thomaz-guitar@hotmail.com'};

			var data = {items:items,payer:payer};

			stService.executePost("pagamento/lancar/",data).success(function(){


			});
		}


	}); 

	//Rota para protótipos
	//ao especificar o endereço do template deve-se trocar '/' por '@'
	$routeProvider.when("/prot/:template",{

		templateUrl:"view/prot.html",
		controller:function($scope,template){

			$scope.template = template;
		},
		resolve:{

			template: function($route){

				var template = $route.current.params.template;

				template = "/" +template;

				if(template.indexOf("view")==-1)
					template = "view/"+template;

				if(template.indexOf(".html")==-1)
					template +=".html";

				template = template.replace("//","/");


				return template =template.replace("@","/");
			}
		}

	});

	$routeProvider.when("/checklist",{

		templateUrl:"view/ferramentas/checklist.html",
		controller:"stControl"
	}); 

	$routeProvider.when("/pdvsimples/add",{

		templateUrl:"view/pdv/pdv-simples.html",
		controller:'pdvSimplesController',
		resolve:{

			pdv:function(){
				return{}
			}
		}

	}); 

	$routeProvider.when("/pdvsimples/:id",{

		templateUrl:"view/pdv/pdv-simples.html",
		controller:'pdvSimplesController',
		resolve:{

			pdv:function($route,stService){

				return stService.getById("pdv",$route.current.params.id);
			}
		}

	}); 

	$routeProvider.when("/teste",{

		templateUrl:"view/teste.html",
		controller:"testeController",


	}); 

	$routeProvider.when("/financeiro/nota-promissoria",{

		templateUrl:"view/financeiro/nota-promissoria/template.html",

	}); 

	$routeProvider.when("/formaPagamento",{

		templateUrl:"view/financeiro/listaFormaPagamento.html",
		controller: "genericController",	

	}); 

	$routeProvider.when("/caixa",{

		templateUrl:"view/caixa/caixa.html",
		controller: "caixaController",

		resolve:{

			caixa: function(caixaService){

				return caixaService.getCaixa();
			}
		}

	}); 


	$routeProvider.when("/movimentacaocaixa",{

		templateUrl:"view/caixa/movimentacoes.html",

	}); 


	$routeProvider.when("/eventousuario",{

		templateUrl:"view/eventousuario/listaEventos.html",
		controller: "stControl"

	});


	/* ATUALIZAÇÃO DE ESTOQUE ANTIGA
   $routeProvider.when("/atualiza-estoque",{
		templateUrl:"view/produto/atualizaEstoque.html",
		controller: "atualizaEstoqueController",
	});
	 */

	$routeProvider.otherwise({
		templateUrl:"global/st-app/app-inicio/template-route/inicio.html",
		controller:"inicioController"	
	});

	//Intercepta um erro de resposta
	$httpProvider.interceptors.push(function ($q, $rootScope, $location, $localStorage, usSpinnerService) {
		return {

			'responseError': function(rejection) {
				var status = rejection.status;
				var config = rejection.config;
				var method = config.method;
				var url = config.url;

				usSpinnerService.stop('spinner-1');


				if (status == 401) {


					$location.path("/login-redirect");


				} else {
					//stUtil.showMessage("","Ocorreu um erro ao processar a soicitação.","danger");
				}

				return $q.reject(rejection);
			}
		};
	}
	);

	//Intercepta uma requisição para inclusao do Token
	$httpProvider.interceptors.push(function ($q, $rootScope, $location,$cookieStore, usSpinnerService,cacheGet) {
		return {
			'request': function(config) {

				if(config.url.indexOf("projecao/execute-query")==-1 && config.url.indexOf("projecao/get-projecoes")==-1  && config.url.indexOf("isCachePost=true")==-1)
					usSpinnerService.spin('spinner-1');

				//Inclusão do token e da filial
				if(config.url.indexOf(".html")==-1) {

					var authToken = $rootScope.authToken ||$cookieStore.get("authToken"); 
					var filialId = 0;
					var operadorId= 0;

					//Filtragem por filial
					if($rootScope.currentFilial){

						filialId = $rootScope.currentFilial.id;
					}
					
					//Filtragem por operador
					if($rootScope.currentOperador){

						operadorId =  $rootScope.currentOperador.id;
					}

					var operator = "?";

					if( config.url.indexOf("?")!=-1)
						operator="&&";

					config.url = config.url +operator+ "token=" + authToken;

					if(config.url.indexOf("filialId")==-1){
						config.url = config.url +"&&filialId="+filialId;
					}
					
					if(config.url.indexOf("operadorId")==-1){
						config.url = config.url +"&&operadorId="+operadorId;
					}


				}

				return config || $q.when(config);
			},

			'response': function(res) {

				var url = res.config.url;

				//Resposta relacionada a operação com produto (Para incluir no cacheGet)
				if(res.data && res.data.item && url.indexOf("produto/add")!=-1){

					var produto=res.data.item;
					console.log("Produto na resposta:");
					console.log(produto);

					if(produto.disable==1)
						cacheGet.delObjectById("produto",produto.id);
					else{
						cacheGet.updateObject("produto",produto);

						if(produto.tag){
							var tags = cacheGet.get("tagsProduto");
							if(tags.indexOf(produto.tag)==-1){
								cacheGet.add("tagsProduto",[produto.tag]);
							}
						}

					}

				}

				//Resposta relacionada a operação com cliente (Para incluir no cacheGet)
				else if(res.data && res.data.item && url.indexOf("cliente/add")!=-1){

					var cliente=res.data.item;

					if(cliente.disable==1)
						cacheGet.delObjectById("cliente",cliente.id);
					else{
						cacheGet.updateObject("cliente",cliente);
					}

				}

				usSpinnerService.stop('spinner-1');

				return res || $q.when(res);
			}
		};
	}
	);


})

})();

"use strict";
(function(){
angular.module('adm').factory('config',function($location, $rootScope, $http, $templateCache){

	
	var _appInfo = {
		
			
			$$path:"SindCar",
			$$versao: "CeasaPlus 3.7",
			$$paginaInicial: "/associado"
			
			
	}
	
	function getAppVersion(){
		
		return _appInfo.$$versao;
	}
	
	function getUrlBase(){
		
		var pathApp = _appInfo.$$path+"/";
		
		//Servidor de teste local (Utilizado para deploy do .war gerado pelo jenkins)
		if($location.$$absUrl.indexOf("7070/"+pathApp)!=-1)
			 return "http://"+$location.$$host+":7070/"+pathApp;
			
		else if($location.$$absUrl.indexOf("8080/"+pathApp)!=-1)
		  return "http://"+$location.$$host+":8080/"+pathApp;
		
		else if($location.$$absUrl.indexOf("8080")!=-1)
			  return "http://"+$location.$$host+":8080/";
		
        //SSL
		else if($location.$$absUrl.indexOf("https")!=-1)
			return "https://"+$location.$$host+"/";
                else
                  return "http://"+$location.$$host+"/";
		
	}
	
	
	function getPath(){
		
		return $location.path();
	}
	
	
	function cacheTemplates (){
		//Função substituida com a inclusão com service-worker
		
	}
	
	

	return {
		info: _appInfo,
		cacheTemplates: cacheTemplates,
		baseUrl: getUrlBase(),
		path: getPath(),
		appVersion: getAppVersion()
	};


})
})();
"use strict";
(function(){

	angular.module("adm") 

	.factory("cacheGet",function($localStorage,$cookieStore,stUtil,$injector){

		var getNomeCache = function(){

			var login = $cookieStore.get("usuarioSistema").originalLogin;
			return "cacheGet"+login;
		}

		var _add = function(url,objetos){

			var nomeCache = getNomeCache();

			//Cria o objeto de cache caso não exista
			if(!$localStorage[nomeCache])
				$localStorage[nomeCache] = {};

			var itens  = $localStorage[nomeCache][url]||[];

			//Adiciona os objetos ao cache
			itens = itens.concat(objetos);

			$localStorage[nomeCache][url] = itens;

		}

		//Atualiza um objeto dentro de cacheGet utilizando id como referencia
		var _updateObject = function(url, objeto){

			var index = stUtil.buscaOb( $localStorage[getNomeCache()][url],objeto.id,"id");

			if(index!=-1){

				$localStorage[getNomeCache()][url][index] = objeto;

			}
			else{

				$localStorage[getNomeCache()][url].push(objeto);
			}

		}

		var _get = function(url, label, like){

			var nomeCache = getNomeCache();

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

		var _getObjectById = function(url,id){

			var index = stUtil.buscaOb( $localStorage[getNomeCache()][url],id,"id");

			return $localStorage[getNomeCache()][url][index];

		}

		var _cleanAll = function(url){

			if($localStorage[getNomeCache()])
				delete $localStorage[getNomeCache()][url];
		}

		var _del = function(url,id){

			var index = stUtil.buscaOb( $localStorage[getNomeCache()][url],id,"id");

			$localStorage[getNomeCache()][url].splice(index,1);

		}

		//Cache de itens offline,por enquanto cliente e produtos para otimizar vendas
		var _getOfflineCache = function(callback){

			var stService = $injector.get("stService");

			//Limpa cache
			_cleanAll("cliente");
			_cleanAll("produto");
			_cleanAll("tagsProduto");

			//Cache de clientes e produtos para otimizar vendas
			stService.getLikeMap("cliente",["disable=0"],0,0,'').success(function(clientes){

				_add("cliente",clientes.itens);

				stService.getLikeMap("produto",["disable=0"],0,0,'').success(function(produtos){

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
					

				}).error(function(){
					
					callback();
				});

			}).error(function(){
				
					callback();
				
			});

		}

		return{
			add: _add,
			get: _get,
			cleanAll: _cleanAll,
			updateObject: _updateObject,
			getObjectById: _getObjectById,
			delObjectById:_del,
			getOfflineCache:_getOfflineCache
		}

	})

})();

"use strict";
(function(){

	angular.module("adm") 

	.factory("cachePost",function($localStorage,$cookieStore,$rootScope){

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

	})

})();

"use strict";
(function(){

	angular.module("adm") 

	//Diretiva necessária para upload de arquivos
	.directive('syncCachePost',function (onlineStatus) {
		return {
			restrict: 'E',
			templateUrl:"global/st-api/st-sync/template-module/syncCachePost.html",
			scope:{

			},
			controllerAs:"vm",
			bindToController:true,
			controller: function($localStorage, $interval, $timeout, stService, $rootScope, stUtil, onlineStatus, $scope, loginUtil, st, $uibModal) {

				var vm = this;

				var _start = function(){

					if(!$localStorage.cachePost)
						$localStorage.cachePost = [];

					var executando = false;

					var executar = function(){

						if(executando==true || onlineStatus.isOnline()==false|| loginUtil.isLogado()==false)
							return;

						executando = true;
						$rootScope.executandoCachePost = true;

						vm.sizeCachePostInExcecution = $localStorage.cachePost.length;

						executePosts(0,$localStorage.cachePost.length);
					}


					function executePosts(i, tam){

						if(i>=tam ||  !$localStorage.cachePost[0] || onlineStatus.isOnline()==false){

							executando = false;
							$rootScope.executandoCachePost = false;
							return;
						}

						vm.indexCachePostInExcecution = i+1;

						stService.executePost($localStorage.cachePost[0].url, $localStorage.cachePost[0].objeto).success(function(data){

							$localStorage.cachePost.splice(0,1);
							$timeout(function(){
								executePosts((i+1), tam);

							}, 300);


						}).error(function(erro, status){
							
							console.log("Erro no cachePost: ");
							console.log(erro);
							
							console.log("Status no cachePost");
							console.log(status);
							
							console.log("Objeto no cachePost");
							console.log($localStorage.cachePost[0]);
							
							if(erro && status!=401){
								
								st.evt({evento:"erro_cache_post", descricao: erro, descricao_2: JSON.stringify($localStorage.cachePost[0]) });

								$localStorage.cachePost.splice(0,1);
								$uibModal.open({
									animation: true,
									size:"lg",
									templateUrl:"global/st-api/app-login/template-route/manutencao.html"
									
								});
							}
						
						
								$timeout(function(){
									executePosts((i+1), tam);
	
								}, 5000);
							
					

						});
					}

					$interval(executar, 5000);

				}

				_start();
			}
		};
	})

})();

"use strict";
(function(){

	angular.module("adm") 

	.factory('st',function(stService, $rootScope, $cookieStore, config, deviceDetector){

		//Enviar um evento no sistema contablidade no servidor
		var _evt  = function(evt){

			console.log("deviceDetector: ");
			console.log(deviceDetector);

			//evt.pathOrigem = window.location.href;
			var usuario =  $cookieStore.get("usuarioSistema");

			if(!evt.login && usuario)
				evt.login = usuario.originalLogin;

			evt.versaoApp = config.appVersion;
			evt.alturaTela = $(window).height()+"";
			evt.larguraTela = $(window).width()+"";
			evt.os = deviceDetector.os+" - "+deviceDetector.os_version;
			evt.device = deviceDetector.device;
			evt.browser = deviceDetector.browser +" - "+deviceDetector.browser_version;

			stService.executePost("eventousuario/add/",evt).success(function(){


			});

		};
		
		
		var _leadEvt  = function(evt){

			var usuario =  $cookieStore.get("usuarioSistema");

			stService.executeGet("/lead/add-action-by-tel",{tel:usuario.login, action: evt.descricao }).success(function(){

			});

		};
		
		
		return{
			evt: _evt,
			leadEvt: _leadEvt
		}
	})


	.factory('stUtil',function($rootScope, $filter, growl){


		//Remove acentos de uma string
		var  _removerAcentos = function(str){

			console.log("Antes: "+str);
			var rExps=[
			           {re:/[\xC0-\xC6]/g, ch:'A'},
			           {re:/[\xE0-\xE6]/g, ch:'a'},
			           {re:/[\xC8-\xCB]/g, ch:'E'},
			           {re:/[\xE8-\xEB]/g, ch:'e'},
			           {re:/[\xCC-\xCF]/g, ch:'I'},
			           {re:/[\xEC-\xEF]/g, ch:'i'},
			           {re:/[\xD2-\xD6]/g, ch:'O'},
			           {re:/[\xF2-\xF6]/g, ch:'o'},
			           {re:/[\xD9-\xDC]/g, ch:'U'},
			           {re:/[\xF9-\xFC]/g, ch:'u'},
			           {re:/[\xD1]/g, ch:'N'},
			           {re:/[\xF1]/g, ch:'n'} ];

			for(var i=0, len=rExps.length; i<len; i++)
				str=str.replace(rExps[i].re, rExps[i].ch);

			console.log("Depois: "+str);

			return str;

		}

		var _disableFocus = function(){

			$("#anchor_cima").focus();
		}

		var _getDayOfIndex = function(index){

			switch(index){

			case 0:return 'segunda-feira';
			case 1:return 'terça-feira';
			case 2:return 'quarta-feira';
			case 3:return 'quinta-feira';
			case 4:return 'sexta-feira';
			case 5:return 'sábado';
			case 6:return 'domingo';

			}
		}

		var _openLogin = function(modal){

			modal.open({
				animation: true,
				templateUrl:'view/login/login.html',
				size:'lg',
				controller:function($scope,loginService,$rootScope){

					$scope.logar = function(login){

						$scope.logar = function(login){

							loginService.logar(login).success(function(data){

								var authToken = data.token;
								$rootScope.authToken = authToken;

							});

						}

					}

					$scope.fechar = function(ele){

						ele.$dismiss('cancel');
					}

				}
			});
		};

		var _getCountObs = function(obs,attrCount,attrComp,value){

			var total = 0;

			for(i in obs){

				if(attrComp){


					if( _compareJson(obs[i],value,attrComp)){

						total+=_getValueOfNivel(obs[i],attrCount);
					}
				}
				else{

					total+=_getValueOfNivel(obs[i],attrCount);
				}

			}

			return total;
		}

		//Formatar data para o formato aceito pelo sql(ISO)
		var _formatData = function formatData(data){

			if(typeof data=='object' || typeof data=='number'){

				return $filter("date")(data,"yyyy-MM-dd");
			}

			if(!data || data=='')
				return"";

			var format="";  

			var dia =   parseInt(data.substring(0,2));
			var mes = data.substring(3,5);
			var ano = data.substring(6);
			format=  ano+"-"+mes+"-"+dia;

			return format;

		};

		var _getNameMonth = function(n){

			switch(n){

			case 1:return "Janeiro";
			case 2:return "Fevereiro";
			case 3:return "Março";
			case 4:return "Abril";
			case 5:return "Maio";
			case 6:return "Junho";
			case 7:return "Julho";
			case 8:return "Agosto";
			case 9:return "Setembro";
			case 10:return "Outubro";
			case 11:return "Novembro";
			case 12:return "Dezembro";

			}

			return "";

		};

		var _showMessage = function(titulo,mensagem,tipo){

			var icon ='fa fa-info-circle';
			tipo = tipo||"info";

			if(tipo=='danger'){
				tipo="error";
			}

			//As configurações estão definidas em '.config(['growlProvider'' no inicio deste arquivo 
			growl[tipo](mensagem); 

		};

		var _buscaOb = function(array, query, attr){

			var attrs = [];

			if(attr)
				attrs = attr.split(".");

			for(var i in array){

				if(attr && attrs.length==1 && array[i][attrs[0]]==query)
					return i;

				if(attr && attrs.length==2 && array[i][attrs[0]][attrs[1]]==query)
					return i;

				else if(array[i]==query)
					return i;

			}

			return -1;

		};


		//Este método retorna o valor obtido do objeto através de atributos em níveis, ex; ob = mov, atributo =pessoa.endereco.cep
		var _getValueOfNivel = function(ob,attr){

			var result;

			//Niveis
			var nvs = attr.split(".");

			switch(nvs.length){

			case 0: result=ob;
			break;

			case 1: result=ob[nvs[0]];
			break;

			case 2: result=ob[nvs[0]][nvs[1]];
			break;

			case 3: result=ob[nvs[0]][nvs[1]][nvs[2]];
			break;

			case 4: result=ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]];
			break;

			case 5: result=ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]][nvs[4]];
			break;

			}

			return result;

		};

		var _setValueOfNivel = function(ob,attr,value){

			//Niveis
			var nvs = attr.split(".");

			switch(nvs.length){

			case 0: ;
			break;

			case 1: ob[nvs[0]]=value;
			break;

			case 2:ob[nvs[0]][nvs[1]]=value;
			break;

			case 3:ob[nvs[0]][nvs[1]][nvs[2]]=value;
			break;

			case 4:ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]]=value;
			break;

			case 5: ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]][nvs[4]]=value;
			break;

			}

			return ob;

		};

		var _compareJson = function(ob,value,attr){

			if(!attr || attr.split(".").length==0)
				return ob == value;

			//Niveis
			var nvs = attr.split(".");

			var key;

			switch(nvs.length){

			case 1:  key = ob[nvs[0]];
			break;

			case 2:  key = ob[nvs[0]][nvs[1]] ;
			break;

			case 3:  key  = ob[nvs[0]][nvs[1]][nvs[2]];
			break;

			case 4:  key = ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]];
			break;

			case 5:  key  = ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]][nvs[4]];
			break;

			}

			return key==value;

		}

		return {

			getCountObs: _getCountObs,
			getNameMonth: _getNameMonth,
			formatData: _formatData,
			showMessage: _showMessage,
			buscaOb:_buscaOb,
			openLogin:_openLogin,
			getValueOfNivel:_getValueOfNivel,
			setValueOfNivel:_setValueOfNivel,
			compareJson: _compareJson,
			disableFocus: _disableFocus,
			removerAcentos: _removerAcentos,
			getDayOfIndex:_getDayOfIndex

		};

	})

	.factory('s', function () {

		var _format = function(texto,tam,limiter){

			if(limiter)
				texto = _setLimiter(texto,limiter,".") ;

			while(texto.length<tam)
				texto+=" ";

			return texto;
		};

		var _setLimiter = function (value,max, tail) {
			if (!value) return '';

			max = parseInt(max, 10);
			if (!max) return value;
			if (value.length <= max) return value;

			value = value.substr(0, max);

			var lastspace = value.lastIndexOf(' ');
			if (lastspace != -1) {
				//Also remove . and , so its gives a cleaner result.
				if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
					lastspace = lastspace - 1;
				}
				value = value.substr(0, lastspace);
			}


			return value + (tail || ' …');
		};

		return _format;

	})

	.factory('printUtil',function($rootScope,$http,$filter,s,stUtil,movUtil){

		var FONT_BOLD=1;
		var FONT_ITALIC=2;


		var getFooterPrint = function(){

			var linhas = [];
			var hoje = new Date();
			linhas.push({texto:"TRACO"});
			linhas.push({texto:"Emitido em "+$filter("date")(hoje,'dd/MM/yyyy')+" as "+$filter("date")(hoje,'HH:mm:ss')});
			return linhas;

		}

		var getHeaderPrint = function(tipoPessoa,nomePessoa){

			var linhas = [];
			var config  = $rootScope.config.confs;
			var nome = "  "+config.nomeUsuario;
			var telefone = "           "+config.telefone||"";

			//Nome 
			linhas.push({texto:nome,fontSize:22,fontWeight:FONT_ITALIC,fontFamily:"ARIAL"});

			//Telefone
			linhas.push({texto:telefone,fontSize:12,fontWeight:FONT_BOLD,fontFamily:"ARIAL"});

			linhas.push({texto:"TRACO"});

			if(tipoPessoa && nomePessoa)
			{
				var descricaoPessoa = tipoPessoa+" : "+nomePessoa;
				descricaoPessoa = $filter("uppercase")(descricaoPessoa);
				linhas.push({texto:descricaoPessoa});
			}

			linhas.push({texto:"TRACO"});


			return linhas;

		}

		var _printMovs = function(movs){

			var config  = $rootScope.config.confs;
			var tipoPessoa = movs[0].pessoa.tipo_pessoa;
			var nomePessoa = movs[0].pessoa.nome;

			var linhas = getHeaderPrint(tipoPessoa,nomePessoa);

			for(i in movs){
				var mov = movs[i];

				//Data da movimentação
				var data =  new Date(mov.data);
				var dataFormatada = $filter("date")(data,"dd/MM/yyyy");
				var diaSemana = $filter("date")(data,"EEEE");
				var totalMov  = $filter("number")(mov.valor,2);
				linhas.push({texto:dataFormatada+" ("+diaSemana+") - R$ "+totalMov});

				var pedidos = mov.pedidos;
				var headerPedido = s("QUANT",5)+" "+s("PRODUTO",17)+" "+s("UNIT",5)+"  "+s("SUB-TOTAL",10)
				linhas.push({texto:headerPedido,fontSize:8,fontWeight:1});
				//Pedidos relacionados a movimentação
				for(var j in pedidos){

					var ped = pedidos[j];
					var totalPedido =$filter("number")(ped.quantidade * ped.valorUnitario,2);
					var valorUnitario =$filter("number")(ped.valorUnitario,2);
					var nomeProduto = ped.produto.nome;
					if(ped.opcao)
						nomeProduto+=" "+ped.opcao.nomeOpcao;


					var descPedido =  s(ped.quantidade+"x",5)+" "+s(nomeProduto,17,16)+" "+s(valorUnitario,5)+"  "+s(totalPedido,10)
					linhas.push({texto:descPedido,fontSize:8,fontWeight:1});
				}
			}

			var totalForMovs = movUtil.getTotalMovs(movs);
			totalForMovs = $filter("number")(totalForMovs,2);
			linhas.push({texto:"Total: R$ "+totalForMovs});

			//Footer
			linhas = linhas.concat(getFooterPrint());


			var objectPrint ={

					larguraPapel: config.larguraPapelCupom||80,
					linhas:linhas

			}

			var urlPrint = (config.urlImpressoraCupom||"http://localhost:1220")+"/print";

			var req = {
					method: 'POST',
					url:urlPrint ,
					headers: {
						'Content-Type': "text/plain"
					},
					data: objectPrint
			}
			$http(req).success(function(data){


			}).error(function(msg){

				stUtil.showMessage("","Ocorreu ao imprimir em '"+urlPrint+"'","danger");

			});


		}


		return{
			printMovs:_printMovs
		}

	})

	//Modal em forma de serviço
	.factory("$stDetalhe",function($http, config, $uibModal){

		var _open = function(template,ob,$scope_,callback){

			$uibModal.open({
				animation: true,
				templateUrl:template,
				size:'lg',
				controller:function($scope){
					$scope.ob=ob;
					$scope.objeto=ob;
					$scope.parente = $scope_;

					$scope.fechar = function(ele){

						ele.$dismiss('cancel');
						callback($scope.objeto);

					}

				}
			});
		};

		return {

			open: _open,

		};

	})

})();

"use strict";
(function(){

	angular.module("adm")
	
	.config(['growlProvider', function (growlProvider) {
     growlProvider.globalTimeToLive({success: 1000, error: 2000, warning: 3000, info: 4000});
    }])
    
  

})();

"use strict";
(function(){

	angular.module("adm") 

	.factory('onlineStatus', ["$window", "$rootScope", function ($window, $rootScope) {
	    var onlineStatus = {};

	    onlineStatus.onLine = $window.navigator.onLine;

	    onlineStatus.isOnline = function() {
	        return onlineStatus.onLine;
	    }

	    $window.addEventListener("online", function () {
	        onlineStatus.onLine = true;
	        $rootScope.$digest();
	    }, true);

	    $window.addEventListener("offline", function () {
	        onlineStatus.onLine = false;
	        $rootScope.$digest();
	    }, true);

	    return onlineStatus;
	}]);
	

})();

"use strict";
(function(){

	angular.module("adm") 

	.factory('dateUtil', function($rootScope,$filter, stUtil){

		var	_getPeriodOf = function(p,n){

			var intervalo;

			if(p=='SEMANA_PASSADA')
				intervalo = getSemanaPassada();

			else if(p=='SEMANA_ATUAL')
				intervalo = getSemanaAtual();

			else if(p=='MES_ATUAL')
				intervalo = getMesAtual();

			else if(p=='LAST_DAYS')
				intervalo = getLastDays(n);

			else if(p=='NEXT_DAYS')
				intervalo =  getNextDays(n);

			else if(p=='HOJE')
				intervalo = {de:new Date(),ate:new Date()}

			else if(p=='DESDE_INICIO_ANO')
				intervalo = getDesdeInicioAno();

			else
				console.log("tipo não definido em getPeridoOf()");

			intervalo.de.setHours(0,0,0);
			intervalo.ate.setHours(23,59,59);
			return intervalo;
		}


		function getDesdeInicioAno(){

			var periodoDe = new Date();
			periodoDe.setDate(1);
			periodoDe.setMonth(0);

			return {
				de:periodoDe,
				ate:new Date()
			};

		}

		function getSemanaPassada(){

			var hoje= new Date();
			var periodoDe = new Date();
			var inicioSemana = parseInt($rootScope.config.confs.inicio_semana);
			periodoDe.setDate(hoje.getDate() - (hoje.getDay()+7)+inicioSemana);
			var periodoAte = new Date();
			periodoAte.setDate(hoje.getDate()- hoje.getDay()+(inicioSemana-1));

			return {
				de:periodoDe,
				ate:periodoAte
			};

		}

		function getMesAtual(){

			var atual= new Date();
			var lastDay = _daysInMonth(atual.getMonth()+1,atual.getYear());
			var periodoDe = new Date();
			var periodDe = new Date();
			periodoDe.setDate(1);
			var periodoAte = new Date();
			periodoAte.setDate(lastDay);

			return{
				de:periodoDe,
				ate:periodoAte
			}

		}

		function getSemanaAtual(){

			var hoje= new Date();
			var periodoDe = new Date();
			var inicioSemana = parseInt($rootScope.config.confs.inicio_semana);
			console.log("date: "+hoje.getDate());
			console.log("day: "+hoje.getDay());
			console.log("inicioSemana: "+inicioSemana);
			periodoDe.setDate(hoje.getDate()-hoje.getDay()+inicioSemana);
			var periodoAte = new Date();
			periodoAte.setDate(periodoDe.getDate()+6);

			return{
				de:periodoDe,
				ate:periodoAte
			}

		}

		function getNextDays(days){

			var hoje= new Date();
			var periodoDe = new Date();
			periodoDe.setDate(hoje.getDate() + days);
			var periodoAte = new Date();

			return{
				de:periodoDe,
				ate:periodoAte
			}
		}

		function getLastDays(days){

			var hoje= new Date();
			var periodoDe = new Date();
			periodoDe.setDate(hoje.getDate() - days);
			var periodoAte = new Date();

			return{
				de:periodoDe,
				ate:periodoAte
			}
		}

		function _getQueryOfPeriod (column,de,ate){

			var query  = column+" between '"+_formatDate(de)+"' and '"+_formatDate(ate)+"'";

			return query;
		}

		//Formata a data para o formato ISO (yyyy-MM-dd)
		//Retorna uma String com a data formatada
		var _formatDate = function(data){

			if(typeof data=='object' || typeof data=='number'){

				return $filter("date")(data,"yyyy-MM-d");
			}

			if(!data || data=='')
				return"";

			var format="";  
			//   2016-12-01
			if(RegExp(/\d{4}\-\d{2}\-(\d{2}|\d{1})/).test(data)==true){

				var dia = parseInt(data.substring(8));
				var mes = data.substring(5,7);
				var ano = data.substring(0,4);
				format=  ano+"-"+mes+"-"+dia;
			}

			else if(RegExp(/\d{2}\/\d{2}\/\d{4}/).test(data)==true){

				var dia = parseInt(data.substring(0,2));
				var mes = data.substring(3,5);
				var ano = data.substring(6);
				format=  ano+"-"+mes+"-"+dia;

			}

			else if(RegExp(/\d{1}\/\d{2}\/\d{4}/).test(data)==true){

				var dia = parseInt(data.substring(0,1));
				var mes = data.substring(2,4);
				var ano = data.substring(5);
				format=  ano+"-"+mes+"-"+dia;

			}

			return format;

		}

		var _getDate = function(data){

			var formatData = _formatDate(data);
			var dia = parseInt(formatData.substring(8));
			var mes = parseInt(formatData.substring(5,7));
			var ano = parseInt(formatData.substring(0,4));
			var data =  new Date(ano,mes-1,dia);
			return data;
		}

		//Recupera a quantidade de dias de um Mês
		var  _daysInMonth  = function(month,year) {
			var dd = new Date(year, month, 0);
			return dd.getDate();
		}

		//Incrementa uma data de acordo com o modo
		var _incrementaData = function(data,modo){

			if(!modo || modo==0)
				modo=3;

			switch(modo){

			//Diário
			case 1:  data.setDate(data.getDate()+1);
			break;

			//Mensal
			case 3:  data.setMonth(data.getMonth()+1);
			break;

			//Mensal
			default: data.setMonth(data.getMonth()+1);
			}

			return data;

		}

		var _daysBetween = function (date1_ms, date2_ms) {

			// The number of milliseconds in one day
			var ONE_DAY = 1000 * 60 * 60 * 24

			// Calculate the difference in milliseconds
			var difference_ms = Math.abs(date1_ms - date2_ms)

			// Convert back to days and return
			return Math.round(difference_ms/ONE_DAY)

		}


		return {

			getPeriodOf:_getPeriodOf,
			getQueryOfPeriod:_getQueryOfPeriod,
			formatDate: _formatDate,
			getDate:_getDate,
			daysInMonth:_daysInMonth,
			incrementaData:_incrementaData,
			daysBetween: _daysBetween
		}

	})

})();

"use strict";
(function(){

	angular.module("adm") 
	
	
	//Diretiva necessária para upload de arquivos
	.directive('delayCount',function (onlineStatus) {
		return {
			restrict: 'E',
			template:"{{count}}",
			scope:{
				number:"=",
				time:"=",
				finish:"="
			},
			controller: function($scope, $interval) {
				$scope.count = 0;
				$interval(function(){
					
					if($scope.count<$scope.number)
						$scope.count++;
					else{
						$scope.finish = true;
						return;
					}
					
				}, $scope.time|| 300);
			}
		};
	})
	
	//Diretiva necessária para upload de arquivos
	.directive('networkButtonStatus',function (onlineStatus) {
		return {
			restrict: 'E',
			templateUrl:"global/st-api/st-util/template-module/networkButtonStatus.html",
			controller: function($scope) {
				$scope.onlineStatus = onlineStatus;

				$scope.$watch('onlineStatus.isOnline()', function(online) {
					$scope.online_status= online;
				});
			}
		};
	})

	//Diretiva necessária para upload de arquivos
	.directive('fileModel', ['$parse', function ($parse) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;

				element.bind('change', function(){
					scope.$apply(function(){
						modelSetter(scope, element[0].files[0]);
					});
				});
			}
		};
	}])


	.directive('stInitial', function() {
		return {
			restrict: 'A',
			controller: [
			             '$scope', '$element', '$attrs', '$parse', function($scope, $element, $attrs, $parse) {
			            	 var getter, setter, val;
			            	 val = $attrs.ngInitial || $attrs.value;
			            	 getter = $parse($attrs.ngModel);
			            	 setter = getter.assign;
			            	 setter($scope, val);
			             }
			             ]
		};
	})

	.directive("buttonInfoOb",function($uibModal,filialUtil){

		return{
			link: function (scope, element, attrs){

				element.bind("click",function(){

					var objeto = JSON.parse(attrs.objeto);

					$uibModal.open({
						animation: true,
						templateUrl:"global/st-api/st-util/template-module/info-ob/modalInfoOb.html",
						size:'md',
						controller:function($scope){
							$scope.objeto=objeto;


							if(objeto.historicoObjeto)
								$scope.historicos = objeto.historicoObjeto.split(",");

							$scope.filialObjeto = filialUtil.getFilialById(objeto.idFilial);


						}
					});


				});

			}

		}

	})



	
	
	.directive("buttonAdd",function(){
		return{

			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/buttonAdd.html"
			
			
		}
	})


	.directive("estadosCidades",function(){
		return{

			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/estadosCidades.html",
			scope:{
				estado:"=",
				cidade:"=",

				codigoUf:"=",
				codigoMunicipio:"=",
				nomeMunicipio:"=",
				uf:"=",

			},
			bindToController:true,
			controller:"estadosCidadesController as vm",
		}
	})

	.directive('stNoItens',function(){

		return{
			template:'<p class="text-muted" style="padding:10px;">'+
			'<i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{label}}'+
			'</p>',
			scope:{
				label:"="
			}
		}
	})

	//Destacar oxorrencias em um texto
	.directive('destaqueTexto',function(){

		return {
			restrict:"E",
			template:"<strong><span class='{{class}}' ng-class=\"{'busca-destaque':(first!=-1 && $index>=first && $index<=last)}\" ng-repeat='c in texto track by $index'>{{c}}</span></strong>",
			scope:{

				busca:"=",
				texto:"=",
				class:"="

			},
			controller:function($scope){

				if($scope.busca && $scope.busca.length>0){

					var texto = $scope.texto.toLowerCase();
					var busca = $scope.busca.toLowerCase();

					$scope.first = texto.indexOf(busca);
					$scope.last = $scope.first +busca.length;

				}

				else{
					$scope.first=-1;
					$scope.last=-1;

				}

			}
		}

	})

	//Diretiva de atalhes
	.directive('buttonExpressCad',function(movUtil,stService){

		return {
			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/buttonExpressCad.html",
			controller:function($scope){


				//Cadastro de despesa normal
				$scope.cadDespesa = function(){

					var mov = {tipo:1};
					movUtil.openMov(mov,function(){
						
					});

				}

			}
		}

	})


	.directive('stItemSelection',function(stService){

		return{

			restrict:"E",
			require:'ngModel',
			templateUrl:'global/st-api/st-util/template-module/itemSelection.html' ,
			scope:{

				maxItens:"=",//Quantidade de itens por página,
				objectOp:"=",
				label:"=",//Atributo do item a ser exibido
				extraLabel:"="	
			},
			link:function($scope,elements,attrs,ctrl){
				$scope.setPagina = function(pagina){

					$scope.pagina = pagina;

					stService.getLikeMap($scope.objectOp,[''],pagina,$scope.maxItens||0,'').success(function(data){

						$scope.itens = data.itens;

					});
				}

				$scope.setPagina(0);

				$scope.selecionarItem = function(item){

					ctrl.$setViewValue(item);
				}
			}
		}
	})


	//Diretiva para impressão
	.directive('stShow', function ($window,$animate) {
		return {
			restrict: 'A',
			multiElement: true,
			link: function(scope, element, attr) {
				scope.$watch(attr.stShow, function ngShowWatchAction(value) {

					if(value==true){
						element.addClass("st-show");
					}
					else{
						element.removeClass("st-show"); 
					}

				});
			}
		};
	})



	//Diretiva para impressão
	.directive('stPrint', function ($window) {
		return {
			restrict: 'A',
			scope:{


			},
			link: function (scope, element, attr) {

				element.bind("click",function(){


					var ele = $("#"+element.attr('id-print'));
					ele.addClass("printShow");
					ele.removeClass("printHide");
					$window.print();
					ele.removeClass("printShow");
					ele.addClass("printHide");


				});

			}
		}
	})


	//Diretiva para Status de carregamento
	.directive('stPagination', function (anchorScroll) {
		return {
			restrict: 'AE',
			templateUrl:'global/st-api/st-util/template-module/st-pagination.html',
			scope:{

				label:"=",
				querys:"=",//Querys bindadas


			},
			controller:function($scope,$rootScope){
				
				$scope.pagina=0;
				$scope.max = $rootScope.config.confs.maxItensPage||7

				$scope.setPagina = function(pagina){

					anchorScroll.scrollTo("anchor_cima");
					$scope.pagina=pagina;
					$scope.$parent.getLikeMap($scope.querys||[''],$scope.pagina,$rootScope.config.confs.maxItensPage||7,"","id","DESC");

				}

			}

		}
	})

	//Diretiva para Status de carregamento
	.directive('loading', function () {
		return {
			restrict: 'E',
			scope:{

				label:"="

			},
			replace:true,
			template: '<div class="loading"><i class="fa fa-refresh fa-spin"></i> <i>{{label}}</i></div>',
			link: function (scope, element, attr) {
				scope.$watch('loading', function (val) {
					if (val)
						scope.loadingStatus = 'true';
					else
						scope.loadingStatus = 'false';
				});
			}
		}
	})






	.directive("stList",function($filter){


		return {

			templateUrl:'view/api/st-list.html',
			restrict:"E",
			scope:{

				itens:"=",
				left:"@",
				right:"@",
				link:"@",
				tl:"@",
				tr:"@",
				cl:"@",
				cr:"@",
				bl:"@",
				br:"@",
				tamleft:"@",
				tamright:"@",
				labelitem:"@"


			},

			link: function($scope, element, attrs) {

				if(!$scope.tamleft)
					$scope.tamleft=6;

				if(!$scope.tamright)
					$scope.tamright=6;

				$scope.getLt = function(item,position){

					if(!$scope[position] && position=='cl')
						position="left";

					if(!$scope[position] && position=='cr')
						position="right";


					var frase="";

					if(!$scope[position])
						return "";


					frase  = $scope[position];


					var expressoes = frase.split(",");
					var regex;//Regex para cada expressao
					var i;
					var termos = [];
					var termo = {

							atributo:'',
							valor:0,
							tipo:'',
							exp:''

					};

					for(var i in expressoes){

						termo = {};

						//Literal
						if(expressoes[i].indexOf("[")==-1)
						{

							regex = new RegExp(/\'[\w | \W]+\'/);
							termo.valor = regex.exec(expressoes[i])[0].replace(/\'/g,"");
							termo.tipo='string';
							termo.atributo=null;
							termo.exp=expressoes[i];



						}	
						else {

							regex = new RegExp(/\[[\w |\W]+\:/);
							var atributo = regex.exec(expressoes[i])[0];
							atributo = atributo.replace("[","");
							atributo = atributo.replace(":","");
							var atributos = atributo.split(".");
							termo.atributo = atributos[0];

							var sub_  = atributo.split(".")[1];

							var valor = item[termo.atributo];

							if(sub_)
								valor  = valor[sub_];

							termo.valor = valor;
							regex = new RegExp(/\'[\w | \W]+\'/);
							termo.tipo = regex.exec(expressoes[i])[0].replace(/\'/g,"");
							termo.exp = expressoes[i];




						}

						termos.push(termo);	


					}

					//Literal a ser renderizado
					var lt="";
					var pre="";

					var j;
					for(var j in termos){

						if(termos[j].tipo=='money'){

							lt="R$ ";
							termos[j].valor = $filter('number')(termos[j].valor,2);

						}
						else if(termos[j].tipo=='string')
							termos[j].valor = $filter('uppercase')(termos[j].valor);


						lt+=termos[j].valor;

					}



					return lt;

				}


				$scope.getLink = function(item){

					var link = $scope.link ;

					if(!link)
						return"#";

					var pattern  = new RegExp(/\[[a-z]+\]/);
					var atributo  = pattern.exec($scope.link);
					var attr = atributo[0];
					attr = attr.replace("[","");
					attr  = attr.replace("]","");
					link = link.replace(pattern,item[attr]);

					return link;

				}



			}


		}

	})

	.directive('stCheck', function() {
		return {
			templateUrl:"global/st-api/st-util/template-module/stCheck.html",
			transclude:true,
			scope:{

				ngModel:"=",
				ngChange:"=",
				ngDisabled:"=",
				label:"=",
				labelClass:"="
			}
		}
	})

	.directive('stRelatorio', function(relatorioService,stUtil) {
		return {
			templateUrl:"view/relatorio/relatorioDirective.html",
			transclude:true,
			scope:{
				url:"=",
				nomeObjeto:"="	 

			},
			controller:function($scope){

				$scope.dataDe = new Date();
				$scope.dataAte = new Date();

				$scope.teste = function(){

				}

				$scope.gerarRelatorio = function(column,operador,valueColumn,countColumn,query,nomeRelatorio){

					$scope.nomeRelatorio = nomeRelatorio;//Nome do relatório

					var ops = {};

					//Preparação das opções
					ops.nomeObjeto = $scope.nomeObjeto;//Nome da classe Principal do objeto do relatório
					ops.column=column;//Coluna principal dos dados a serem exibidos ex:'formaPagamento'
					ops.operador=operador;//Operador a ser utilizado na query ex: 'like','='
					ops.countColumn=countColumn;//Columna utilizada para contagem, ex: 'Quantidade' ,'*'
					ops.valueColumn = valueColumn;//Coluna utlizada para soma, ex:'Valor'
					ops.url = $scope.url;
					ops.querys = [];
					ops.labels = ["Dinheiro","Cheque"];
					ops.querysLabel=[];
					ops.dataDe = stUtil.formatData($scope.dataDe);
					ops.dataAte = stUtil.formatData($scope.dataAte);

					ops.querysLabel = ops.querys;//Query utilizada na recuperação de labels


					if(query && query.length>0)
						ops.querys.push(query);


					/* Querys Extras
					if($scope.nomeProduto && $scope.nomeProduto.length>0 )
						ops.querys.push("produto like '%"+$scope.nomeProduto+"%'");
					 */



					relatorioService.getProjecoes(ops,function(data){


						$scope.proj = data;



					});

				}


			}


		};
	})



	.directive('convertToNumber', function() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				ngModel.$parsers.push(function(val) {
					return val ? parseInt(val, 10) : null;
				});
				ngModel.$formatters.push(function(val) {
					return val ? '' + val : null;
				});
			}
		};
	})

	.directive('navClick', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {


				element.on('click', function (event) {

					var elementoMenu = $("#elementoMenu");	

					elementoMenu.attr('class','sidebar-nav navbar-collapse collapse');


				});
			}
		};
	})

	//Anchor Scroll
	.service('anchorScroll', function(){

		this.scrollTo = function(eID) {

			// This scrolling function 
			// is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

			var startY = currentYPosition();
			var stopY = elmYPosition(eID);
			var distance = stopY > startY ? stopY - startY : startY - stopY;
			if (distance < 100) {
				scrollTo(0, stopY); return;
			}
			var speed = Math.round(distance / 100);
			if (speed >= 20) speed = 20;
			var step = Math.round(distance / 25);
			var leapY = stopY > startY ? startY + step : startY - step;
			var timer = 0;
			if (stopY > startY) {
				for ( var i=startY; i<stopY; i+=step ) {
					setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
					leapY += step; if (leapY > stopY) leapY = stopY; timer++;
				} return;
			}
			for ( var i=startY; i>stopY; i-=step ) {
				setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
				leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
			}

			function currentYPosition() {
				// Firefox, Chrome, Opera, Safari
				if (self.pageYOffset) return self.pageYOffset;
				// Internet Explorer 6 - standards mode
				if (document.documentElement && document.documentElement.scrollTop)
					return document.documentElement.scrollTop;
				// Internet Explorer 6, 7 and 8
				if (document.body.scrollTop) return document.body.scrollTop;
				return 0;
			}

			function elmYPosition(eID) {
				var elm = document.getElementById(eID);
				var y = elm.offsetTop;
				var node = elm;
				while (node.offsetParent && node.offsetParent != document.body) {
					node = node.offsetParent;
					y += node.offsetTop;
				} return y;
			}

		};

	})

	.directive('stCollapsePanel', function( $timeout){
		return {
			restrict:"E",
			transclude:true,
			templateUrl: 'global/st-api/st-util/template-module/stCollapsePanel.html',
			scope:{
				titulo:"=",
				icone:"=",
				show:"=",
				extraClass:"="
			} ,
			link:function($scope){


			}
		}
	})

	.directive('stAccordion', function(){
		return {
			restrict: "E",
			replace: true,
			transclude: true,
			template: '<div class="panel-group" ng-transclude></div>',
			scope:{

				accordionIn:"="
			},
			link: function(scope,elem, attrs){
				var id = elem.attr("id");

				if (!id) 
				{
					id = "btst_acc" + scope.$id;
					elem.attr("id", id);
				}

				var arr = elem.find(".accordion-toggle");
				for (var i = 0; i < arr.length; i++) {
					$(arr[i]).attr("data-parent", "#" + id);
					$(arr[i]).attr("href", "#" + id + "collapse" + i);
				}

				var arr = elem.find('.panel-collapse');

				if(scope.accordionIn==true){
					$(arr[0]).addClass("in");
				}

				for (var x = 0; x < arr.length; x++) {
					$(arr[x]).attr("id", id + "collapse" + x);
				}

			},
			controller: function(){}
		}}).directive('stAccordionPanel', function(){
			return {
				require: '^stAccordion',
				restrict: "E",
				replace: true,
				transclude: true,
				scope: {

					title:"=",
					idPanel:"@"

				},
				template: 
					'<div class="panel panel-default panel-pdvficha">'+
					'	<div id="{{idPanel}}" data-toggle="collapse" class="panel-heading accordion-toggle collapsed">'+
					'   	{{title}} <i class="fa fa-edit"></i>'+
					'	</div>'+
					'	<div class="panel-collapse collapse panel-body" ng-transclude>'+
					'	</div>'+
					'</div>',
					link: function(scope,elem,attrs){
						scope.$watch("title", function(){
							var hdr = elem.find(".accordion-toggle");
							hdr.html(scope.title+' <i class="fa arrow"></i>');
						})
					}
			}
		})


		.filter('indexDay', function (stUtil) {
			return function (value) {

				return stUtil.getDayOfIndex(value);
			};
		})

		.filter('limiter', function () {
			return function (value,max, tail) {
				if (!value) return '';

				max = parseInt(max, 10);
				if (!max) return value;
				if (value.length <= max) return value;

				value = value.substr(0, max);

				var lastspace = value.lastIndexOf(' ');
				if (lastspace != -1) {
					//Also remove . and , so its gives a cleaner result.
					if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
						lastspace = lastspace - 1;
					}
					value = value.substr(0, lastspace);
				}


				return value + (tail || ' …');
			};
		})

		.filter('tojson', function () {
			return function (value) {
				if (!value) return '';


				return JSON.parse(value);
			};
		})


	.directive('autoFocus"', function($timeout) {
			return {
				link: function(scope, element) {
					
					console.log("Chamou o focus");
					
							$timeout(function() {
								element[0].focus(); 
								console.log("Chamou o focus");
							});
					
				}
			};
		})

	.directive('focusMe', function($timeout) {
		return {
			scope: { trigger: '=focusMe' },
			require:'ngModel',
			link: function(scope,element,attr,ctrl) {


				scope.$watch('trigger', function(value) {

					if(value === true) { 
						$timeout(function() {

							var ele = element[0] ; 
							ele.selectionStart = ele.value.length;
							//ele.selectionEnd = ele.value.length;;
							ele.focus();
							scope.trigger = false;
						},1000);
					}
				});
			}
		};
	})

	.directive('verticalSpace',function(){

		return{
			restrict:"E",
			replace:true,
			template:'<div class="row"><div class="vertical-space"></div></div>'
		}

	})

	.directive('stValue',function(){

		return{
			restrict:"E",
			scope:{

				object:"=",
				attr:"=",
				value:"=",

			},
			link:function($scope){

				if(!$scope.object)
					$scope.object = {};

				$scope.object[$scope.attr] = $scope.value;

				$scope.$watch($scope.value,function(){

					$scope.object[$scope.attr] = $scope.value;

				});

			}
		}

	})

	.directive("usuarioSistema",function( $uibModal,stService,stUtil,loginUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/usuario-sistema/usuarioSistema.html",
			controller:function($scope, $rootScope, $cookieStore, filialUtil){

				
				$rootScope.$watch('usuarioSistema', function(usuarioSistema){
					
					$scope.usuarioSistema = usuarioSistema;
				});
				

				$scope.logOut = function(){

					loginUtil.logOut();

				}


				$scope.editarFilial = function(){

					filialUtil.openDetalheCurrentFilial(function(filial){


					});
				}

				$scope.editarUsuario = function(usuarioSistema){

					var modal =  $uibModal.open({
						animation: true,
						templateUrl:"global/st-api/st-util/template-module/usuario-sistema/modalEditUsuario.html",
						size:'lg',
						controller:function($scope){

							$scope.usuarioSistema = usuarioSistema;

							$scope.salvar = function(usuarioSistema,modal){

								if(!usuarioSistema.senha){
									stUtil.showMessage("","O campo senha deve ser preenchido!","danger");
									return;
								}

								if(usuarioSistema.senha!=usuarioSistema.senha2){
									stUtil.showMessage("","As senhas não conferem!","danger");
									return;
								}
								if(usuarioSistema.senha.length<6){
									stUtil.showMessage("","A senha deve ter pelo menos 6 caracteres.","danger");
									return;
								}

								stService.save("operadorsistema",usuarioSistema).success(function(){

									stUtil.showMessage("","Salvo com sucesso!","info");
									modal.$dismiss('cancel');
								});
							}

							$scope.fechar = function(ele){

								ele.$dismiss('cancel');
								callback($scope.objeto);

							}



						}
					});
				}
			}

		}
	})

	.directive("stToggle",function(){

		return{
			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/stToggle.html",
			scope:{

				ngModel:"=",
				ngDisabled:"=",
			},

		}
	})


	.directive("stSplitCheck",function(){

		return{
			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/st-split-check.html",
			scope:{

				ngModel:"=",//Valores que serão definidos no objeto, de acordo com os itens selecionados
				preValues:"=",
				limiteLabel:"="
			},
			controller:function($scope){

				if($scope.ngModel==null)
					$scope.ngModel ="";

				var its = $scope.preValues.split(",");

				var itens = [];

				for(var i in its){

					var sele = $scope.ngModel.indexOf(its[i])!=-1;

					itens.push({label:its[i],selecionado:sele});
				}

				$scope.itens = itens;

				$scope.changeCheck = function(){

					var model = "";
					for(var j in $scope.itens){

						if( $scope.itens[j].selecionado==true){
							model = model+","+$scope.itens[j].label;
						}
					}

					$scope.ngModel = model;
				}


			}
		}
	})


	.directive("stStep",function(){

		return{
			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/st-step.html",
			scope:{

				steps:"=",
				step:"=",
				initialStep:"="

			},
			controller:function($scope){

				if(!$scope.initialStep)
					$scope.step = 0;


				$scope.changeStep = function(index){

					$scope.step = index;
				}
			}

		}
	})

	.directive("inputEdit",function(){

		return{
			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/inputEdit.html",
			transclude:true,
			scope:{

				label:"=",
				ngModel:"=",
				icon:"=",
				type:"="

			},
			controller:function($scope){

				if($scope.ngModel)
					$scope.mostraValor=true;
				else{
					$scope.mostraValor=false;
				}


			}

		}
	})

	.directive("stCollapse",function(){

		return{
			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/st-collapse.html",
			transclude:true,
			scope:{

				label:"=",


			},
			controller:function($scope){

				$scope.show = false;


			}

		}
	})

	.directive('stPeriod',function(dateUtil,$localStorage){

		return{
			restrict:"E",
			templateUrl:'global/st-api/st-util/template-module/stPeriod.html',
			require:['de','ate','submit'],
			scope:{

				de:"=",
				ate:"=",
				submit:"=",
				change:"=",
				syncPeriod:"=",//se true, o periodo selecionado é sincronizado em local storage
				
			},

			controller:function($scope){

				if($scope.syncPeriod==true){

					$scope.de = 	$localStorage.dataDe;
					$scope.ate = 	$localStorage.dataAte;

					$scope.$watch("de",function(de){
						$localStorage.dataDe = de;
					});

					$scope.$watch("ate",function(ate){

						$localStorage.dataAte = ate;
					});

				}



				$scope.alterarPeriodo = function(periodo){

					var p = dateUtil.getPeriodOf(periodo);

					$scope.de = p.de;
					$scope.ate = p.ate;

				}



			}
		}


	})



	.directive("stAlertButton",function(){

		return{
			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/stAlertButton.html",
			controller:function($scope,$interval,stService,$uibModal, $location,$stDetalhe, $route){

				var getAlerts = function(){

					stService.executeGet("projecao/execute-query",
							{query:"select p.id,p.nome,'',p.quantidade from Produto p where (p.quantidade<=p.minQuant) and p.disable =0"}).success(function(data){
								$scope.itens =  data.itens;
								$scope.numAlerts = data.itens.length;

							}).error(function(){


							});



				}

				$interval(getAlerts,15000);

				$scope.openAlerts = function(itens){

					$uibModal.open({
						animation: true,
						templateUrl:"global/st-api/st-util/template-module/modalAlertEstoque.html",
						size:'md',
						controller:function($scope){

							$scope.itens = itens;

							$scope.fechar = function(ele){

								ele.$dismiss('cancel');
								callback($scope.objeto);

							}

							$scope.toProduct = function(idProduto,modal){

								modal.$dismiss("cancel");

								stService.getById("produto",idProduto).success(function(data){

									$stDetalhe.open("view/produto/addAndUpdateProduto.html",data.item,$scope,function(res){

										$route.reload();

									}); 

								});		

							}

						}
					});
				}

			}

		}
	})

})();

"use strict";
(function(){

	angular.module("adm") 
	
	
	//Diretiva necessária para upload de arquivos
	.directive('mobileTabs',function (onlineStatus) {
		return {
			restrict: 'E',
			templateUrl:"global/st-api/st-util/template-module/mobileTabs.html",
			scope:{
				activeTab:"=",
				tabs: "="
			},
			controllerAs:"vm",
			bindToController:true,
			controller: function() {
				
				var vm = this;
				
				if( vm.activeTab!=0)
				vm.activeTab = 	vm.activeTab || 1;
				
				vm.alterarTab =function (tab){

					vm.activeTab = tab;

				}
				
			}
		};
	})

})();

"use strict";
(function(){

	angular.module("adm") 
	
	//Select simples (Sem auto-complete)
	.directive("stSelect",function(stService){

		return{
			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/stSelect.html",
			scope:{
				
			   urlBase:"=",//url base no control do objeto (Ex: 'produto')
			   attrLabel:"=",//Nome do atributo a ser exibido no label do select	 
			   ngModel:"="//ng-model associado	   
			},
			controller:function($scope){
				
				//Recupera todos os objetos
			    stService.getAll($scope.urlBase).success(function(data){
			    	
			    	$scope.itens = data.itens;
			    });

			}

		}
	})
	
})();

"user strict";
(function(){

	angular.module("adm") 

	.directive("stInput",function($compile,$filter, stService,$rootScope,stUtil){

		return {
			require:'ngModel',	

			scope:{

				tipo:"@",
				label:"=",
				disable:"@",
				objectOp:"@",//Objeto em caso de chave/valor
				optionsChosen:"@",
				html:"@",
				dateFormat:"=",
				savePath:"=",
				saveObject:"="
			},


			link: function($scope, element, attrs,ctrl){

				/*
				//Mudança para salvar
				if($scope.saveObject && $scope.savePath){



					var inputGroup = $compile("<div class='input-group'></div>")($scope);

					element.before(inputGroup);

					inputGroup.append(element);

					var buttonSave = $compile("<button class='btn btn-info'><i class='fa fa-floppy-o'></i></button>")($scope);
					var spanButton = $compile("<span class='input-group-btn'></div>")($scope);
					spanButton.append(buttonSave);
					inputGroup.append(spanButton);

					console.log(inputGroup);
					element.bind("keyup",function(){

					});
				}

				 */


				//Focus automático
				if($scope.tipo!='data')	{
					element.bind("mouseover",function(){

						element.focus();
						var $thisVal = element.val();
						element.val('').val($thisVal);

					});
				}

				{html:'<button></button>'}

				if($scope.tipo=='htmlCompile'){


					var content = $compile($scope.html)($scope);
					element.html(content);
				}		

				if($scope.tipo=='htmlView'){


					var content = $compile($scope.html)($scope);
					element.append(content);
				}	

				else if($scope.tipo=='checkbox'){

					element.attr('type',"checkbox");
					element.attr('class','checkbox');

				}

				else if($scope.tipo=='popover'){

					var button = $compile('<button style="z-index:99999"  type="button" class="btn btn-primary btn-lg" id="myPopover" data-toggle="popover">HTML Inside Popover</button>')($scope);
					//Função para Abrir Popover
					$(button).popover({
						//placement : 'top',
						title: '<p><strong>Cadastrar Nova Pessoa/Empresa</strong></p>',
						content : '<p style="font-size:9pt">Digite abaixo o nome da Pessoa/Empresa que deseja cadastrar.</p><div class="form-group"><input class="form-control" placeholder="Digite o nome da Pessoa/Empresa"/></div><div class="form-group"><button class="btn btn-danger pull-left" onclick="$(&quot;#myPopover&quot;).popover(&quot;hide&quot;);" >Fechar</button><button class="btn btn-primary pull-right">Salvar</button></div><div class="row"></div',
						html: true
					}); 
					element.append(button);  
				}



				else  if($scope.tipo=='tel'){

					element.attr("type","tel");
					element.mask("(99) 9999-9999?9");
				}

				else if($scope.tipo=='cpf'){
					element.mask("999.999.999-99");
				}

				else if($scope.tipo=='cnpj'){

					element.mask("99.999.999/9999-99");
				}

				//Nomes proprios
				else if($scope.tipo=='upper'){


					$(element).keyup(function(){

						this.value = this.value.toLocaleUpperCase();
						ctrl.$setViewValue(this.value.toLocaleUpperCase());
					});


				}


				else if($scope.tipo=='money'){

					/*
					element.attr("type","tel");
					element.bind("keyup",function(){

                    var valor = ctrl.$viewValue;

						if(valor<100 && valor.indexOf(".")==-1){


						}else{

							valor  = valor.replace(".","");
							valor  = valor.replace(" ","");
							valor = valor/100;
						}


						ctrl.$setViewValue(valor);

						$scope.$apply();

					});


					element.maskMoney();

					 */
				}

				else if($scope.tipo=='monthPicker'){

					element.datepicker( {

						onSelect:function(value){
							showButtonPanel: true
						}


					});

					element.bind('click',function(){

						ctrl.$setViewValue(element.val());
						ctrl.$render();
					});

				}


				if($scope.tipo=='time'){

					element.datepicker({
						dateFormat: 'HH:mm:ss',
						"z-index":9999,
						onSelect: function (date) {
							ctrl.$setViewValue(date);
						}
					});
				}

				if($scope.tipo=='data'){

					var format = $scope.dateFormat;



					$(element).focus(function(){

						this.blur();
					});


					if(format && format=='MM/yyyy'){

						element.MonthPicker();

					}

					else {

						element.datepicker({
							dateFormat: 'dd/mm/yy',
							"z-index":9999,
							onSelect: function (date) {
								ctrl.$setViewValue(date);
							}
						});


					}

				}



				element.bind("keyup",function(value){

					if($scope.tipo=='data')	{

						ctrl.$setViewValue(_formatDate(ctrl.$viewValue));

						ctrl.$render();

					}

				});

				//Interceptador de Valores
				ctrl.$parsers.push(function(value){

					if($scope.tipo=='data')
						value = $filter("date")(value,"dd/MM/yyyy");

					else if($scope.tipo=='time')
						value = $filter("date")(value,"HH:mm:ss");


					return value;
				});

				//Filtros
				ctrl.$formatters.push(function(value){

					if($scope.tipo=='data'){
						value = $filter("date")(value,"dd/MM/yyyy");
						ctrl.$setViewValue(value);
						ctrl.$render();
					}

					else if($scope.tipo=='time'){
						value = $filter("date")(value,"HH:mm:ss");
						ctrl.$setViewValue(value);
						ctrl.$render();
					}




					return value;

				});


				//Formatação de datas
				var _formatDate = function(data){

					data = data.replace(/[^0-9]+/g,"");

					if(data.length>2){
						data = data.substring(0,2) +"/" +data.substring(2); 
					}

					if(data.length >5){
						data = data.substring(0,5) +"/" +data.substring(5,9); 
					}

					return data;

				}

			}


		}


	})

})();

"use strict";
(function(){

	angular.module("adm") 

	.controller("estadosCidadesController",function(stService,stUtil){

		var vm = this;

		vm.loadingEstados = true;
		stService.executeGet("estadoscidades/get-estados").success(function(data){

			vm.loadingEstados = false;
			vm.estados= data.itens;

			//Se a uf estiver definida, o estado no model é setado
			if(vm.uf){

				var index = stUtil.buscaOb(vm.estados,vm.uf,"uf");
				vm.estado = vm.estados[index];
				vm.changeEstado({uf:vm.uf});

			}

		});

		vm.changeCidade = function(cidade){

			vm.uf =cidade.uf;
			vm.codigoMunicipio = cidade.codigoMunicipio;
			vm.nomeMunicipio = cidade.nome;
			vm.codigoUf = vm.estado.codigoUf;
		}

		vm.changeEstado = function(estado){

			vm.loadingCidades = true;

			stService.executeGet("estadoscidades/get-cidades",{uf:estado.uf}).success(function(data){

				vm.loadingCidades = false;

				vm.cidades= data.itens;

			});
		}

		//Se o código do municipio estiver definido, o municípo completo é recuperado
		if(vm.codigoMunicipio){

			vm.loading = true;

			//Recupera as informações completas da cidade
			stService.executeGet("/estadoscidades/get-cidade",{codMun:vm.codigoMunicipio}).success(function(data){

				vm.cidade = data.item;
				vm.loading = false;
			});

		}
	})

})();

"use strict";

(function(){

	angular.module("adm")
	
	
	.directive("stTopMenu",function(configUtil, stService, $rootScope, $route, $filter, stUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/stTopMenu.html",
			controller:function($scope, $rootScope){
				
				$scope.openConfig = function(){

					configUtil.openConfig();
				}

			}

		}
	})
	

	.directive("stMenu",function(){

		return{
			templateUrl:'global/st-api/st-menu/template-module/stMenu.html',
			scope:{

				itens: "="
			},
			controller:function($scope, $rootScope, $route, $filter, anchorScroll, loginUtil, $location, Fullscreen, $localStorage, stUtil , config){

				$scope.appVersion = config.appVersion;
				
				$rootScope.$on('$routeChangeSuccess', function() {

					var path;

					if($route.current.$$route)
						path = 	$route.current.$$route.originalPath;

					else {
						$location.path("login");
						return;
					}

					if( path=='/cadastro/:login' ||  path=='/login' || path=='/change-password' || path=='/video-apresentacao' || path=='/login-redirect' || path=="/login/:login" || path=="/initial-config")
						$scope.showMenu = false;
					else
						$scope.showMenu = true;

					$scope.clickItemMenu(path);

				});

			

				$scope.clickItemMenu  = function(path){

					path = path.replace("/","");

					var indexItem = stUtil.buscaOb( $scope.itens, path,"path");
					var item = $scope.itens[indexItem] || {};

					$scope.atualPage  = item.label;
					$scope.currentPath = item.path;
					document.title = item.label || 'SierTech - Gestão Fácil';

					//Histórico de navegação
					$scope.routeHistory =   $scope.routeHistory || [];

					//Retira do histórico caso o item seja repetido
					var indexHistory = stUtil.buscaOb(  $scope.routeHistory,item.label,"label");

					if(indexHistory!=-1){

						$scope.routeHistory.splice(indexHistory,1);
					}

					$scope.routeHistory.push(item);
					$location.path(item.path);

				}

				$rootScope.absUrl = $location.$$absUrl;

				$scope.enableFullScreen=function(){

					Fullscreen.all();
				}

				$scope.enableFullScreen();

				$rootScope.menuCollapsed =true;

				$scope.changeCollapse = function(){

					$rootScope.menuCollapsed = ! $rootScope.menuCollapsed;
				}

				if(!$rootScope.usuarioSistema){

					$rootScope.usuarioSistema = $localStorage.usuarioSistema;
				}

				

				//anchor
				$scope.gotoAnchor = function(id) {

					anchorScroll.scrollTo(id);

				};

				$scope.goToPageAnt = function(){

					window.history.back();

				}

				$scope.logOut = function(){

					loginUtil.logOut();

				}

			}	
		}

	})

})();


"use strict";
(function(){

	angular.module("adm") 

	.factory('menuUtil', function($rootScope,$filter, stUtil){

       var _startOnboard = function(scope){
    	
    	   
       }		



		return {

			startOnboard: _startOnboard 
			
		}

	})

})();

"use strict";
(function(){

	angular.module("adm")

	.controller("stControl",function($scope,$rootScope,$route,stService,$location,$stModal,$timeout,stUtil,$filter){

		//Quantidade de itens (lista)
		var maxIni = $rootScope.config.confs.maxItensPage||7;

		//Atributos uteis
		$scope.dataHoje =  $filter("date")(new Date(),"dd/MM/yyyy");

		//Controle de carregamento
		$scope.loadingStatus=false;

		$scope.host = $location.$$host;

		var path  =  $location.$$path;
		var opcoes =  path.match(/\w+/gi);
		var item = {};
		var itens = [];
		var nomeObjeto;
		var idObjeto  = path.match(/\d+/i) || 0;
		var metodo;

		if(opcoes.length==3)
			nomeObjeto=opcoes[1];
		else {
			nomeObjeto=opcoes[0];
		}

		if(idObjeto==0)
			metodo  = opcoes[1] || "get";
		else
			metodo="add";

		//Nome do objeto tratado
		$scope.nomeObjeto = nomeObjeto;
		$scope.loadingStatus=true;

		$timeout(function(){

			if(!$scope.objetos){

				//Se o método for get, recupera a lista de objetos 
				if(metodo=="get") {

					stService.getLikeMap($scope.nomeObjeto,[''],0,maxIni,'').success(function(data){

						$scope.objetos = data.itens;
						$scope.loadingStatus=false

					});
				}
			}

		},900);

		//Se o método for add, recupera o item caso seja fornecido o id
		if(metodo=="add" && idObjeto!=0){

			stService.getById($scope.nomeObjeto,idObjeto).success(function(data){

				$scope.objeto = data.item;
				item = data.item;

			});  
		}

		//Selecionar todos os objetos
		$scope.selecionarTodos = function(sele,objetos){

			for(var i in objetos){
				objetos[i].selecionado=sele;
			}
		}

		//Salvar Todos
		$scope.saveAll = function(objetos){

			for(var i in objetos){

				if(objetos[i].selecionado)
					$scope.save(objetos[i],null,null,true);
			}
		}

		$scope.save  = function(objeto,nextLink,reqs,attrUnique){

			$scope.savingStatus=true;

			//Adicionar atributos ao objeto de acordo com a tab
			if($scope.activeTab){

				var appends  = $scope.activeTab.objectAppend;

				for(var key in appends){

					objeto[key] = appends[key];

				}

			}

			if(!objeto)
				$stModal.show({mensagem:"Preencha os campos corretamente."});

			//Valiação dos Campos
			for(var i in reqs){

				if(!objeto[reqs[i]] && reqs[i]!='id'){

					$stModal.show({mensagem:"O campo "+reqs[i]+" está vazio."});
					return;

				}

			}

			if(attrUnique){

				var query = attrUnique+"='"+objeto[attrUnique]+"'";
				console.log("Query: "+query);
				stService.getLikeMap($scope.nomeObjeto,[query],0,0,"").success(function(data){

					if(data.itens.length>0){
						stUtil.showMessage("","Já existe um registro com '"+objeto[attrUnique]+"' cadastrado no sistema","danger");
						return;
					}
					else {
						saveObject(objeto,nextLink);
					}

				});
			}

			else{

				saveObject(objeto,nextLink);
			}

		}

		$scope.getLike = function(query,propriedade){

			$scope.loading=true;

			if(!query)
				query="";

			console.log("Prop: "+propriedade);

			if(!propriedade)
				propriedade="nome";

			stService.getLike($scope.nomeObjeto,query,propriedade).success(function(data){

				$scope.objetos = data.itens;
				itens = data.itens;

				$scope.loading=false;
			});

		}

		//Máxima de itens por pagina
		$scope.setMaxIni = function(max){

			maxIni = max;

		}

		$scope.getLikeMap = function(qs,pagina,max,extra,orderBy,ordem){

			$scope.loadingStatus=true;

			if($scope.fixQuerys)
				qs =	qs.concat($scope.fixQuerys);

			//Query do bloco direito
			if($scope.rightQuery)
				qs.push($scope.rightQuery);

			//Adicionando ordenacao
			if(orderBy && orderBy!=null){
				if(!extra)
					extra="";
				extra+=" order by "+orderBy+" "+ordem;

			}

			if(!qs || qs.length==0  )
				qs =[""];

			stService.getLikeMap($scope.nomeObjeto,qs,pagina,max, extra).success(function(data){

				$scope.countAll = data.countAll;//Quantidade total de itens independente da paginação
                $scope.objetos = data.itens;
				itens = data.itens;
				$scope.loadingStatus=false;

			});

		}

		$scope.disableObject = function(objeto,callback,message){

			objeto.disable=1;

			stService.save($scope.nomeObjeto,objeto).success(function(data){

				stUtil.showMessage("",message||'Item removido com sucesso!',"info");
				callback(data);

			});
		} 

		$scope.apagar =  function(objetos){

			var ids =[];
			var selecionados = objetos.filter(function(ob,index){

				if(ob.selecionado){
					ids.push(ob.id);
					objetos.splice(index,1);
				}
			});

			if(ids.length==0){

				stUtil.showMessage("Nenhum item selecionado.","","danger");
				return;
			}

			stService.apagar($scope.nomeObjeto,ids).success(function(data){

				var msg ="";
				if(ids.length>1)
					msg="Itens excluidos com sucesso!";
				else
					msg="Item excluido com sucesso!";

				stUtil.showMessage("",msg,"success");

			});
		}

		$scope.getLink = function(pagina){

			if(pagina=='comanda')
				return $location.$$host+":1220/Albar/comanda/index.html#/inicio"

		}

		function saveObject(objeto,nextLink){

			stService.save($scope.nomeObjeto,objeto).success(function(data){

				$scope.objeto = data.item; 

				if(nextLink)
					$location.path(replaceByAttr(nextLink,data.item));

				stUtil.showMessage("","Salvo com sucesso!","success");
				$route.reload();
				$scope.objeto={};

			});

		}

	});

	//Replace no formato 'abcdefghijklmno[attr]'
	function replaceByAttr (string,item){

		var pattern  = new RegExp(/\[[a-z]+\]/);
		var atributo  = pattern.exec(string);
		var attr = atributo[0];
		attr = attr.replace("[","");
		attr  = attr.replace("]","");
		string = string.replace(pattern,item[attr]);
		return string;

	}

})();

"use strict";
(function(){

	angular.module("adm")

	.factory("stService",function($http, config, $cookieStore){

		//Opções
		var _saveOp  = function(descricao,valor){

			var req ={
					header : {'Content-Type' : 'application/json; charset=UTF-8'},
					method:"GET",
					params:{
						descricao:descricao,
						valor:valor
					}
			};
			return $http.get(config.baseUrl+"opcao/add",req);

		};	

		//Ooções Complexas
		var _getOpsOthers  = function(nomeObjeto,query){

			var req ={
					header : {'Content-Type' : 'application/json; charset=UTF-8'},
					method:"GET",
					params:{
						tabela:tabela,
						condicao:condicao
					}
			};
			return $http.get(config.baseUrl+"opcao/get/others",req);

		};	

		var _save  = function(nomeObjeto,objeto){

			return $http.post(config.baseUrl+nomeObjeto+"/add/",objeto);

		};

		var _getById =  function(nomeObjeto,id){

			var req ={

					method:"GET",
					params:{id:id}
			};
			return $http.get(config.baseUrl+nomeObjeto+"/get",req);
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

			return $http.get(config.baseUrl+"opcao/get-values",req);
		};

		var _apagar = function(nomeObjeto,ids){

			return $http.post(config.baseUrl+nomeObjeto+"/delete/",ids);
		};

		var _getLike =  function(nomeObjeto,queryBusca, prop){

			var req ={

					method:"GET",
					params:{query:queryBusca,propriedade:prop}
			};

			return $http.get(config.baseUrl+nomeObjeto+"/busca/",req);
		};

		var _getLikeMap =  function(nomeObjeto,qs,pagina,max, extra){

			var req ={

					method:"GET",
					params:{qs:qs,pagina:pagina,max:max, extra: extra}
			};

			return $http.get(config.baseUrl+nomeObjeto+"/busca/map",req);
		};

		var _getAll =  function(nomeObjeto){
			var req ={

					method:"GET",

			};

			return $http.get(config.baseUrl+nomeObjeto,req);
		};

		var _executePost = function(url,objeto){

			return $http.post(config.baseUrl+url,objeto);
		};

		var _executeGet =  function(url,params){

			var req ={

					method:"GET",
					params:params
			};

			return $http.get(config.baseUrl+url,req);
		};

		//Projeções utilizando Control do próprio objeto
		var _getProjecoesFromObject = function(objeto,ops){

			ops.extra = ops.extra||'';
			ops.qs = ops.qs||[''];
			ops.max = ops.max||0;

			var req ={

					method:"GET",
					params:ops
			};

			return $http.get(config.baseUrl+objeto+"/projecoes",req);

		}

		var _getProjecoes = function(ops){

			ops.extra = ops.extra||'';
			ops.qs = ops.qs||[''];
			ops.max = ops.max||0;

			return $http.post(config.baseUrl+"projecao/get-projecoes/",ops);

		}

		return {

			getLikeMap: _getLikeMap,
			getLike: _getLike,
			getAll : _getAll,
			save: _save,
			apagar :_apagar,
			getById: _getById,
			getValues: _getValues,

			getProjecoes:_getProjecoes,
			getProjecoesFromObject:_getProjecoesFromObject,

			//Outros
			executePost:_executePost,
			executeGet:_executeGet,

		};

	})

})();

"use strict";
(function(){

	angular.module("adm") 

	.factory("loginUtil",function(cacheGet,$localStorage,$rootScope,$cookieStore,stService,filialUtil, $location, dateUtil, $uibModal, st){

		var _openModalDateErro = function(){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-api/app-login/template-module/modalDateErro.html",
				size:'lg',
				controller:function($scope){

				}
			});

		}

		var _openLembrarSenha = function(){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-api/app-login/template-module/modalLembrarSenha.html",
				size:'lg',
				bindToController:"true",
				controllerAs:"vm",
				controller:function(stService, stUtil, $modalInstance){

					var vm = this;
					vm.step=1;
					vm.numero = $localStorage.usuario;
					vm.fechar = function(){
						 $modalInstance.close();
					}
					vm.lembrarSenha = function(_numero){
						
						stService.executeGet("/lembrar-senha-sms", {numero: _numero}).success(function(res){
							
							if(res==true)
								vm.step=2;
							else{
								stUtil.showMessage("","Usuário inexistente no sistema","danger");
							}
							
						});
					}
				}
			});

		}



		var _logOut = function() {
			delete $rootScope.user;
			delete $rootScope.authToken;
			delete $rootScope.usuarioSistema;
			delete $localStorage.senha;
			$cookieStore.remove('authToken');
			$cookieStore.remove('usuarioSistema')
			$location.path("/login");
		};

		var _configureSystemForUser = function(loginData, callback){

			//Token de acesso gerado pelo back-end
			var authToken = loginData.token;
			$rootScope.authToken = authToken;
			$cookieStore.put('authToken', authToken);

			//Informações do usuário logado
			var usuarioSistema = loginData.usuarioSistema;
			usuarioSistema.originalLogin = usuarioSistema.login;
			usuarioSistema.login = usuarioSistema.login.split('@')[0];
			$rootScope.usuarioSistema = usuarioSistema;
			$rootScope.config = loginData.config;
			$cookieStore.put('usuarioSistema', usuarioSistema);

			//Filiais disponíveis no sistema
			filialUtil.getAllFiliais(function(filiaisReturn){

				if(!filiaisReturn){
					callback();
					return;
				}


					var idFilialInConfig = parseInt($rootScope.config.confs.currentFilialId);
					var nomeFilial = $rootScope.config.confs.labelCurrentFilial;

					var filiaisPermitdas = [];
					
					if($rootScope.usuarioSistema.filiaisPermitidas)
						filiaisPermitdas = $rootScope.usuarioSistema.filiaisPermitidas.split(",");
					
					if(idFilialInConfig>0 && filiaisPermitdas.indexOf(idFilialInConfig+"")!=-1 ){
						$rootScope.currentFilial = {id: idFilialInConfig, xNome: nomeFilial};
					}
					else if(filiaisPermitdas[0]) {
						
						$rootScope.currentFilial = filialUtil.getFilialById(parseInt(filiaisPermitdas[0]));
					}

					callback(loginData);

			});

		}

		var _logar = function(login, lembrarSenha, callback){

			$localStorage.empresa = login.empresa;
			$localStorage.usuario = login.usuario;

			if(lembrarSenha==true)
				$localStorage.senha = login.senha;
			else{

				delete  $localStorage.senha;
			}

			//remove o token antigo
			$cookieStore.remove('authToken');

			stService.executePost("/user/login/", login).success(function(data){

				//Verifica se a data do computador é a mesma do backend
				var dataFrontEnd  = dateUtil.getDate(new Date());
				var dataBackEnd = dateUtil.getDate(data.dataBackEnd);

				if(dataFrontEnd.getTime() != dataBackEnd.getTime()){

					st.evt({evento:"data_frontend_errada",descricao:"data_usuario_errada", descricao:"data do backend: "+dataBackEnd+", data do frontend: "+dataFrontEnd});
					_openModalDateErro();
					callback();
					return;
				}

				_configureSystemForUser(data, callback);

			}).error(function(data,erro){

				callback();

			});

		}

		var _isLogado = function(){

			if($rootScope.usuarioSistema)
				return true;
			else
				return false;
		}

		return{
			logar: _logar,
			logOut:_logOut,
			isLogado: _isLogado,
			openLembrarSenha: _openLembrarSenha

		}
	})

})();

"use strict";

(function(){

	angular.module("adm")

	.factory("filialUtil",function(stService,$rootScope,$localStorage,stUtil,st,$uibModal,$http,config){

		//Abre os detalhes da filial para edição
		var _openDetalheCurrentFilial= function(filial,callback){

			$uibModal.open({
				animation: true,
				templateUrl:'global/st-api/app-filial/template/modalDetalheFilial.html',
				size:'lg',
				controller:function($scope,$rootScope){

					$scope.filial = $rootScope.currentFilial;

					$scope.fechar = function(ele){

						ele.$dismiss('cancel');
						callback($scope.filial);

					}

					//Envio do certificado digital
					$scope.enviarCertificado = function(file,senha) {

						var fd = new FormData();
						fd.append('file', file);
						fd.append('senha',senha);
						$http.post(config.baseUrl+"filial/upload-certificado/", fd, {
							transformRequest : angular.identity,
							headers : {
								'Content-Type' : undefined
							}
						}).success(function(data) {

							$rootScope.currentFilial.nomeCertificado = data.item;
							$scope.filial.nomeCertificado = data.item;
						}).error(function() {

						});
					}

					$scope.salvar = function(filial){

						stService.save("filial",filial).success(function(data){

							stUtil.showMessage("","Salvo com sucesso","info");	

							if(callback)
								callback(data.item);
						});

					}

				}
			});
		}

		var _getAllFiliais = function(callback){

			stService.getAll("filial").success(function(data){

				var filiais = data.itens;

				//Empresa com mais de uma filial
				if(filiais.length>0){

					$rootScope.filiais = filiais;
					$rootScope.filiais.unshift({id:0,xNome:"Todas"});
					$rootScope.currentFilial = 	$localStorage.currentFilial || data.itens[0];

				}

				//Empresa sem filiais
				else{
					$rootScope.filiais  = [{id:1,xNome:"Matriz"}];
					$rootScope.currentFilial = {id:1,xNome:"Matriz"};
				}

				if(callback)
					callback(data.itens);

			}).error(function(){
				
				callback();
			});

		}

		var _getFilialById = function(id){

			var filial ={};

			var index = stUtil.buscaOb($rootScope.filiais,id,"id");

			if(index!=-1)
				filial = $rootScope.filiais[index];

			return filial;

		}

		return {

			getFilialById:_getFilialById,
			getAllFiliais:_getAllFiliais,
			openDetalheCurrentFilial: _openDetalheCurrentFilial
		}

	})

})();


"use strict";
(function(){

	angular.module("adm")

	.controller("changeFilialController",function($scope, $rootScope, $localStorage, cacheGet, $route, filialUtil, stUtil,stService,  configUtil, $modalInstance){

		
		stService.executeGet("/operadorsistema").success(function(data){
			
			$scope.operadores = [{id:0, nome:"Todos"}];
			$scope.operadores = $scope.operadores.concat(data.itens);
			$scope.operadorEsc = 	$rootScope.currentOperador || $scope.operadores[0];
			
		});
		
		
		
		$rootScope.$watch("filiais",function(filiais){

			if(filiais){
				$scope.filiais = filiais;
				$scope.filialEsc  = $rootScope.currentFilial ||  filiais[0];
			}
			
			$scope.filiaisPermitidas = null;

			if($rootScope.usuarioSistema.filiaisPermitidas)
				$scope.filiaisPermitidas= $rootScope.usuarioSistema.filiaisPermitidas.split(",");
		});

		$scope.config = $rootScope.config;
		$scope.filiais =$rootScope.filiais;
		$scope.currentFilial = $rootScope.currentFilial;

		//Abre detalhes de um filial
		$scope.openDetalheFilial = function(filial){

			filialUtil.openDetalheFilial(filial);
		}

		$scope.fecharModal = function(){
			
			$modalInstance.close();
		}
		
		//Altera a filial atual do sistema
		$scope.alterarFilialAndOperador = function(filial, operador){

			

			if(filial.bloqueada==1){

				stUtil.showMessage("","A origem '"+filial.nome+"' está bloqueada.","danger");
				return;
			}

			if($scope.filiaisPermitidas!=null && $scope.filiaisPermitidas.indexOf(filial.id+"")==-1){

				stUtil.showMessage("","A origem '"+filial.nome+"' não está disponível para este usuário","danger");
				return;
			}

			
			$scope.currentFilial = filial;
			$rootScope.currentFilial = filial;
			$localStorage.currentFilial = filial;
			$rootScope.currentOperador = operador;
			$localStorage.currentOperador = operador;

			configUtil.setConfig("currentFilialId",filial.id+"");
			configUtil.setConfig("labelCurrentFilial",filial.xNome);


			//atualizar caches
			cacheGet.getOfflineCache(function(){

				stUtil.showMessage("","Origem alterada para  '"+filial.nome || filial.xNome+"'.","info");

				if($scope.inModal!=true)
					$route.reload();

			});

		}

	});

})();

"use strict";
(function(){

	angular.module("adm")
    
	.directive("buttonFilial",function(filialUtil, $uibModal){

		return{
			templateUrl:"global/st-api/app-filial/template/buttonFilial.html",
			scope:{
				inModal:"="//Indica se está setada dentro de um modal (Para não charmar $route.reload())
				
			},

			controller:function($scope, $rootScope, $timeout){
				
				$timeout(function(){
					$scope.currentFilial = $rootScope.currentFilial;

					
				},300);
				
				$rootScope.$watch("currentFilial",function(currentFilial){

					if(currentFilial)
						$scope.labelCurrentFilial = currentFilial.xNome;
				});
				
				
				$rootScope.$watch("currentOperador",function(currentOperador){

					if(currentOperador)
						$scope.currentOperador= currentOperador;
				});
				
				$scope.openChangeFilial = function(){
					
					$uibModal.open({
						animation: true,
						templateUrl:"global/st-api/app-filial/template/openChangeFilial.html",
						size:'md',
						controller:"changeFilialController"
						
					});
					
				}
			}
			
		}

	})
	
	.directive("buttonFilialListWithModal",function($uibModal){

		return{
			restric:"E",
			templateUrl:"global/st-api/app-filial/template/buttonFilialListWithModal.html",
		    controller: function ($scope, $rootScope){
				
				   $scope.currentFilial = $rootScope.currentFilial;
				   $rootScope.$watch("currentFilial",function(currentFilial){

						if(currentFilial)
							$scope.labelCurrentFilial = currentFilial.xNome;
					});
				   $scope.config = $rootScope.config;

					$scope.open = function(){
						
						$uibModal.open({
							animation: true,
							templateUrl:"global/st-api/app-filial/template/filialListWithModal.html",
							size:'lg',
							controller: function($scope, $modalInstance){
								
								$scope.fechar = function(){
									
									console.log("Chamou");
									$modalInstance.close();
								}
								
							}
							
						});
						
					}
				
			}
			
		}

	})
	
	.directive("alertFilial",function(filialUtil){

		return{
			templateUrl:"global/st-api/app-filial/template/alertFilial.html",
			scope:{
				label:"="
			},
			controller:function($scope,$rootScope){
				
				$scope.currentFilial = $rootScope.currentFilial;
			}

		}

	})
	
	.directive("setAllFilials",function(filialUtil){

		return{
			templateUrl:'global/st-api/app-filial/template/setAllFilials.html',
			scope:{
				objeto:"=",
				defaultValue:"=",//true ou false
			},
			controller :function($scope,$rootScope){
				
				
				console.log("defaultValue antes: ");
				console.log(angular.copy($scope.defaultValue));
				
				if($scope.defaultValue=="true")
					$scope.defaultValue = true;
				else if($scope.defaultValue=="false")
					$scope.defaultValue=false;
				
				$scope.filiais = $rootScope.filiais;
			
				if(!$scope.objeto)
					$scope.objeto  = {allFilials:true};
				
				if(!$scope.objeto.id){
					$scope.objeto.allFilials = $scope.defaultValue || false;
					console.log("defaultValue: ");
					console.log($scope.defaultValue);
				}
				
			}
		
		}
	
	})

})();



"use strict";
(function(){
angular.module("adm").controller("cadastrosController",function($scope,stService,$rootScope,stUtil,$filter,cadastrosUtil){


	$scope.apagar = function(op,index){


		stService.apagar("opcao",[op.id]).success(function(){
			$scope.opcoes.splice(index,1);
		});
	}

	$scope.openCadastro = function(cadastro){
		cadastrosUtil.openCadastro(cadastro,function(item){

			$scope.getOpcoes($scope.descricao,$scope.label);

		});

	}

	$scope.getOpcoes = function(descricao,label){

		$scope.label = label;//Label a ser exibido ex: "Categorias de conta a pagar"
		$scope.descricao = descricao;//descricao usada na tabela correspondente do banco de dados, ex: 'categoria_conta_pagar'

		stService.getLikeMap("opcao",["descricao='"+descricao+"'"],0,0,'').success(function(data){

			$scope.opcoes = data.itens;
		});

	}

});
})();

"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/cadastros",{

		templateUrl:"global/st-api/cadastros/template-route/cadastros.html",
		controller:"cadastrosController"

	}); 

})
})();



"use strict";
(function(){

	angular.module("adm") 

	.factory('cadastrosUtil', function($rootScope,$filter, stUtil,$uibModal){

		var	_openCadastro = function(cadastro,callback){

			var _modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:"global/st-api/cadastros/template-module/detalheCadastro.html",
				size:'lg',
				controller:function($scope,stService,stUtil){

					$scope.cadastro = cadastro;

					$scope.fechar = function(modal){

						modal.$dismiss("");

					}

					$scope.salvar = function(cadastro,modal){

						stService.save("opcao",cadastro).success(function(data){

							stUtil.showMessage("","Opção adicionada com sucesso!","info");
							modal.$dismiss("");
							callback(data.item);

						});

					}

				}

			});

		}

		return {

			openCadastro:_openCadastro

		}

	})

})();

"use strict";
(function(){

	angular.module("adm")

	//Configurações do sistema
	.factory("configUtil",function($http, config, $uibModal,stService,$rootScope,stUtil,$localStorage){

		var _getConfig = function(callback){

				stService.getAll("config").success(function(data){
					$rootScope.config = data.itens[0];
					$localStorage.config = data.itens[0];
					callback($rootScope.config);
				});
			
		}

		//Altera deterinada configuração isoladamente
		var _setConfig = function(key,value,callback){

			var config = $rootScope.config;

			var confs = $rootScope.config.confs;

			confs[key] = value;

			config.confs = confs;

			stService.save("config",config).success(function(data){

				$rootScope.config=data.item;

				if(callback)
					callback(data.item)

			});

		}


		var _openConfig = function(tab, callback){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-api/app-config/template-module/config.html",
				size:'lg',
				controller:function($scope){

					$scope.activeTab = tab|| 0;

					//Módulos disponiveis
					$scope.modulos = [{nome:"Pessoas"},{nome:"Logística Reversa"},{nome:"Controle de Ponto"},{nome:"Estoque"},{nome:"Financeiro"},{nome:"Ferramentas"},{nome:"Relatorios"}];

					//Componentes de relatório
					$scope.itensRelatorio = [
					                         {label:"Balanço",value:"balanco"},
					                         {label:"Lançamentos anteriores baixados",value:"lancamentos_anteriores_baixados"},
					                         {label:"Lucro por período (Mensal)",value:"lucro_periodo_mensal"},
					                         {label:"Produtos mais vendidos",value:"produtos_mais_vendidos"},
					                         {label:"Faturamento por produto",value:"faturamento_por_produto"},
					                         {label:"Despesas por categoria",value:"despesas_por_categoria"}
					                         ];


					$scope.config = $rootScope.config;

					console.log("Config do rootScope: ");
					console.log($scope.config);

					//Garante que o id seja sempre=1
					$scope.config.id=1;

					//Módulos 
					var mds = $scope.modulos;

					//Módulos configurados para o usuário
					var mdsUser = [];


					//Relatórios configurados para o usuário
					var itensRelatorio = [];

					var itensRelatorioScope = $scope.itensRelatorio;

					if(!$scope.config.confs)
						$scope.config.confs = {};

					if($scope.config.confs.modulos)
						mdsUser = $scope.config.confs.modulos.split(",");

					if($scope.config.confs.itensRelatorio)
						itensRelatorio = $scope.config.confs.itensRelatorio.split(",");

					for(var i in mds){
						if(stUtil.buscaOb(mdsUser,mds[i].nome)!=-1)
							mds[i].selecionado=true;
					}

					for(var j in itensRelatorioScope){
						if(stUtil.buscaOb(itensRelatorio,itensRelatorioScope[j].value)!=-1)
							itensRelatorioScope[j].selecionado=true;
					}

					$scope.modulos = mds;
					$scope.itensRelatorio = itensRelatorioScope;

					$scope.salvar = function(){

						var conf = $scope.config;
						
						//Itens do relatório
						var its = $scope.itensRelatorio;
						var itensRelatorio = "";
						for(var j in its){

							if(its[j].selecionado==true)
								itensRelatorio+=its[j].value+",";
						}
						conf.confs.itensRelatorio = itensRelatorio;

						//Módulos
						var mds="";
						for(var i in $scope.modulos){

							if($scope.modulos[i].selecionado==true)
								mds+=$scope.modulos[i].nome+",";

						}
						conf.confs.modulos = mds;

						stService.save("config",conf).success(function(data){

							stUtil.showMessage("","Salvo com sucesso!","info");
							console.log("Config salvo: ");
							console.log(data.item);
							$rootScope.config=data.item;

						});

					}
					$scope.fechar = function(ele){

						ele.$dismiss('cancel');
						callback($scope.objeto);

					}

				}
			});
		};
		return {

			openConfig:_openConfig,
			getConfig: _getConfig,
			setConfig: _setConfig
		};

	})

})();

"use strict";
(function(){
	
	angular.module("adm")
	
	.directive('buttonOpenConfig', function(configUtil) {
		return {
			templateUrl:"global/st-api/app-config/template-module/button-config.html",
			
			scope:{
				activeTab:"=",
				label:"=",
				extraClass:"="
			},
			controller: function($scope){
				
				$scope.open = function(){
					
					configUtil.openConfig($scope.activeTab||0);
				}
			}
		}
	})	

})();

"use strict";
(function(){

	angular.module("adm") 

	//Filtro Complexo
	.directive("stFilterMap",function($compile, $filter, $rootScope){

		return {
			templateUrl:'global/st-api/st-filter-map/template-module/stFilterMap.html',
			restrict:"AE",
			scope:{

				filtros:"=",//Filtros do tipo String
				filterMapInstance:"=",
				querys:"=",//Querys para binds
				extra:"="//Query extra a ser aplicado no getLikeMap

			},
			controller:function($scope,stUtil){
				
				if(!$scope.extra)
					$scope.extra = "";

				//Alteração de querys Bindadas
				$scope.$watch('querys',function(value){

					$scope.aplicarFiltros(null,0,$rootScope.config.confs.maxItensPage||7,$scope.orderBy,$scope.orderType);

				});

				if($scope.filtros)
					$scope.infoBusca = $scope.filtros[0];

				//Atributos uteis
				$scope.dataHoje =  $filter("date")(new Date(),"dd/MM/yyyy");

				//Definição de valores padrão
				$scope.pagina=0;
				$scope.max = $rootScope.config.confs.maxItensPage||7
				$scope.qs=[];
				$scope.orderBy;
				$scope.ordem="DESC";
				$scope.objectFilter={};

				$scope.limparFiltros = function(){

					$scope.objectFilter = {};

				}

				$scope.atualizar = function(){

					$scope.aplicarFiltros(null,0,$scope.max);
				}

				$scope.changeInfoBusca = function(info){

					$scope.infoBusca = info;

				}

				//Busca Especial
				$scope.buscar = function(info){

					//$("#busca").blur();
					stUtil.disableFocus();
					var objectFilter ={};

					if(info)
						objectFilter[info.attr] = info.value;

					$scope.aplicarFiltros(objectFilter,0,$scope.max);

				}

				$scope.setPagina = function(pagina){

					$scope.pagina=pagina;
					$scope.$parent.getLikeMap($scope.qs,$scope.pagina,$scope.max,$scope.extra,$scope.orderBy,$scope.ordem);

				}

				$scope.aplicarFiltros = function(objectFilter,pagina,max,orderBy,ordem,interceptFilter){

					$scope.pagina=0;

					//Se for id, aplica-se as querys ignorando os outros valores
					if(objectFilter && objectFilter.id && objectFilter.id.length>0){

						//Aplica as Querys
						$scope.$parent.getLikeMap(["id = "+objectFilter.id],$scope.pagina,max,$scope.extra,orderBy,ordem);
						return;

					}

					var obs = {};

					for(var key in objectFilter){

						obs[key] = objectFilter[key];
					}

					//Reseta as querys anteriores
					$scope.qs = [];
					var query;
					for(var key in obs){

						query = "";

						if(typeof obs[key]=='string' && obs[key].match(/\d{2}\/\d{2}\/\d{4}/)){

							var dataDe = obs[key] || "01/01/0000";
							var dataAte = obs[key+'_ate'] || "01/01/3000";
							key =  key.replace(/_ate/g,"");
							query = key+" between '"+stUtil.formatData(dataDe)+"' and '"+stUtil.formatData(dataAte)+"'";
							delete  obs[key+'_ate'];

						}

						//Para Números
						else if( typeof obs[key]=='string' && obs[key].match(/[\d]+\.[\d]+$/)){

							var de;
							var ate;

							if( key.match(/[\w]+_ate/)){

								ate = obs[key];

							}
							else{

								de  = obs[key]; 
							}

							de = de || 0;
							ate = ate || 90000000000;
							key = key.replace(/_ate/g,"");
							query = key+" between "+de+" and "+ate;

						}
						else if(obs[key].toString().length>0){

							var valor=obs[key];
							var operador="";

							if(typeof valor=='string'){
								valor="'%"+valor+"%'";
								operador="like";
							}
							else if(valor==true){
								valor = 1;
								operador="=";
							}
							else if(valor==false){

								valor = 0;
								operador="=";
							}
							else{
								operador="=";
							}

							query = key+" "+operador+" "+valor;	

						}

						if(query.length>0)
							$scope.qs.push(query);

					}

					//Adiciona as querys bindadas (Se houver)
					if($scope.querys){
						$scope.qs = $scope.qs.concat($scope.querys);
					}

					if(!$scope.qs || $scope.qs.length==0)
						$scope.qs = [''];
					
					//Adciona filtros de data a $scope.qs

					if($scope.$parent.getLikeMap)   
						$scope.$parent.getLikeMap($scope.qs,0,max,$scope.extra,$scope.orderBy,$scope.orderType);

				}
			}

		}

	})
})();

"use strict";
(function(){
	angular.module("adm") 

	//Modal em forma de diretiva
	.directive("stTable",function($filter,stService,$q ,$stDetalhe, $timeout, $rootScope,pessoaUtil,$location,$route){
		return {

			templateUrl:'global/st-api/st-table/template-module/stTable.html'
				,
				restrict:"AE",

				scope:{

					filterIntercept:"=",
					labels:"=",//Títulos presentes na tabela de objetos(Origatório) - array de objetos [{attr,label}]
					title:"=",//Título da lista de objetos  - String
					attrUnique:"=",
					reqs:"=",//Atributos obrigatórios no cadastro de itens
					nextLink:"=",//Link para direcionar ao Cadastrar ou salvar no novo objeto
					objetos:"=",
					noCrud:"=",
					tabs:"=",
					teste:"=",
					rightTab:"=",
					cacheOps:"=",
					cadLabel:"=",
					filtros:"=",
					buscaEspecial:"=",
					detalheLink:"=",
					customActions:"=",
					noSave:"=",//se true, o botão salvar não é incluido	  
					htmlActionsPos:"=",
					detalheLink:"=",
					labelPivo:"=",
					tipoObjeto:"=",//Tipo de movimentação padrão no sistema 1 = Despesas, 2 = Receitas
					icon: "@"
				},


				link:function($scope){
					
					//Navegacao atual
					$rootScope.atualPage = $scope.title;

					//Ação padrão para rightTab
					if($scope.rightTab){

						if($scope.rightTab.tipo=='monthPicker'){
							$scope.rightTab.value=new Date();
						}


					}


					//Caso filtros não estejam definidos, assume-se filtros=label 	
					if(!$scope.filtros)
						$scope.filtros=$scope.labels;

					if(!$scope.title)
						$scope.title="Lista";

					if(!$scope.reqs)
						$scope.reqs=transformLabelsToReqs($scope.labels);

					if(!$scope.nextLink)
						$scope.nextLink=null;

					$scope.objeto={};
					$scope.objectFilter={};


					//Ações customizadas
					$scope.executeCustomAction = function(action,ob){

						if(!action.call)
							return;

						$scope.$parent[action.call](ob,function(data){

							ob=data;
							$timeout(function(){

								$scope.getLikeMap([],0,0,"");  

							},500);

						});	
					}

					//Funções definidas para o Label da Tabela
					$scope.bindFunction =function(funcao,ob){

						if(!funcao)
							return;

						$scope.$parent[funcao.call](ob,function(data){

							ob=data;
							$timeout(function(){

								$scope.getLikeMap([],0,0,"");  

							},500);
						});
					}


					//Cadastro de novo item
					$scope.cadItem = function(){

						var objeto = {
								tipo_pessoa:$location.$$path.replace("/","")
						}

						pessoaUtil.openDetalhePessoa(objeto,0,function(){

							console.log("Objeto: ");
							console.log(objeto);
							
							$route.reload();

						});

					}

					$scope.openDetalhe =function(objeto,tab){

						//Abre o detalhe de acordo com o tipo de objeto
						if($scope.tipoObjeto=='pessoa'){
							pessoaUtil.openDetalhePessoa(objeto,tab,function(){


							});
						}

					}

					$scope.deletarItem = function(ob,index){


						$scope.disableObject(ob,function(){

							$scope.objetos.splice(index,1);
						});
					}

					//Tab do lado direiro
					$scope.executeRightTabClick = function(tab){

						if(!tab)
							return;

						$scope.pagina =0;

						var operador = tab.operador||"=";

						if(tab.tipo=='monthPicker'){

							var mes = $filter("date")(tab.value,"MM");
							var ano = $filter("date")(tab.value,"yyyy");
							$scope.rightQuery ="month("+tab.attr+") "+operador+" '"+mes+"' and year("+tab.attr+") "+operador+" '"+ano+"'";
							$scope.getLikeMap([],0,0,"");

						}
					}

					//Executa uma query fixa
					var  _executeFixTabQuery =  function(tab){

						console.log("Pagina ="+$scope.pagina);

						obAppend = tab.objectAppend;

						//Valores pre definidos ao salvar o objeto
						$scope.objectAppend = obAppend;

						//Criar as querys

						var qs = [];

						for(var attr in obAppend){

							var valor = obAppend[attr];

							if(typeof valor== 'string' || typeof valor== 'date')
								valor="'"+valor+"'";

							qs.push(attr+"="+valor);
						}

						$scope.fixQuerys = qs;
						$scope.activeTab = tab;
						console.log("Tab:");
						console.log($scope.activeTab);
						$scope.pagina=0;
						$scope.getLikeMap(qs,0,0,"");

					}

					$scope.executeFixTabQuery =  _executeFixTabQuery;

					if($scope.tabs){
						_executeFixTabQuery($scope.tabs[0]);
					}

					function transformLabelsToReqs(labels){

						var lista =[];

						for(var i in labels)
							lista.push(labels[i].attr);

						return lista;

					}

					$scope.executeRightTabClick($scope.rightTab);

				}
				,

				controller:'stControl',

		}

	}).directive('optionsTable',function(){

		return{
			templateUrl:'view/templates/st-table/optionsTable.html',
			scope:{
				ob:"="
			}
		}

	});

})();

"use strict";
(function(){

	angular.module("adm") 

	.directive('autoCompleteObject', function(stService,$compile,$filter,$log,stUtil,$uibModal,$timeout,$modalStack,cacheGet) {
		return {
			restrict: 'AE',
			require:'ngModel',

			scope:{

				objectOp:"=",//Objeto em caso de chave/valor
				onDemand:"=",
				getCompleteObject:"=",
				label:"=",
				placeHolder:"=",//placeholder de busca
				labelCad:"=",
				placeHolderCad:"=",//place holder de cadastro
				ngModel:"=",
				defaulText:"=",
				initialBusca:"=",//String a ser setada no campo de busca (input)
				extraClass:"=",//Classe css para ser adicionada ao elemento 'input'
				fixProperties:"=",//Propriedades fixas do objeto, usada tanto para cadastros tanto para buscas
				valueOnly:"=",//se true, não seta o objeto inteiro no model, apenas o valor(labels)
				itens:"=",//Itens locais, se houver, as buscas serão efetuadas a partir deles
				subLabel:"=",//Informações adicionais a serem exibidas	e buscadas,
				showSubLabel:"=",
				hideResults:"=",//Esconde os resultados da busca
				autoFocus:"=",//Focus para o elemento input
				showResultsOnFocus:"=",
				idInput:"=",
				resultadoBusca:"=",//Bind para resultados da busca
				useCache:"=",//cacheGet
				autoShowBusca:"="//Mostra a tela de busca automaticamente
			},

			templateUrl:"global/st-api/app-autocomplete/template-module/autoCompleteObject.html",

			link: function($scope, element, attrs,ctrl){

				$scope.$watch('ngModel',function(value){

					if(!value){
						$scope.labelValue="";
					}
				});

				var fix = $scope.fixProperties||[];

				var querys = [];

				for(var key in fix){

					querys.push(key+"='"+fix[key]+"'");
				}

				var nomeObjeto = $scope.objectOp;

				var label = $scope.label;
				var labelCad = $scope.labelCad;
				var onDemand = $scope.onDemand;
				var placeHolder= $scope.placeHolder ||'Digite um valor';
				var lastKeyUp = 0;



				if(!attrs.inline || attrs.inline=='false')	{
					element.bind("click",function(){
						$scope.openBusca();
					});

				}


				$timeout(function(){

					if(!ctrl.$viewValue)
						return;

					var value;

					if($scope.valueOnly){
						value = ctrl.$viewValue;	
					}
					else{
						value = ctrl.$viewValue[label] || ctrl.$viewValue || 'Selecione uma opção';
					}

					$scope.modelValue = value;

				},0);


				function getModelValue(){

					return $scope.modelValue;
				}

				function getInitialBusca(){

					return $scope.initialBusca;
				}
				
			

				function getItens(){

					return $scope.itens;
				}

				function setModelValue(item){
					$scope.modelValue = item[label]||item;
				}

				//Busca de itens
				function buscarItem(valueLabel,callback){

					valueLabel = valueLabel||'';
					$scope.aba = "resultados";

					//Sem Cache (Busca remota)	
					//!$scope.useCache || $scope.useCache==false
					if(!$scope.useCache || $scope.useCache==false)	{

						var query = label+" like '%"+valueLabel+"%'";
						var qs = [];
						qs = qs.concat(querys);
						qs.push(query);
						var objeto = $scope.objectOp;
						objeto = objeto[0].toUpperCase() + objeto.slice(1);
						var subLabel="";
						if($scope.subLabel){

							subLabel =","+$scope.subLabel.attr;

						}

						var ops = {
								qs : qs,	
								columns:"id,"+$scope.label+subLabel||"*",
								groupBy:"id",
								objeto:objeto
						};

						$scope.loadingBusca=true;

						stService.getProjecoes(ops).success(function(data){

							$scope.loadingBusca=false;
							callback(data.itens);

						}).error(function(){

							$scope.loadingBusca=false;
							$scope.messageResult="Ocorreu um erro, tente novamente.";
						});

					} //Fim de !getItens()

					//Busca em cache
					else{

						var ini = new Date();
						var itens = cacheGet.get($scope.objectOp,label,valueLabel);
						itens = jlinq.from(itens)
						.starts(label,valueLabel)
						.select();
						
						var its = [];

						for(var i in itens){

							its.push([itens[i].id,itens[i][label]]);
						}

						callback(its);

					}

				}

			
				function selecionarItem (item){

					if($scope.getCompleteObject==true){
						stService.getById(nomeObjeto,item[0]).success(function(data){

							setValueItem(data.item);
						});
					}
					else{
						var ob = {};
						ob.id = item[0];
						ob[label]=item[1];
						setValueItem(ob);

					}

				}

				function setValueItem(objetoSele){

					var viewValue;

					if($scope.valueOnly==true){
						viewValue = objetoSele[label];	
					}
					else{
						viewValue = objetoSele;
					}

					$scope.modelValue = objetoSele[label];
					setModelValue(objetoSele);
					ctrl.$setViewValue(viewValue);
					$scope.focusBusca =false;
					$scope.labelValue = objetoSele[label];
					$scope.obs =null;
					$scope.aba ="resultados";

				}

				$scope.editarItem = function(){

				}

				$scope.buscarItem = function(labelValue){

					var d = new Date();
					var execute =false;

					if(d.getTime()-lastKeyUp<300){

						lastKeyUp = d.getTime();
						execute = true;
						$timeout(function(){

							if(execute==true)
								executeBuscarItens(labelValue);


						},300);

						return;
					}
					else{

						lastKeyUp = d.getTime();
						executeBuscarItens(labelValue);

					}

				}

				function executeBuscarItens(labelValue){

					buscarItem(labelValue,function(itens){

						if(itens.length==0)
							$scope.messageResult = "Não encontrado '"+labelValue+"'.";
						else
							$scope.messageResult="";

						$scope.obs = itens;
						$scope.resultadoBusca = itens;
					});

				}

				$scope.cadItem = function(value, allFilials){

					cadItem(value,allFilials);

				}
				$scope.selecionarItem = selecionarItem;

				$scope.alterarAba =function(aba){

					$scope.aba = aba;
				}
				

				//Abre o modal de busca
				$scope.openBusca = function(){

					$uibModal.open({
						animation: true,
						templateUrl:"global/st-api/app-autocomplete/template-module/buscaAutoCompleteObject.html",
						size:"lg",
						controller:function($scope, $modalInstance){

							$scope.label = label;
							$scope.labelCad = labelCad;
							$scope.placeHolder=placeHolder;
							$scope.modelValue = getModelValue();
							$scope.initialBusca = getInitialBusca();
							$scope.focusBusca=true;
							
							console.log("initialBusca: "+getInitialBusca());
							
							
							$scope.inputFocus = function(labelValue){

								if($scope.showResultsOnFocus==true)	
									$scope.buscarItem(labelValue);
							}

							$scope.selecionarItem = function(item, modal){

								selecionarItem(item);
								
								$modalInstance.close();

							}

							$scope.cadItem = function(value, allFilials){
								
								
								$scope.salvandoItem = true;

								var ob = {};
								ob[label]= value;

								//Atributos pre-definidos
								for(var k in fix){
									ob[k] = fix[k];	
								}

								//auxItemFilial
								ob["allFilials"]=allFilials;

								var query = label+" = '"+ob[label]+"'";
								var qs = [];
								qs.push(query);
								qs = qs.concat(querys);
								
								console.log("salvandoItem: "+$scope.salvandoItem);

								stService.getLikeMap(nomeObjeto,qs,0,0,"").success(function(data){

									if(data.itens.length>0){
										stUtil.showMessage("","Já existe um registro com '"+ob[label]+"' cadastrado no sistema","danger");
										$scope.salvandoItem = false;
										return;
									}
									else {

										stService.save(nomeObjeto,ob).success(function(data){

											var objeto=[data.item.id,data.item[label]];
											selecionarItem(objeto);
											value="";
											$scope.salvandoItem = false;
											stUtil.showMessage("","'"+ob[label]+"' cadastrado com sucesso!","info");
											$modalInstance.close();
										}).error(function(){

											stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet.","danger");
											$scope.salvandoItem = false;
											$modalInstance.close();
										});
									}

								}).error(function(){

									stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet.","danger");
									$scope.salvandoItem = false;
								});

							
							
							}

							$scope.alterarAba =function(aba){

								$scope.aba = aba;
							}

							$scope.buscarItem = function(valueLabel){
								
								$scope.loadingBusca=true;

								buscarItem(valueLabel,function(itens){

									$scope.loadingBusca=false;

									if(itens.length==0)
										$scope.messageResult = "Não encontrado '"+valueLabel+"'.";
									else
										$scope.messageResult="";
									
									$scope.obs = itens;
								});

							}

							
							//Busca Inicial
							if($scope.initialBusca !=undefined ){

								$scope.buscarItem($scope.initialBusca );
							}

							$scope.fecharModal = function(ele){

								ele.$dismiss("cancel");
							}
						}
					});

				}
				
				if($scope.autoShowBusca==true)
					$scope.openBusca();

				querys = querys.filter(function(value){

					if(value.length>0)
						return value;

				});

			}

		}

	})


})();

"use strict";
(function(){

	angular.module("adm") 

	.directive('modalContent', function($templateCache) {
		return {
			//templateUrl:'global/st-api/st-modal/template-module/modalContent.html',
			templateUrl:'global/st-api/st-modal/template-module/modalContent.html',
			restrict:"E",
			transclude:true,
			scope:{

				titulo: "=",
				iconeTitulo: "=",
				modalInstance: "=",
				labelCloseButton: "=",
				disableOkButton:"=",
				loadingOkAction:"=",
				okAction:"=",
				okActionLabel:"=",
				forceOkActionShowLabel:"=",//se true força a exibição do label presente no okAcion
				okActionIcon:"=",
				cancelAction:"=",
				deleteAction:"=",
				item: "="//Objeto referencia, ex: pdv

			},
			controller:function($scope, $timeout){
				
				
				$scope.disableOkButton = $scope.disableOkButton || false;
				
				$scope.currentStep = 0;

				$scope.cancelAction  =  $scope.cancelAction || function(){

					if($scope.modalInstance)
						$scope.modalInstance.$dismiss("cancel");
				}
				
				
			
		        
		        $scope.localAction = function(){
		        	
		        	console.log("localAction");
		        }
				

			}

		};
	})

	//Modal em forma de diretiva
	.directive("stModal",function($filter){

		return {

			templateUrl:"global/st-api/st-modal/template-module/stModal.html",
			restrict:"AE",
			transclude:true,
			scope:{

				titulo:"@",
				icon:"@",
				idmodal:"@",
				size:"@",
				okIcon:"@",
				okLabel:"@"

			},

			link: function($scope, element, attrs) {

			}

		}

	})

})();

"use strict";
(function(){
	angular.module("adm") 

	//Modal em forma de serviço
	.factory("$stModal",function($uibModal){
		var _showAlert = function(modal){

			$uibModal.open({
				animation: true,
				template:"global/st-api/st-modal/template-module/modalAlert.html",
				controller:function($scope,modal){

					$scope.modal = modal;
					$scope.close = function(){

						modal.dismiss('cancel');
					}

				},
			
			size: 100,

			});

		}

		return {
			showAlert: _showAlert,

		};

	});

})();

"use strict";
(function(){

	angular.module("adm") 

	.directive('stNav',function($timeout){

		return{
			restrict:"E",
			templateUrl:'global/st-api/st-nav/template-module/stNav.html',
			scope:{

				activeTab:"=",
				tabs:"="
			},

			controller:function($scope){

				if(!$scope.activeTab)
					$scope.activeTab=0;

				$scope.alterarTab =function (tab){

					$scope.activeTab = tab;

				}

			}
		}
	})

})();

"use strict";

(function(){

	angular.module("adm")

	.directive("stCheckbox",function(movUtil){

		return{
			templateUrl:'global/st-api/st-checkbox/template-module/stCheckbox.html',
			scope:{
				ngModel:"=",
				label:"=",
				cofirmacao:"="
			},
			
		}

	})

})();


"use strict";

(function(){

	angular.module("adm")

	.directive('cardList', function (){
		return {
			restrict: 'E',
			transclude:true,
			scope:{

				ob:"=",
				pivo:"=",
				editFunction:"=",
				deleteFunction:"=",
				index:"@",
				icon:"@"
				
			},

			templateUrl:'global/st-api/card-list/template-module/cardListDirective.html',
			bindToController:true,
			controllerAs:"vm",
			controller: "cardListController"
		}
	})

})();


"use strict";
(function(){
	angular.module("adm") 

	.controller("cardListController",function(stUtil){

		var vm = this;
	
		console.log("pivo: "+vm.pivo);
		console.log("ob:");
		console.log(vm.ob);
		vm.labelPivo = stUtil.getValueOfNivel(vm.ob,vm.pivo);
		

	})

})();


"use strict";
(function(){
angular.module("adm").config(function($routeProvider, $httpProvider){

	//Inicio
	$routeProvider.when("/prot/:template",{

		templateUrl:"global/st-api/app-prototype/template-route/prototype.html",

		controller: function($scope, $rootScope, $route, stService, $localStorage, $http, loginUtil){
			
			loginUtil.logar({usuario:$localStorage.usuario,empresa:$localStorage.empresa, senha:$localStorage.senha}, true, function(){
				
				$scope.showTemplate=true;
				
				var prot = $route.current.params.template;

				var urlBase = "global/st-api/app-prototype/prots/"+prot+"/";

				var versions = [];

				for(var i =1; i <=10 ;i++){

					versions.push({id: i,  label:"Versão "+i,template:urlBase+i+".html"});

				}

				$localStorage.activeVersion = $localStorage["prot_"+prot]|| versions[0];

				$scope.activeVersion =  $localStorage.activeVersion;

				$scope.changeActiveVersion = function(v){

					$scope.activeVersion = v;
					$localStorage["prot_"+prot] =  v;
				}

				$scope.funcao = function(){

					console.log("!!!!!!!!!!!!!!!!!!!!!!!!");
				}

				$scope.vs = versions;

				angular.forEach($scope.vs, function(v){
					// Here, the lang object will represent the lang you called the request on for the scope of the function
					$http.get(v.template).success(function(){

						v.enable=true;
						console.log("Erro em: "+v.template);

					});
				});
				
			});

		

		}


	}); 

})
})();


"use strict";
(function(){
	angular.module("adm") 

	//Modal em forma de diretiva
	.directive("testUserButton",function(stService, $uibModal, stUtil){
		return {

			restrict:"AE",
			templateUrl:"global/st-api/test-user/template-module/testUserButton.html",
			link:function($rootScope, element, attrs){


				var _openDetalhe = function(){

					$rootScope.testIsOpen=true;

					modal = $uibModal.open({
						animation: true,
						templateUrl:"global/st-api/test-user/template-module/testUserDetalhe.html",
						size:'lg',
						controller: function($scope, $rootScope,  $modalInstance, chronoService, $timeout){


							$scope.$on("modal.closing", function(){

								$rootScope.testIsOpen = false;

							}); 


							var  _getProxTest = function(){

								$scope.carregandoTest = true;
								stService.executeGet("testuser/prox-test").success(function(data){

									
									$rootScope.definition = data.item;
									if(data.item!=null)
									   $("#descricao-teste").html(data.item.descricao);
									$scope.carregandoTest = false;
									
									stService.executeGet("/testuser/saldo-for-user").success(function(data){

										$rootScope.saldoTestes = data.item || 0;

										stService.executeGet("/testuser/total-tests-for-user").success(function(data){

											$rootScope.quantTests = data.item || 0;

										});

									});



								}).error(function(){
									
									$scope.carregandoTest = false;
									stUsilt.showMessage("","ocorreu um erro ao recuperar informações do teste, tente novamente");
									$modalInstance.close();
									
									
								});

							}
							
							$scope.getProxTest =  _getProxTest;
							
							$timeout(_getProxTest, 300);

							$rootScope.voltar = function(){

								$modalInstance.close();
								$rootScope.testIsOpen = false;
							}

							$rootScope.iniciarTeste = function(){

								$rootScope.iniTeste = new Date().getTime();
								$modalInstance.close();
								$rootScope.executandoTeste=true;
								$rootScope.testIsOpen = false;
								chronoService.addTimer('myTimer', { interval: 500 });
								chronoService.start();
								stUtil.showMessage("","O teste foi iniciado!","info");
							}

							$rootScope.finalizarTeste = function(comentario, erroSistema){

								var teste = {};
								teste.definition = $rootScope.definition;
								teste.comentario = comentario;
								teste.tempoGasto =  new Date().getTime() - $rootScope.iniTeste || 0;
								teste.erroSistema = erroSistema;

							

								if($rootScope.definition.queryVerification && $rootScope.definition.queryVerification!=null)
								{

									stService.executeGet("projecao/execute-query", {query:$rootScope.definition.queryVerification}).success(function(data){

									

										if(data.itens.length>0 || erroSistema==1){

											_openDetalheFeedBack(teste);
										}

										else{

											stUtil.showMessage("","Você não executou o teste corretamente, tente novamente ou descreva o erro nos","danger");
										}

									});



								}

								else{
									_openDetalheFeedBack(teste);
								}

							}

							
							
							var _openDetalheFeedBack = function(test){
								
								 $uibModal.open({
										animation: true,
										templateUrl:"global/st-api/test-user/template-module/testeUserResposta.html",
										size:'lg',
										controller: function($scope, $modalInstance){
											  
												$scope.test = test;	
												$scope.salvar  = function(){
													
													if(!$scope.test.nivelDificuldadeFromUser){
														stUtil.showMessage("","Escolha uma opção","danger");
														
														return;
											   }
		
													stService.executePost("testuser/add/", $scope.test).success(function(){
		
														stUtil.showMessage("","Teste executado com sucesso!","info");
														$modalInstance.close();

														$rootScope.executandoTeste=false;

														$rootScope.testIsOpen = false;

														_getProxTest();
														
		
													});
													
												}
									}
								}); 
											
							}



						}

					});

				}

				element.bind("click",function(){

					_openDetalhe();
				});

			}
		}

	})
})();

"use strict";
(function(){
angular.module("adm").config(function($routeProvider, $httpProvider){

	//Lista de todas a movimentações
	$routeProvider.when("/testdefinition",{

		templateUrl:"global/st-api/test-user/template-route/testDefinition.html",
		controller: function($scope, stService, stUtil, $uibModal){
			  
			$scope.openDetalhe = function(definition){
				
				var modal = $uibModal.open({
					animation: true,
					templateUrl:"global/st-api/test-user/template-module/detalheTestDefinition.html",
					size:'lg',
					controller: function($scope, $modalInstance){
						
						$scope.definition = definition || {};
						$scope.salvar = function(){
							
							stService.executePost("testdefinition/add/",$scope.definition).success(function(){
								
								 $modalInstance.close();
								
							});
						}
						
					}
					
				});
			}
			
		}
	
	}); 

})
})();


"use strict";
(function(){

	angular.module("adm") 

	.factory('tutorialUtil', function($rootScope,$filter, stUtil, $uibModal){

		var _openDetalheTutorial = function(tutorialItem){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-api/st-tutorial/template-module/detalheTutorial.html",
				size:'lg',
				controllerAs:"vm",
				bindToController:true,
				controller:function($scope, deviceDetector){

					var vm = this;
					vm.tutorial = tutorialItem;

					if(deviceDetector.isMobile()==true){
                          vm.linkTutorial  =  tutorialItem.linkMobile;
					}
					else{
						vm.linkTutorial  =  tutorialItem.linkDesktop;
					}
					
					var youtubePlayer;

					vm.playerVars = {
							modestbranding:1,
							rel:0,
							start: 30,
							end: 39
					};

					$scope.$on('youtube.player.ready', function ($event, player) {

						youtubePlayer = player;
						youtubePlayer.playVideo();

					});


				}
			});


		}

		return {

			openDetalheTutorial:  _openDetalheTutorial

		}

	})

})();

"use strict";

(function(){

	angular.module("adm")

	//Diretiva para lista de movimentações
	.directive('buttonTutorial', function ($uibModal, tutorialUtil){
		return {
			restrict: 'AE',
			
			link: function(scope, element, attrs) {
			
				element.bind('click', function(){
					
					$uibModal.open({
						animation: true,
						templateUrl:"global/st-api/st-tutorial/template-module/tutorialList.html",
						size:'lg',
						controllerAs:"vm",
						bindToController:true,
						controller:function($scope){
							
							var vm = this;
							vm.tutoriais = [
							    {
								  titulo: "Vendas",
								  descricao:"Como realizar uma venda, listagem de vendas",
								  linkMobile:"https://www.youtube.com/watch?v=sOdiWXFF9Ms",
								  linkDesktop:"https://www.youtube.com/watch?v=93RTB0PXAU0&feature=youtu.be"
							   },
							   {
									  titulo: "Estoque",
									  descricao:"Cadastro e listagem de produtos",
									  linkMobile:"",
									  linkDesktop:""
								   }      
							 ];
							
							vm.openTutorial = function(item){
								
								tutorialUtil.openDetalheTutorial(item);
							}
							
						}
					});
					
				});
			}
		}
	})

})();

