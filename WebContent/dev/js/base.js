
"use strict";
(function(){


	var app;
	var stApi
	try{


		stApi  = angular.module("stapi",[
			'ngMdIcons',
			'dndLists',
			'ngMaterial',
			'md.data.table',
			'ngMessages',
			"angularSpinner",
			"ngRoute",
			"ngCookies",
			"angular.filter",
			"ngStorage",
			"angular-confirm",
			"chart.js",
			"ngAnimate",
			"ngSanitize", 
			"ui.utils.masks"

			]);


		app  = angular.module("stapiApp",[
			'socialLogin',
			'angular-json-tree',
			'stapi',
			"ngSimditor",
			"ui.codemirror",
			"youtube-embed",
			"ng.deviceDetector",
			"ngOnboarding",
			"angularResizable",
			"oc.lazyLoad"
			

			]);
		


		//reTree


	}catch(e){
		window.alert(e);
	}
	
	
	 app.config(function($locationProvider) {


	        // use the HTML5 History API
	        //$locationProvider.html5Mode(true);
	    });
	 
	 
	 app.config([ "$ocLazyLoadProvider", function($ocLazyLoadProvider) {
	       $ocLazyLoadProvider.config({
	          debug: true
	       });
	   }]);
	
	
	app.config(function($provide) {

		  // simditor global options customize
		  $provide.decorator('simditorOptions', ['$delegate', function(simditorOptions) {
			  
			  Simditor.locale= "pt-BR";
		    simditorOptions.toolbar = [
		      'title',
		      'bold',
		      'italic',
		      'underline',
		      'strikethrough',
		      'color',
		      'ol',
		      'ul',
		      'blockquote',
		      'code',
		      'table',
		      'link',
		      'image',
		      'hr',
		      'indent',
		      'outdent',
		      'alignment',
		    ];

		   
		    simditorOptions.toolbarFloat =  true;
		    simditorOptions.toolbarFloatOffset =  0;
		    simditorOptions.toolbarHidden = false;
		    return simditorOptions;
		  }]);

		});
	

	app.run(['$rootScope', '$route','$localStorage','$location','st','$filter','config','$templateCache','$mdDateLocale', 'stUtil', '$mdDialog', function($rootScope, $route, $localStorage, $location, st, $filter, config,  $templateCache,   $mdDateLocale, stUtil, $mdDialog) {

		angular.module = function() {
			  return app;
		};
		
		
		$rootScope.$on('event:social-sign-in-success', function(event, userDetails){
			
			var msg = "<div layout='row' layout-align='center'><md-card flex><md-card-content><p>Login efetuado com sucesso!\n Usuário: "+userDetails.name+"</p>" +
					"<p><strong>E-mail</strong>: "+userDetails.email+"</p>" +
					"<p><span  ><img style='border-radius: 50%'  src=' "+userDetails.imageUrl+"' /></span></p>" +
					"<p><strong>UID</strong>: "+userDetails.uid+"</p>" +
					"<p><strong>Provider</strong>: "+userDetails.provider+"</p>" +
					"<p><strong>Token</strong>: "+userDetails.token+"</p>" +
					"<p><strong>ID Token</strong>: "+userDetails.idToken+"</p></md-card-content></md-card></div>";
			
			$mdDialog.show(
				      $mdDialog.alert()
				       
				        .clickOutsideToClose(true)
				        .title('Login social')
				        .htmlContent(msg)
				        .ariaLabel('Login social')
				        .ok('OK')
				       
				    );
					
		});
	
	}]);

	stApi.run(['$rootScope', '$route','$localStorage','$location','st','$filter','config','$templateCache','$mdDateLocale', 'loginUtil', function($rootScope, $route, $localStorage, $location, st, $filter, config,  $templateCache,   $mdDateLocale, loginUtil) {

		try{


			// FORMAT THE DATE FOR THE DATEPICKER
			$mdDateLocale.formatDate = function(date) {
				return $filter('date')(date, "dd/MM/yyyy");
			};




			$templateCache.put('arrow-up2.svg',
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>');


			/*
			//Registro do service-worker
			if('serviceWorker' in navigator) {
				navigator.serviceWorker
				.register('service-worker.js')
				.then(function() { console.log("Service r Registered"); });
			}
			 */

			//Desabiliar zoom (Necessário para safari)
			document.documentElement.addEventListener('gesturestart', function (event) {
				event.preventDefault();      
			}, false);


			//Configuração da lib de Chart
			/*
			Chart.moneyFormat= function(value) {
				return $filter('number')(value,2);
			}
			 */

			//Evento para contabilizar o tempo de carregamento do sistema
			var tempoCarregamento = (new Date().getTime()-window.inicioCarregamento)/1000;
			st.evt({evento:"tempo_carregamento_sistema",descricao:tempoCarregamento});

			$rootScope.$on('$routeChangeStart', function(event, next, current) { 
				
				if(next.$$route.originalPath=='/'){
					
					$location.path("/login");
					return;
				}

				//Caso o usuário não esteja logado, é direcionado para página de login
				if(!$rootScope.usuarioSistema && (!next.$$route || next.$$route.originalPath.indexOf("/login/:login")==-1) && next.$$route.originalPath.indexOf("/cadastro/:login")==-1 && next.$$route.originalPath.indexOf("/prot/:template")==-1 ){

					console.log("secutity path");
					console.log(config.confs.securityPaths);
					console.log("original path: ");
					console.log(next.$$route.originalPath);
					var originalPath = next.$$route.originalPath.replace("/","");
					if(!config.confs.securityPaths || config.confs.securityPaths=="all" || config.confs.securityPaths.indexOf( originalPath )!=-1){

						
						
						var login = {
								empresa: $localStorage.empresa,
								usuario: $localStorage.usuario,
								senha: $localStorage.senha
						};
						var path = next.$$route.originalPath;
						loginUtil.logar(login, true, function(loginData){

							if(loginData){
								$route.reload();
							}
							else{
								
								if(path != config.loginPath && path != "/login"){
								   $rootScope.pathPosLogin = path;
								}
								$location.path(config.loginPath || "login");
							}

						});
						
					

					}

				}

			});

		}catch(e){
			window.alert("O Sistema não é compatível com seu navegador!\n"+e);
			console.log(e);
		}
	}]);

	stApi.config(function($routeProvider,$httpProvider){

		//Intercepta um erro de resposta
		$httpProvider.interceptors.push(function ($q, $rootScope, $location, $localStorage, usSpinnerService) {
			return {

				'responseError': function(rejection) {
					var status = rejection.status;
					var responseConfig = rejection.config;
					responseConfig= responseConfig  || {};
					var method =  responseConfig.method;
					var url =  responseConfig.url;

					usSpinnerService.stop('spinner-1');


					if (status == 401) {

						delete $localStorage.senha;
						$location.path(config.confs.loginPath || "/login");


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
				'request': function(requestConfig) {

					if(requestConfig.url.indexOf("projecao/execute-query")==-1 && requestConfig.url.indexOf("projecao/get-projecoes")==-1  && requestConfig.url.indexOf("isCachePost=true")==-1)
						usSpinnerService.spin('spinner-1');

					//Inclusão do token e da filial
					if(requestConfig.url.indexOf(".html")==-1 && requestConfig.url.indexOf(".svg")==-1) {

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

						if( requestConfig.url.indexOf("?")!=-1)
							operator="&&";

						requestConfig.url = requestConfig.url +operator+ "token=" + authToken;

						if(requestConfig.url.indexOf("filialId")==-1){
							requestConfig.url = requestConfig.url +"&&filialId="+filialId;
						}

						if(requestConfig.url.indexOf("operadorId")==-1){
							requestConfig.url = requestConfig.url +"&&operadorId="+operadorId;
						}

					}

					return requestConfig || $q.when(requestConfig);
				},

				'response': function(res) {

					usSpinnerService.stop('spinner-1');

					return res || $q.when(res);
				}
			};
		}
		);

	})


	app.config(function(socialProvider){
		socialProvider.setGoogleKey("378761299013-tmcfh7l67glgelmam1e8ju96tndn813n.apps.googleusercontent.com");
		//socialProvider.setLinkedInKey("YOUR LINKEDIN CLIENT ID");
		//socialProvider.setFbKey({appId: "YOUR FACEBOOK APP ID", apiVersion: "API VERSION"});
	});
	
	
	stApi.config(function($routeProvider,$httpProvider){

		$routeProvider.when("/",{

			
		});
	});


	stApi.config(['$locationProvider', function($locationProvider) {
		$locationProvider.hashPrefix('');
	}]);

	stApi.config(function($compileProvider, ChartJsProvider){
		$compileProvider.preAssignBindingsEnabled(true)
	});



})();