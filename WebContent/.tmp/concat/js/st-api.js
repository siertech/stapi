
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
			"angularResizable"

			]);
		


		//reTree


	}catch(e){
		window.alert(e);
	}
	
	
	
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

					if(!config.securityPaths || config.confs.securityPaths=="all" || config.confs.securityPaths.indexOf( next.$$route.originalPath )!=-1){

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
"use strict";
(function(){

	angular.module("stapi")
	.controller("prototipoDetalheCtrl", prototipoDetalheCtrl)
	.controller("prototipoListCtrl", prototipoListCtrl);

	var objectName = "Prototipo";

	function prototipoDetalheCtrl($scope, $controller, itemId, stUtil, stService, $route, $location, $compile){

		var ctrl = this;
		
		$scope.$watch("$prototipoDetalheCtrl.activeTab", function(value){
			
			
			if(value==1){
				changeHtmlCompiled();
			}
			
		});
		
		$scope.$watch("$prototipoDetalheCtrl.versaoPrototipo", function(){
			
			if(ctrl.activeTab==1){
				changeHtmlCompiled();
			}
			
		});
		
		function changeHtmlCompiled(){
			
			ctrl.versaoPrototipo.cssContent = ctrl.versaoPrototipo.cssContent || "";
		
			var css = "<style type='text/css'>\n" +ctrl.versaoPrototipo.cssContent + "\n</style>\n";
			var html =  css + ctrl.versaoPrototipo.codigo;
			
			var element = $('#htmlContent');
		    element.html($compile(html)($scope));
			
              			
		}

		var options = {
				objectName: "VersaoPrototipo",		
				querys: ["prototipo.id="+itemId]
		};
		
		function getList(){
			
			stService.getList(options).then(function(data){
				ctrl.versoesPrototipo = data.itens;
				ctrl.versaoPrototipo = ctrl.versaoPrototipo ||  data.itens[0] || {};
				ctrl.versaoPrototipo.label = ctrl.versaoPrototipo.label || "V1.0";
			});
			
		}
		getList();
		
		
		ctrl.deletarPrototipo = function(versaoPrototipo){

			stService.delete("Prototipo", [versaoPrototipo.prototipo.id]).then(function(data){

				$location.path("prototipo");
			});
		}	
		
		ctrl.deletarVersao = function(versaoPrototipo){

			stService.delete("VersaoPrototipo", [versaoPrototipo.id]).then(function(data){

				$route.reload();
			});
		}	

		ctrl.salvar = function(versaoPrototipo){

			stService.save("VersaoPrototipo", versaoPrototipo).then(function(data){
				ctrl.versaoPrototipo = data.item;
				stUtil.showMessage("","Salvo com sucesso");
				getList();
			});
		}	

		ctrl.salvarComoNovaVersao = function(versaoPrototipo){

			var copyOb = angular.copy(versaoPrototipo);
			copyOb.id = 0;
			stService.save("VersaoPrototipo", copyOb).then(function(data){
				ctrl.versaoPrototipo = data.item;
				stUtil.showMessage("","Salvo com sucesso");
				getList();
			});
		}	

	}

	function prototipoListCtrl($scope, $controller, config, stCrudTools, stUtil, $route, $location){

		var ctrl = this;

		angular.extend(ctrl, $controller('genericListController', {
			$scope: $scope,
			objectName: objectName,
			detalheTemplateUrl:"global/st-api/prototipo/html/prototipoDetalhe.html",
			detalheController: "prototipoDetalheCtrl",
			detalheControllerAs: "$prototipoDetalheCtrl",
			filtros:  [ 
				{attr:'titulo', label: 'Título do protótipo'}

				]
		}));

		ctrl.data.tableColumns = [

			{label: "Título do protótipo", attr: "titulo", orderBy: true, labelIcon: "code"}

			];


		ctrl.data.openDetail = function(item){

			item = item || {};
			var id = item.id || 0;

			$location.path("prototipo/"+id);
		}

		ctrl.data.orderBy = "titulo";

		//Objeto que define as opções para listagem dos itens
		ctrl.data.requestListParams = {	
				objectName: objectName,
				maxItensPerPage: config.confs.maxItemsPerPage || 9,

		}

		//Override
		ctrl.data.saveSuccesResolve = saveSuccessResolve;
		ctrl.data.cancelResolve = cancelResolve;

		function saveSuccessResolve(obj){
			stUtil.showMessage("","Salvo com sucesso!");
			obj.$mdDialog.hide();
			$route.reload();
		}

		function cancelResolve(){

		}

		//Inicializa a lista de objetos
		ctrl.data.getList();

	}

})();

"use strict";
(function(){

	angular.module("stapi")

	.directive("prototipoGridView", prototipoGridView)
	.directive("prototipoTableView", prototipoTableView)
	.directive("prototipoList", prototipoList)
	.directive("prototipoDetalhe", prototipoList)
	.directive("prototipoForm", prototipoForm);
	
	function prototipoDetalhe(){

		return {

			restrict:"E",
			templateUrl:"global/st-api/prototipo/html/prototipoDetalhe.html",
			controller: "prototipoDetalheCtrl",
			controllerAs:"$prototipoDetalheCtrl"

		};

	}
	
	function prototipoList(){

		return {

			restrict:"E",
			templateUrl:"global/st-api/prototipo/html/prototipoList.html",
			controller: "prototipoListCtrl",
			controllerAs:"$prototipoListCtrl"

		};

	}

	function prototipoGridView(){

		return {

			restrict:"E",
			templateUrl:"global/st-api/prototipo/html/prototipoGridView.html"

		};

	}

	function prototipoTableView(){

		return {

			restrict:"E",
			templateUrl:"global/st-api/prototipo/html/prototipoTableView.html"
			
		};

	}

	function prototipoForm(){

		return {

			restrict:"E",
			templateUrl:"global/st-api/prototipo/html/prototipoForm.html"
			
		};

	}

})();

"use strict";
(function(){

	angular.module("stapi")

	.factory("prototipoUtil", prototipoUtil);

	function prototipoUtil($mdDialogstService, $q, $mdDialog, $mdMedia, stCrudToolsUtils){


	}

})();

"use strict";
(function(){
	angular.module("stapi") 
	.config(function($routeProvider, $httpProvider){

	//Rota para listagem dos objetos
	$routeProvider.when("/prototipo",{

		template:"<prototipo-list></prototipo-list>",
	    
	}); 
	
	//Rota para listagem dos objetos
	$routeProvider.when("/prototipo/:id",{

		templateUrl:"global/st-api/prototipo/html/prototipoDetalhe.html",
		controller: "prototipoDetalheCtrl",
		controllerAs: "$prototipoDetalheCtrl",
		resolve: {
			itemId: function($route){
				return $route.current.params.id;
			}
		}
	    
	}); 

})

})();

"use strict";
(function(){

	angular.module("stapi").controller("stChartContentCtrl", function($scope){

		  var ctrl = this;
		  ctrl.charts = [];
	});
	
	angular.module("stapi").controller("stChartItemCtrl", function($scope){

	});
	angular.module("stapi").controller("stChartCtrl",function($scope, $mdColors, $mdColorUtil, stChartUtil, $filter){



		//Período
		$scope.de = $scope.de || "1900-10-05";
		$scope.ate = $scope.ate || "3000-10-05";

		//Quantidade máxima padrão de itens a serem exibidos 
		$scope.maxItens =  $scope.maxItens || stChartUtil.MAX_ITENS_DEFAULT;
		$scope.order = stChartUtil.ORDER_DEFAULT;//

		delete $scope.projs;
		function getDados (maxItens){

			$scope.loading = true;
			//Montagem das informações basicas para recuperação da projeção a partir de $scope.info

			var querys = $scope.querys || [];
			if(typeof querys == 'string')
				querys = querys.split(",");

			var basicInfo = {
					qs:querys || [],
					columns:$scope.labelColumn+","+$scope.valueColumn+" ",
					objeto:$scope.objectName,
					groupBy:$scope.labelColumn,
					extra:"order by "+($scope.orderBy || $scope.valueColumn)+" "+$scope.order,
					max:$scope.max

			}

			var dadosExemplo  = $scope.dadosExemplo;

			delete $scope.proj;
			stChartUtil.chartFactory($scope,basicInfo,$scope.periodColumn,function(proj){


				//Dados de exemplo
				if(proj.labels.length==0){
					proj = dadosExemplo;

					if(proj)
						proj.dadosExemplo=true;

				}

				var filter = $scope.labelFilter  || "";

				filter  = filter.split(":");

				if(filter[0].length>0 && proj){

					for(var i in proj.labels){

						proj.labels[i] = $filter(filter[0])(proj.labels[i], filter[1]);
					}
				}

				//Como definir dinamicamente???
				$scope.chartOptions = {

						/*
					 tooltips: {
					        callbacks: {
					          label: function(data) {

					            var label = proj.labels[data.index];

					            return label;
					          }
					        }
					 }

						 */

				}

				var colors = [

					$mdColorUtil.rgbaToHex($mdColors.getThemeColor("blue")),
					$mdColorUtil.rgbaToHex($mdColors.getThemeColor("grey")),
					$mdColorUtil.rgbaToHex($mdColors.getThemeColor("red")),
					$mdColorUtil.rgbaToHex($mdColors.getThemeColor("green")),
					$mdColorUtil.rgbaToHex($mdColors.getThemeColor("yellow")),

					];
				if(proj)
					proj.colors= colors;

				$scope.proj  = proj;

				$scope.loading = false;

			});

		}

		getDados();
		$scope.getDados = getDados;

	});

})();

"use strict";
(function(){

	angular.module("stapi")
	
	
	.directive("stChartContent", function(){
		
		
		return {
			restrict: "E",
			transclude: true,
			template: "<div ng-transclude></div>",
			scope: {
				de: "<",
				ate: "<"
			},
			controller: "stChartContentCtrl",
			bindToController: true,
			controllerAs: "ctrl"
			
			
		}
	})
	
	//Componente para visualização de projeções
	.directive("stChartItem",function(stChartUtil){

		return{

			restrict:"E",
			bindToController: true,
			controllerAs: "ctrl",
			templateUrl:"global/st-api/st-chart/html/chart.html",
			require:"^stChartContent",
			scope:{
				objectName:"@",
				querys:"<",
				valueColumn:"@",
				orderBy:"@",
				labelColumn:"@",
				periodColumn: "@",
				max:"@",
				de:"<",
				ate:"<",	
				labelFilter:"@"
			},
			link: function(scope, element, attrs, ctrl){
				
				console.log("controller aqui: ");
				console.log(ctrl);
			},
			controller:"stChartItemCtrl"
			

		}

	})


	//Componente para visualização de projeções
	.directive("stChart",function(stChartUtil){

		return{

			restrict:"E",
			templateUrl:"global/st-api/st-chart/html/chart.html",
			scope:{
				objectName:"@",
				querys:"<",
				valueColumn:"@",
				orderBy:"@",
				labelColumn:"@",
				periodColumn: "@",
				max:"@",
				de:"<",
				ate:"<",	
				labelFilter:"@"
			},
			link: function(scope, element, attrs, ctrl){
				
				console.log("controller aqui: ");
				console.log(ctrl);
			},
			controller:"stChartCtrl"

		}

	})

	.directive("componentVendasTabela",function(stService,stUtil,dateUtil){

		return {
			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/component-vendas-tabela.html",
			scope:{
				de:"=",
				ate:"="
			},
			controller:function($scope){

				$scope.chartOptions = {
						tooltipTemplate: "<%=label + ': R$ '  +  Chart.moneyFormat(value) %>",
						type:'pie'  
				}


				$scope.$on("changePeriod",getDados);	

				//Quantidade de itens padrão
				$scope.quantItens = "30";

				function getDados(nomeProduto,quantItens){

					$scope.carregandoDados =true;

					var qs  = ["disable=0","quantidade>0"];

					qs.push(dateUtil.getQueryOfPeriod("date",$scope.de||new Date(),$scope.ate||new Date()));


					if(nomeProduto && nomeProduto.length>0)	
						qs.push("produto.nome like '%"+nomeProduto+"%'");

					qs.push("tipoEntrada=0");//Somente pedidos de Saída!!!

					var ops = {
							qs: qs,
							columns:"produto.nome,sum(quantidade),min(valorUnitario),max(valorUnitario),avg(valorUnitario)",
							objeto:"Pedido",
							groupBy:"produto.id",
							extra:"order by sum(quantidade) DESC",
							max:quantItens||30

					}

					stService.getProjecoes(ops).success(function(data){

						$scope.carregandoDados =false;
						$scope.projs = data.itens;

					}).error(function(){

						$scope.carregandoDados =false;
					});

				}	//FIm getDados()

				getDados();

				$scope.getDados = getDados;

			}
		}
	})

	//Lucro por período mensal
	.directive("componentLucroPeriodo",function(relatorioUtil,stUtil,stService,dateUtil,$filter){

		return {
			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/chart-bar.html",
			scope:{
				de:"=",
				ate:"=",
				colours:"="
			},
			controller:function($scope){

				//Transform objeto proj em um array (Facilitar manipulação dos dados)	
				function projsToArray(projs){

					var array = [];
					for(var i in projs){

						array.push({data:dateUtil.getDate(projs[i][0]),valor:projs[i][1]});
					}

					return array;

				}

				function getProjByMonth(mes,ano,projs){

					for(var i in projs){

						if(projs[i].data.getMonth()==mes && projs[i].data.getFullYear()==ano)
							return projs[i];
					}

					return null;
				}

				//Faz o cáluclo receitas-despesas das projeções obtidas
				function getProjsBalanco(dataIni,dataFim,projReceitas,projDespesas){

					//Padronização dos dados
					dataIni = dateUtil.getDate(dataIni);
					dataFim = dateUtil.getDate(dataFim);
					projReceitas= projsToArray(projReceitas);
					projDespesas= projsToArray(projDespesas);

					var proj = {};
					var data = [];
					var labels = [];

					var soma = 0;
					for(dataIni;dataIni<=dataFim;dataIni = dateUtil.incrementaData(dataIni)){

						var obReceitas = getProjByMonth(dataIni.getMonth(),dataIni.getFullYear(),projReceitas) || {valor:0};
						var obDespesas = getProjByMonth(dataIni.getMonth(),dataIni.getFullYear(),projDespesas) || {valor:0};

						//Soma dos lucros para obtenção da média

						var balanco = obReceitas.valor - obDespesas.valor;

						soma+=balanco;

						data.push(balanco);
						labels.push($filter("date")(dataIni,'MMMM/yyyy'));

					}

					//Média de lucro
					proj.media = soma/data.length;
					proj.data= [data];//Necessário para funcionar em chart-bar
					proj.labels = labels;
					
					proj.colours =  [{
					    fillColor: "#3276b1",
					    strokeColor: "#3276b1",
					    highlightFill: "#3276b1",
					    highlightStroke: "#3276b1"
					}];

					return proj;

				}

				//Recupera os dados do backend	
				function getDados(){

					$scope.chartOptions = {
							tooltipTemplate: "<%=label + ': R$ '  +  Chart.moneyFormat(value) %>",
					}

					var basicQuerys  = ["disable=0","baixada=1","valor>0"];

					var basicInfo = {
							columns:"dataBaixa,sum(valor)",
							objeto:"Movimentacao",
							groupBy:"month(dataBaixa)",
							extra: " order by dataBaixa asc"

					}

					basicQuerys.push(dateUtil.getQueryOfPeriod("dataBaixa",$scope.de||new Date(),$scope.ate||new Date()));

					//Receitas (tipo=2)
					basicInfo.qs  = angular.copy(basicQuerys);
					basicInfo.qs.push("tipo=2");
					stService.getProjecoes(basicInfo).success(function(respReceitas){

						var projReceitas=respReceitas.itens;

						//Desepsas (tipo=1)
						basicInfo.qs  = angular.copy(basicQuerys);
						basicInfo.qs.push("tipo=1");
						stService.getProjecoes(basicInfo).success(function(respDespesas){

							var projDespesas=respDespesas.itens;
							var proj = getProjsBalanco($scope.de,$scope.ate,projReceitas,projDespesas)
							console.log("Projecoes");
							console.log(proj);


							$scope.proj = proj;

						})

					})

				}

				getDados();
				$scope.$on("changePeriod",getDados);	

			}
		}
	})


	//Component de balanco (Receitas, despesas,lucro operacional)
	.directive("componentBalanco",function(stService,$filter,dateUtil,movUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/component-balanco.html",
			scope:{

				de:"=",
				ate:"=",

			},

			controller:function($scope,movUtil){

				$scope.$on("changePeriod",getBalanco);
				
				//Período
				$scope.de = $scope.de || "1900-10-05";
				$scope.ate = $scope.ate || "3000-10-05";

				function getBalanco(){

					$scope.loading = true;
					movUtil.getBalanco($scope.de,$scope.ate,function(receitasRealizadas,despesasRealizadas,receitasPrevistas,despesasPrevistas){

						$scope.loading = false;
						$scope.receitasRealizadas= receitasRealizadas;
						$scope.despesasRealizadas = despesasRealizadas;
						$scope.receitasPrevistas = receitasPrevistas;
						$scope.despesasPrevistas = despesasPrevistas;
						$scope.lucroPrevisto = receitasPrevistas - despesasPrevistas;
						$scope.lucroRealizado = receitasRealizadas- despesasRealizadas;

						//Falta pagar e Falta receber
						$scope.faltaPagar = $scope.despesasPrevistas- $scope.despesasRealizadas;
						$scope.faltaReceber = $scope.receitasPrevistas - $scope.receitasRealizadas;


						if($scope.faltaPagar<0)
							$scope.faltaPagar = 0;

						if($scope.faltaReceber<0)
							$scope.faltaReceber = 0;

					});

				}

				getBalanco();

			}

		}

	})

	//Componente movimentações a prazo pagas no periodo
	.directive("componentAnterioresBaixadas",function(stService,$filter,dateUtil,stUtil,movUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/component-anteriores-baixadas.html",
			scope:{

				de:"=",
				ate:"=",

			},

			controller:function($scope){

				$scope.$on("changePeriod",getMovs);
				function getMovs(){

					var querys = [];
					querys.push("tipo=2");
					querys.push("data <'"+stUtil.formatData($scope.de||new Date())+"'");
					querys.push(dateUtil.getQueryOfPeriod("dataBaixa",$scope.de||new Date(),$scope.ate||new Date()));

					var ops = {
							qs : querys,	
							columns:"valor",
							groupBy:"id",
							objeto:"Movimentacao"

					};

					//Receitas
					ops.extra="tipo=2"
						stService.executeGet("/movimentacao/busca/map",{qs:querys,pagina:0,max:0,extra:''}).success(function(data){

							var total = 0;
							var itens = data.itens;
							if(data.itens.length>0){

								$scope.lancamentosAnteriores = data.itens;

								for(var i in itens){

									total+=itens[i].valor;

								}

								$scope.totalLancamentosAnteriores = total;

							}
							else{

								$scope.lancamentosAnteriores =null;
								$scope.totalLancamentosAnteriores = 0;

							}

						});

				}
				getMovs();

			}
		}
	})

})();

"use strict";
(function(){

	angular.module("stapi")

	.factory("stChartUtil",function(dateUtil, stService,$rootScope){

		//Qqantidade máxima de itens padrão para recuperação das projeções
		var _MAX_ITENS_DEFAULT = "0";

		//Ordenção padrão para inserção nas querys das projeções
		var _ORDER_DEFAULT = "ASC";

		var _chartFactory = function(scope,basicInfo,periodColumn,callback){

			scope.$on("changePeriod",getDados);

			function getDados(){

				_getChartObject(basicInfo,periodColumn,scope.de,scope.ate,function(proj){

					callback(proj);
				});

			}

			getDados();

		}

		var _getChartObject = function(dados, periodColumn, dataDe, dataAte, callback){

			var info = angular.copy(dados);
			info.qs = info.qs||[];

			if((dataDe && dataDe!=null) && (dataAte&& dataAte!=null))
				info.qs.push(dateUtil.getQueryOfPeriod(periodColumn,dataDe,dataAte));

			stService.getProjecoes(info).then(function(data){

				var itens = data.itens;
				var labelsGrafico =  [];
				var dataGrafico = [];
				for(var i in itens ){

					labelsGrafico.push(itens[i][0]||'Outros');
					dataGrafico.push(itens[i][1]);
				}

				var proj = {};

				proj.labels = labelsGrafico;
				proj.data = dataGrafico;

				//Caso a quantidade itens ultrapasse 4, a exibição é feita em char-bar
				//Necessário transformar [] em [[]] para exibição em chart-bar 
				if(proj.labels.length>4){

					proj.data = [proj.data];	

				}

				callback(proj);

			});


		}

		//Quantidade máxima de itens padrão
		var _maxItensDefault = function(){

			return "5";
		}

		//Ordenação padrão a ser inserida nas querys de projeções
		var _orderDefault = function(){

			return "DESC";
		}

		return{
			getChartObject: _getChartObject,
			chartFactory: _chartFactory,
			maxItensDefault:_maxItensDefault,
			MAX_ITENS_DEFAULT: _MAX_ITENS_DEFAULT,
			ORDER_DEFAULT : _ORDER_DEFAULT 
		}
	})

})();

"use strict";

(function(){

	angular.module("stapi")
	.controller("stDetalheCtrl", stDetalheController)

	function stDetalheController($scope, objectName, item, controllerAs, functionToNotify, stCrudToolsUtils, $mdDialog){

		var ctrl = this;
        $scope.controllerAs = controllerAs; 
        ctrl.tarefas = [
        	{titulo: "Titulo da tarefa", ok: 'true'}
        ];
		ctrl.cancelFunction = cancelFunction;
		ctrl.deleteFunction = deleteFunction;
		ctrl.saveFunction  = saveFunction;

		function cancelFunction (ctrl){

			$mdDialog.cancel();
		}

		function saveFunction (item){
			
			console.log("item a ser salvo: ");
			console.log(item);

			ctrl.savingItem = true;

			stCrudToolsUtils.saveAndNotify(objectName, item, $mdDialog , functionToNotify).then(function(obj){

				ctrl.savingItem= false;

			}).catch(function(){

				ctrl.salvandoItem = false;
			});


		}

		function deleteFunction(item){

			ctrl.deletingItem= true;

			stCrudToolsUtils.deleteAndNotify(objectName, item, $mdDialog , functionToNotify).then(function(obj){

				$mdDialog.hide();  
				ctrl.deletingItem= false;

			}).catch(function(){

				ctrl.deletingItem= false;
			});


		}

		function getBasicCallbackObj(){

			var obj = {};
			obj.modal = $mdDialogInstance;
			return obj;
		}

		function init(){
			ctrl.item = item || {};
			ctrl.salvandoItem  =  false;
		}
		init();

	}

})();


"use strict";

(function(){

	angular.module("stapi")

	.directive('crudTools', stCrudTools)
	
	.directive('stCrudTools', stCrudTools);

	/**
	 * @ngdoc directive
	 * @name stapi.directive: crud-tools
	 * @restrict E
	 * @example
	 * <pre>
	 *     <crud-tools ob="vm.ob"  delete-function="vm.deleteFunction" edit-function="vm.editFunction" ></crud-tools>
	 * </pre>
	 **/
	
	function stCrudTools(){
		return {
			restrict: 'E',
			scope:{

				item: "<",
				openDetail: "&",
				deleteFunction: "&",
				icon: "@"

			},

			templateUrl:'global/st-api/st-crud-tools/html/crudTools.html',
			bindToController:true,
			controllerAs:"$stCrudToolsCtrl",
			controller: function(){

				var ctrl = this;
				
				ctrl.openMenu = function($mdMenu, event){
					event.stopPropagation();
					$mdMenu.open();
				}
				
			}
		}
	}

})();


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

"use strict";
(function(){

	angular.module("stapi") 

	.directive('syncCachePost', syncCachePost);

	function syncCachePost(onlineStatus) {
		return {
			restrict: 'E',
			templateUrl:"global/st-api/st-sync/html/syncCachePost.html",
			scope:{
			},
			controllerAs:"vm",
			bindToController:true,
			controller: function($localStorage, $interval, $timeout, stService, $rootScope, stUtil, onlineStatus, $scope, loginUtil, st, $mdDialog) {

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

						stService.executePost($localStorage.cachePost[0].url, $localStorage.cachePost[0].objeto).then(function(data){

							$localStorage.cachePost.splice(0,1);
							$timeout(function(){
								executePosts((i+1), tam);

							}, 300);


						}).catch(function(erro, status){

							if(erro && status!=401){

								st.evt({evento:"erro_cache_post", descricao: erro, descricao_2: JSON.stringify($localStorage.cachePost[0]) });

								$localStorage.cachePost.splice(0,1);
								$mdDialog.show({
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
	}

})();

"use strict";
(function(){

	angular.module("stapi") 

	.factory('st',function($rootScope, $cookieStore){


		//Enviar um evento no sistema contablidade no servidor
		var _evt  = function(evt){

			/*
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


			stService.executePost("eventousuario/add/",evt).then(function(){


			});

			 */


		};


		var _leadEvt  = function(evt){

			var usuario =  $cookieStore.get("usuarioSistema");

			/*
			stService.executeGet("/lead/add-action-by-tel",{tel:usuario.login, action: evt.descricao }).then(function(){

			});
			 */

		};


		return{
			evt: _evt,
			leadEvt: _leadEvt
		}
	})



	/**
	 * @ngdoc service
	 * @name stapi.stUtil
	 * @description Funções úteis
	 */
	.factory('stUtil',function($rootScope, $filter,$injector){

		/**
		 * @ngdoc method
		 * @methodOf stapi.stUtil
		 * @name transformJSONToSqlComparators
		 * @param {String}  obj Objeto 
		 * @description Transforma um objeto JSON em um array de comparadores SQL
		 * @returns {array[String]} Retorna um array de String's com as querys
		 * @example
		 * <pre>
		 * var obj = {nome : 'Thomaz', cidade: 'Belo Vale'};
		 * transformJSONToSqlComparators(obj);
		 * Resultado: ["nome = 'Thomaz'", "cidade = 'Belo Vale'"]
		 * </pre>
		 */

		var _transformJSONToSqlComparators = function(obj){
			
			if(!obj)
				return [];

			var querys = [];

			for(var key in obj){

				querys.push(key+" = '"+obj[key]+"'");
			}

			querys = querys.filter(function(value){

				if(value.length>0)
					return value;

			});

			return querys;
		}


		/**
		 * @ngdoc method
		 * @methodOf stapi.stUtil
		 * @name removerAcentos
		 * @param {String}  str String a qual será removido os acentos
		 * @description Remove os acentos de uma String especifica
		 * @returns {string} Retorna a String com os acentos removidos
		 * @example
		 * <pre>
		 * stService.removerAcentos("Cidadão");
		 * </pre>
		 */
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

							loginService.logar(login).then(function(data){

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

		var _showMessage = function(titulo,mensagem, classe, actionText){


			classe = classe |"md-primary";

			if(classe=='danger'){
				classe="md-accent";
			}

			else if(classe=='info'){
				classe="md-primary";
			}

			var $mdToast= $injector.get("$mdToast");

			var toast = $mdToast.simple()
			.textContent(mensagem)
			.action(actionText|"")
			.highlightAction(angular.isDefined(actionText))
			.highlightClass(classe)
			.position("bottom");

			return $mdToast.show(toast);

			//As configurações estão definidas em '.config(['growlProvider'' no inicio deste arquivo 
			//growl[tipo](mensagem); 

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
		/*
		 * EXEMPLO: 
		 * var ob = {"cliente": {"nome":"Thomaz"}};
		 * getValueOfNivel(ob,"cliente.nome")
		 * Retorna "Thomaz"
		 */
		var _getValueOfNivel = function(ob, attr){

			var result;

			if(!attr)
				return undefined;

			//Niveis
			var nvs = attr.split(".");


			switch(nvs.length){

			case 0: result=ob;
			break;

			case 1: result=ob[nvs[0]];
			break;

			case 2:
				result= ob[nvs[0]]?  ob[nvs[0]][nvs[1]]: undefined;
				break;

			case 3:

				result=  ob[nvs[0]] && ob[nvs[0]][nvs[1]] ? ob[nvs[0]][nvs[1]][nvs[2]] : undefined;
				break;

			case 4: 

				result= ob[nvs[0]] && ob[nvs[0]][nvs[1]] && ob[nvs[0]][nvs[1]][nvs[2]] ?  ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]] :undefined;
				break;

			case 5: 
				result=ob[nvs[0]] && ob[nvs[0]][nvs[1]] && ob[nvs[0]][nvs[1]][nvs[2]]  && ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]]? ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]][nvs[4]] :undefined;
				break;

			}

			return result;

		};

		var _setValueOfNivel = function(ob, attr, value){

			//Niveis
			var nvs = attr.split(".");

			switch(nvs.length){

			case 0: ;
			break;

			case 1:
				ob[nvs[0]]=value;
				break;

			case 2:
				ob[nvs[0]] = ob[nvs[0]] ||{};
				ob[nvs[0]][nvs[1]]=value;
				break;

			case 3:
				ob[nvs[0]][nvs[1]] = ob[nvs[0]][nvs[1]] || {};
				ob[nvs[0]][nvs[1]][nvs[2]]=value;
				break;

			case 4:
				ob[nvs[0]][nvs[1]][nvs[2]] || ob[nvs[0]][nvs[1]][nvs[2]] || {};
				ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]]=value;
				break;

			case 5:
				ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]] = ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]] || {};
				ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]][nvs[4]]=value;
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
			getValue : _getValueOfNivel,
			setValue : _setValueOfNivel,
			compareJson: _compareJson,
			disableFocus: _disableFocus,
			removerAcentos: _removerAcentos,
			getDayOfIndex:_getDayOfIndex,
			transformJSONToSqlComparators: _transformJSONToSqlComparators

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
			$http(req).then(function(data){


			}).catch(function(msg){

				stUtil.showMessage("","Ocorreu ao imprimir em '"+urlPrint+"'","danger");

			});


		}


		return{
			printMovs:_printMovs
		}

	})

	//Modal em forma de serviço
	.factory("$stDetalhe",function($http, config, $mdDialog){

		var _open = function(template,ob,$scope_,callback){

			$mdDialog.show({
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

	angular.module("stapi") 

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

	angular.module("stapi") 

	/**
	 * @ngdoc service
	 * @name stapi.dateUtil
	 * @description Auxiliar de operações com datas
	 */
	
	 .filter("dayOfWeek", function(){
		 
		 return function(dayIndex) {
		        switch(dayIndex) {
		            case 1:
		                return 'Domingo';
		            case 2:
		                return 'Segunda';
		            case 3:
		                return 'Terça';
		            case 4:
		                return 'Quarta';
		            case 5:
		                return 'Quinta';
		            case 6:
		                return 'Sexta';
		            case 7:
		                return 'Sábado';
		        }
		        return '';
		    }
		 
	 })
	.factory('dateUtil', function($rootScope, $filter, stUtil){

		
		/**
	     * @ngdoc method
	     * @methodOf stapi.dateUtil
	     * @name getPeriodOf
	     * @description Retorna as datas de um período específico
	     */
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

				return $filter("date")(data,"yyyy-MM-dd");
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
				
				dia  = dia.toString();
				
				if(dia.length==1)
					dia = "0"+dia;
				
				
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

			var ONE_DAY = 1000 * 60 * 60 * 24

			var difference_ms = Math.abs(date1_ms - date2_ms)

			return Math.round(difference_ms/ONE_DAY)

		}
		
		var _getBrFormat = function(value){
			
			return $filter("date")(value,"dd/MM/yyyy");
		}
		
		var _getDayNameOfIndex = function(index){

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


		return {

			getPeriodOf:_getPeriodOf,
			getQueryOfPeriod:_getQueryOfPeriod,
			formatDate: _formatDate,
			getDate:_getDate,
			daysInMonth:_daysInMonth,
			incrementaData:_incrementaData,
			daysBetween: _daysBetween,
			getBrFormat: _getBrFormat,
			getDayNameOfIndex: _getDayNameOfIndex
		}

	})

})();

"use strict";
(function(){

	angular.module("stapi") 
	
   .directive('ovtsZoomControls', function( $window, $document, $timeout ){

  return {

    restrict: 'A',

    replace: true,

    transclude: true,

    template: '<div class="ovts-zoom-controls"></div>',

    scope: {},

    controllerAs: 'zoom',

    controller: function($scope){

      this.in = function() {
        if($scope.currentStep < $scope.stepCnt) {
          $scope.currentStep += 1;
        }
      }

      this.out = function() {
        if($scope.currentStep > 0) {
          $scope.currentStep -= 1;
        }
      }

      this.isMaxedIn = function() {
        return $scope.currentStep == $scope.steps.length - 1;
      }

      this.isMaxedOut = function() {
        return $scope.currentStep == 0;
      }

    },

    link: function($scope, ele, attrs, controller, transclude){
      var options = $scope.$eval(attrs.ovtsZoomControls) || {};
      var eleTarget = $document[0].querySelector(options.target);
      $scope.$watch(function(){
        return [eleTarget.clientWidth, eleTarget.clientHeight];
      }, calc, true);

      $window.addEventListener('resize', calc);

      function calc() {
        var eleControls = ele[0];
        var steps = $scope.steps = [];
        var stepCnt = $scope.stepCnt = options.stepCnt || 4;
        var animation = options.animationFn || '.7s ease-out';
        var transformOrigin = options.transformOrigin || 'center top';
        var minHeight = options.minHeight;
        var minWidth = options.minWidth;
        var maxHeight = options.maxHeight;
        var maxWidth = options.maxHeight;
        var min = options.min;
        var max = options.max;
        var minWidthOffset = options.minWidthOffset || 0;
        var minHeightOffset = options.minHeightOffset || 0;
        var maxWidthOffset = options.maxWidthOffset || 0;
        var maxHeightOffset = options.maxHeightOffset || 0;
        var offsetX = options.offsetX || 0;

        if(minWidth === 'initial') {
          minWidth = eleTarget.clientWidth;
        }

        if(minHeight === 'initial') {
          minHeight = eleTarget.clientHeight;
        }

        if(minWidth === 'window') {
          minWidth = $window.innerWidth
        }

        if(minHeight === 'window') {
          minHeight = $window.innerHeight
        }

        if(maxWidth === 'initial') {
          maxWidth = eleTarget.clientWidth
        }

        if(maxHeight === 'initial') {
          maxHeight = eleTarget.clientHeight
        }

        if(maxWidth === 'window') {
          maxWidth = $window.innerWidth
        }

        if(maxHeight === 'window') {
          maxHeight = $window.innerHeight
        }

        minHeight += minWidthOffset;
        minHeight += minHeightOffset;
        maxWidth += maxWidthOffset;
        maxHeight += maxHeightOffset;

        transclude($scope, function(nodes){
          angular.element(eleControls).append(nodes);
        })

        $scope.currentStep = calculateSteps();

        applyTransformOrigin(eleTarget, transformOrigin)

        $scope.$watch('currentStep', function(currentStep, oldStep){
          if(currentStep !== oldStep){
            applyAnimation(eleTarget, animation);
          }
          applyTransform(eleTarget, steps[currentStep]);
        });

        function calculateSteps(){
          var width = eleTarget.clientWidth;
          var height = eleTarget.clientHeight;
          var minWidthScale =  minWidth / width || -Infinity;
          var minHeightScale =  minHeight / height || -Infinity;
          var maxWidthScale =  maxWidth / width || Infinity;
          var maxHeightScale =  maxHeight / height || Infinity;
          var minScale = Math.max(minWidthScale, minHeightScale);
          var maxScale = Math.min(maxWidthScale, maxHeightScale);
          var minLog = Math.log(minScale);
          var maxLog = Math.log(maxScale);


          if(minScale > 1 || maxScale < 1) {

            steps.push(1)

          }else{

            var x = stepCnt * minLog / (maxLog - minLog)
            var initalStep = Math.round(stepCnt * -minLog / (maxLog - minLog));

            for (var i = 0; i <= stepCnt; i++) {
              var step;
              if (i < initalStep) {
                step = -minLog / initalStep * i + minLog;
              }
              else if(i > initalStep) {
                step = maxLog * ( i - initalStep ) / (stepCnt - initalStep);
              }
              else {
                step = 0;
              }
              steps.push(Math.pow(Math.E, step));
            }

          }
          return steps.indexOf(1);
        };

        function applyTransformOrigin(element, cssValue) {
          element.style.transformOrigin = cssValue;
          element.style.webkitTransformOrigin = cssValue;
          element.style.mozTransformOrigin = cssValue;
          element.style.msTransformOrigin = cssValue;
          return element.style.oTransformOrigin = cssValue;
        };

        function applyTransform (element, value) {
          var cssValue = "scale(" + value + "," + value + ")";
          element.style.transform = cssValue;
          element.style.webkitTransform = cssValue;
          element.style.mozTransform = cssValue;
          element.style.msTransform = cssValue;
          return element.style.oTransform = cssValue;
        };

        function applyAnimation (element, cssValue) {
          element.style.transition = cssValue;
          element.style.webkitTransition = cssValue;
          element.style.mozTransition = cssValue;
          return element.style.oTransition = cssValue;
        };

      }

    }
  }
})

	.directive('ngEnter', function () {

		return{

			link:   function (scope, element, attrs) {
				element.bind("keydown keypress", function (event) {
					if(event.which === 13) {
						scope.$apply(function (){
							scope.$eval(attrs.ngEnter);
						});

						event.preventDefault();
					}
				});
			}

		}

	})


	.directive("htmlView", function() {
		return {
			scope:{
				titulo:"=",
				content:"="
			}, 	
			templateUrl:"global/st-api/st-util/template-module/htmlView.html",
			bindToController: true,
			controllerAs: "vm",
			controller: function(){

			}
		}
	})

	.directive("htmlCompile", function($compile){
		return{
			scope:{
				html:"="
			},

			controller: function($scope, $element){

				$scope.$watch("html", function(template){

					var linkFn = $compile(template);
					var content = linkFn($scope);
					$element.html(content);


				});

			}
		}
	})


	/**
	 * @ngdoc directive
	 * @name stapi.directive: view-chose
	 * @restrict E
	 * @example
	 * <view-chose class="col-lg-3" view-type="config.confs.viewType" ></view-chose>
	 **/
	.directive("viewChose",function(){
		return{

			restrict:"E",
			transclude:true,
			scope:{
				viewType:"="	
			},
			templateUrl:"global/st-api/st-util/template-module/viewChose.html",
			bindToController:true,
			controllerAs:"vm",
			controller: function(configUtil){

				var vm = this;

				if(!vm.viewType)
					vm.viewType = "grid";

				vm.change = function(){

					vm.viewType = vm.viewType == "grid" ? "table": "grid";
					configUtil.setConfig("viewType", vm.viewType);
				}
			}


		}
	})



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

	.directive("buttonInfoOb",function($mdDialog, filialUtil){

		return{
			link: function (scope, element, attrs){

				element.bind("click",function(){

					var objeto = JSON.parse(attrs.objeto);
					var historicos = objeto.historicoObjeto.split(",");
					
					var content = "";
					for(var i in historicos){
						content+="<p>"+historicos[i]+"</p>";
					}
					
					 $mdDialog.show(
						      $mdDialog.alert()
						        .parent(angular.element(document.body))
						        .clickOutsideToClose(true)
						        .title("Informações")
						        .htmlContent(content)
						        .ariaLabel("Informações")
						        .ok("ok")
						    );


				});

			}

		}

	})


	/**
	 * @ngdoc directive
	 * @name stapi.directive: button-add
	 * @restrict E
	 * @example
	 * <pre>
	 *   <button-add ng-click="vm.openItem()"></button-add>
	 * </pre>
	 **/
	.directive("floatButtonAdd",function(){
		return{

			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/buttonAdd.html",
			scope: {
				tooltipLabel: "@"
			}


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

					stService.getLikeMap($scope.objectOp,[''],pagina,$scope.maxItens||0,'').then(function(data){

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


		/**	
		 * @ngdoc directive
		 * @name stapi.directive: focus-me
		 * @restrict E
		 * @description Auto focus no elemento
		 * @example
		 * <pre>
		 *     <input  ng-model="model"   class="form-control"  focus-me="true"/>
		 * </pre>
		 * **/
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

		.directive('verticalSpace',function($log){

			$log.warn("vertical-space is now deprecated. Use st-vertical-space instead.");

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

		.directive("usuarioSistema",function( $mdDialog,stService,stUtil,loginUtil){

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

						var modal =  $mdDialog.show({
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

									stService.save("operadorsistema",usuarioSistema).then(function(){

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
				controller:function($scope,$interval,stService,$mdDialog, $location,$stDetalhe, $route){

					var getAlerts = function(){

						stService.executeGet("projecao/execute-query",
								{query:"select p.id,p.nome,'',p.quantidade from Produto p where (p.quantidade<=p.minQuant) and p.disable =0"}).then(function(data){
									$scope.itens =  data.itens;
									$scope.numAlerts = data.itens.length;

								}).catch(function(){


								});



					}

					$interval(getAlerts,15000);

					$scope.openAlerts = function(itens){

						$mdDialog.show({
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

									stService.getById("produto",idProduto).then(function(data){

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

	angular.module("stapi") 
	
	
	//Diretiva necessária para upload de arquivos
	.directive('mobileTabs',function (onlineStatus) {
		return {
			restrict: 'E',
			templateUrl:"global/st-api/st-util/template-module/mobileTabs.html",
			scope:{
				activeTab:"=",
				tabs: "=",
				disableFixToBotton:"="
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

	angular.module("stapi") 
	
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
			    stService.getAll($scope.urlBase).then(function(data){
			    	
			    	$scope.itens = data.itens;
			    });

			}

		}
	})
	
})();

"use strict";
(function(){

	angular.module("stapi") 

	.controller("estadosCidadesController",function(stService,stUtil){

		var vm = this;

		vm.loadingEstados = true;
		stService.executeGet("estadoscidades/get-estados").then(function(data){

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

			stService.executeGet("estadoscidades/get-cidades",{uf:estado.uf}).then(function(data){

				vm.loadingCidades = false;

				vm.cidades= data.itens;

			});
		}

		//Se o código do municipio estiver definido, o municípo completo é recuperado
		if(vm.codigoMunicipio){

			vm.loading = true;

			//Recupera as informações completas da cidade
			stService.executeGet("/estadoscidades/get-cidade",{codMun:vm.codigoMunicipio}).then(function(data){

				vm.cidade = data.item;
				vm.loading = false;
			});

		}
	})

})();

"use strict";
(function(){

	angular.module("stapi")
	
	.directive("inputClear", inputClear)
	
	
	

	.directive("stDatePicker", stDatePicker)

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-input-check
	 * @restrict E
	 * @example
	 * <pre>
	 *     <st-input-check  ng-true-value="1"  ng-false-value="0" label="'Exibir somente devedores'" ng-model="check2"></st-input-check>
	 * </pre>
	 **/
	.directive("stInputCheck", stInputCheck)
	.directive("inputCheck", stInputCheck)

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-input-date
	 * @restrict E
	 * @example
	 * <pre>
	 *    <st-input-date class="col-lg-3" label="Data" ng-model="data" ></st-input-date>
	 * </pre>
	 **/
	.directive("stInputDate", getDirectiveDefinition("date"))
	.directive("inputDate", getDirectiveDefinition("date"))

	/**
	 * @ngdoc directive
	 * @name stapi.directive:st-input-string
	 * @restrict E
	 * @example
	 * <pre>
	 *    <st-input-string class="col-lg-3" label="Digite o nome" ng-model="nome" ></st-input-string>
	 * </pre>
	 **/
	.directive("stInput", getDirectiveDefinition("string"))
	.directive("stInputString", getDirectiveDefinition("string"))
	.directive("inputString", getDirectiveDefinition("string"))

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-input-double
	 * @restrict E
	 * @example
	 * <pre>
	 *    <st-input-double class="col-lg-3" label="Valor" ng-model="valor" ></st-input-double>
	 * </pre>
	 **/	
	.directive("stInputDouble", getDirectiveDefinition("double"))
	.directive("inputDouble", getDirectiveDefinition("double"))

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-input-int
	 * @restrict E
	 * @example
	 * <pre>
	 *    <st-input-int class="col-lg-3" label="Quantidade" ng-model="quantidade" ></st-input-int>
	 * </pre>
	 **/
	.directive("stInputInt", getDirectiveDefinition("int"))
	.directive("inputInt", getDirectiveDefinition("int"));

	function getDirectiveDefinition(tipoInput){

		var stInput = function($compile, dateUtil, $filter){
			return{

				restrict:"E",
				templateUrl: "global/st-api/st-input/html/stInput.html",
				require:"ngModel",
				scope:{
					ngModel:"="
				},
				link: function(scope, ele, attrs, ctrl){

					var labelElement = ele.find("label");
					var inputElement = ele.find("input").clone();

					labelElement.on("click", function(){
						inputElement.focus();
					});

					inputElement.attr("type", attrs.type);


					//Trasnforma o elemento de input de acordo com o tipo
					if(tipoInput=='int'){
						inputElement.attr("type", "tel");
					}

					else if(tipoInput=='double'){
						inputElement.attr("ui-number-mask", 2);
						inputElement.attr("type", "tel");
					}

					else if(tipoInput=='date')
						inputElement.attr("st-date-picker","");
				


					inputElement = $compile(inputElement)(scope);

					//Substitui o elemento para o correto
					ele.find("input").replaceWith(inputElement);

					scope.label = attrs.label;
					scope.icon = attrs.icon;

				}

			}
		}

		return stInput;
	}

	
	function stInputCheck(){
		
		return{
			
		    templateUrl:"global/st-api/st-input/html/stInputCheck.html"
			
		}
	}
	
	function stDatePicker($compile,$filter, stService,$rootScope,stUtil, dateUtil){

		return {
			require:'ngModel',	

			scope:{

			},

			link: function($scope, element, attrs,ctrl){
				
			
				element.datepicker({
					dateFormat: 'dd/mm/yy',
					"z-index":9999,
					onSelect: function (date) {
						
						ctrl.$setViewValue(dateUtil.formatDate(date));
						$scope.$apply();
					}
				});

				//Interceptador de Valores
				/*
				ctrl.$parsers.push(function(value){

				
					value = angular.copy(value);
					return dateUtil.formatDate(value);
				
					return value;
					
				});

               */
				//Filtros
				
				ctrl.$formatters.push(function(value){
					
                   value = angular.copy(value);
					value = $filter("date")(value,"dd/MM/yyyy");
					console.log("Filtered: ");
					console.log(value);
					
					return value;

				});
				
				
				
				
				

			}

		}

	}
	
	   function inputClear() {
	        return {
	            restrict: 'A',
	            compile: function (element, attrs) {
	                var color = attrs.inputClear;
	                var style = color ? "color:" + color + ";" : "";
	                var action = attrs.ngModel + " = ''";
	                element.after(
	                    '<md-button class="animate-show md-icon-button md-accent"' +
	                    'ng-show="' + attrs.ngModel + '" ng-click="' + action + '"' +
	                    'style="position: absolute; top: 0px; right: -6px;">' +
	                    '<div style="' + style + '">x</div>' +
	                    '</md-button>');
	            }
	        };
	    }
	    
	  
})();

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

"use strict";
(function(){
	angular.module("stapi")

	.controller("stCheckListController", function($scope, stUtil, $filter, stService,  $mdDialog){

		var ctrl  = this;
		ctrl.scope = $scope;
		init();

		$scope.$watch("vm.objetos", function(newValue, oldValue){

			if(newValue.length> oldValue.length){

				for (var i = 0; i < newValue.length; i++) {

					if (angular.equals(newValue[i], oldValue[i])) continue;

					var changedItem = newValue[i];

					if(hasFixProperties(changedItem)==false){

						changedItem =  setFixProperties(changedItem);

						stService.save(ctrl.crudOptions.objectName,changedItem).then(function(data){
							

						});
					}

				}
			}


		}, true);


		function hasFixProperties(ob){
			ob = angular.copy(ob);
			var  fixProperties = ctrl.crudOptions.fixProperties;
			var has = true;
			for(var key in fixProperties){

				if(ob[key] ==  fixProperties[key]){

				}
				else{
					has = false;
					continue;
				}


			}

			return has;

		}

		function reorderItems(){
			var objectName = ctrl.crudOptions.objectName;
			var lista = ctrl.objetos;

			var obj = {};
			obj.objectName = objectName;
			obj.items = [];
			for(var i in lista){
				lista[i].orderIndex = i+"";
				obj.items.push({"id": lista[i].id, "orderIndex": i+""});
			}
			stService.executePost("/reorder-items/", obj);
		}


		ctrl.deleteAll = function(){

			var ids = [];
			ctrl.objetos.filter(function(item){
				ids.push(item.id);
			});

			stService.delete(ctrl.crudOptions.objectName, ids).then(function(){
				stUtil.showMessage("","Itens deletados com sucesso!");
				init();
			});
		}
		ctrl.dragEnd= function () {

			reorderItems();

		}

		ctrl.changeChecked = function(item){

			stService.changeAttrValue(ctrl.crudOptions.objectName, item.id, ctrl.attr, item[ctrl.attr]);

		}


		ctrl.editItem = function ($event, item, index) {
			var initalValue =  stUtil.getValue(item, ctrl.attrLabel);
			var confirm = $mdDialog.prompt()
			.title('')
			.textContent("")
			.placeholder("")
			.ariaLabel("")
			.initialValue(initalValue)
			.targetEvent($event)
			.required(true)
			.multiple(true)
			.ok('OK')
			.cancel('Cancelar');

			$mdDialog.show(confirm).then(function(value) {

				stUtil.setValueOfNivel(item, ctrl.attrLabel, value);

				stService.changeAttrValue(ctrl.crudOptions.objectName, item.id, ctrl.attrLabel, value);

			}, function() {

			});

		};

		ctrl.addItem = function(labelValue){

			var ob = stUtil.setValueOfNivel({}, ctrl.attrLabel, labelValue);
			var orderBy = ctrl.orderBy || "orderIndex";
			ob[orderBy] = getNextOrderIndex();

			ctrl.newItem = "";

			ob = setFixProperties(ob);

			stService.save(ctrl.crudOptions.objectName, ob).then(function(data){
				ctrl.objetos.push(data.item);

			});


		}

		function setFixProperties(ob){

			//Incluir as propriedades fixas no objeto
			var fixProperties =ctrl.crudOptions.fixProperties;
			if(fixProperties){
				for(var key in fixProperties){
					ob[key] =  fixProperties[key];
					stUtil.setValueOfNivel(ob, key, fixProperties[key]);

				}
			}

			return ob;

		}

		ctrl.openDetail = function(item){

			if(ctrl.crudOptions && ctrl.crudOptions.openDetail)
				ctrl.crudOptions.openDetail(item);

		}

		ctrl.openMenu = function($event, $mdMenu){

			$event.stopPropagation();
			$mdMenu.open();
		}

		ctrl.deleteFunction = function(item, index){

			ctrl.objetos.splice(index, 1);
			reorderItems();
			stService.delete(ctrl.crudOptions.objectName, [item.id]);

		}

		function getNextOrderIndex(){

			if(ctrl.objetos.length==0)
				return 0;

			return ctrl.objetos.length;

		}

		//Inicialização do controller
		function init(){

			ctrl.trueValue = ctrl.trueValue || "'true'";
			ctrl.falseValue = ctrl.falseValue || "'false'";

			if(ctrl.crudOptions){

				var qs = [];
				qs = qs.concat(stUtil.transformJSONToSqlComparators(ctrl.crudOptions.fixProperties));

				//Recupera a lista de objetos
				stService.getList({

					objectName: ctrl.crudOptions.objectName,
					querys: qs
				}).then(function(data){

					ctrl.objetos  = data.itens || [];
					//Reseolve a ordem inicial dos itens
					resolveInitialOrderForObs(ctrl.objetos);


				});


			}else {

				ctrl.objetos = ctrl.objetos || [];

				//Reseolve a ordem inicial dos itens
				resolveInitialOrderForObs(ctrl.objetos);

			}

		}

		function resolveInitialOrderForObs(obs){

			var orderBy = ctrl.orderBy || "orderIndex";

			for(var i in obs){

				var order = obs[i][orderBy ];

				if(order!=0 && !order)
					order = i;

				obs[i][orderBy] = order;

			}

			obs.sort(function(a, b){

				return a[orderBy] - b[orderBy];

			});

			return obs;
		}

	})
})();

"use strict";
(function(){
angular.module("stapi")

.directive("stCheckList", function(stUtil) {
	return {
		templateUrl: function(element, attrs){
			
			if(attrs.type){
				
				return  "global/st-api/st-check-list/html/"+attrs.type+".html";
			}
			//Template padrão
			else{
				return "global/st-api/st-check-list/html/stCheckList.html";
			}
		},
			
		scope: {
			crudOptions: "<",
			showBorderNoItems: "<",
			hideAdd: "<",
			hideCheckbox: "<",
			hideDeleteAll: "<",
			objetos: "=?",
			attrLabel:"@",
			attr:"@",
			trueValue: "@",
			falseValue:"@",
			showCrudTools:"<"
			
		},
		restrict: "E",
		bindToController: true,
		controllerAs:"vm",
		controller: "stCheckListController"
	}
})
})();
"use strict";
(function(){

	angular.module("stapi")
    .directive("breadcumb", stBreadcumb)
	.directive("stBreadcumb", stBreadcumb)

	function stBreadcumb(configUtil, stService, $rootScope, $route, $filter, stUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-api/st-breadcumb/html/stBreadcumb.html",
			controllerAs: "$stBreadcumbCtrl",
			bindController: true,
			controller: function($scope, $controller, stMenuUtil){
				var ctrl = this;
				ctrl.scope = $scope;
				ctrl.data = {};
				ctrl.data.changePath = function(path){
					
					stMenuUtil.changePath(path);
				}
			}

		}
	}

})();


"use strict";
(function(){

	angular.module("stapi")

	.controller("stMenuController", stMenuController);

	function stMenuController($scope, $rootScope, $timeout, $route, loginUtil, $location, stUtil , config, $mdSidenav, menuItems, sidenavId, stMenuUtil){

		var ctrl = this;
		ctrl.data = {};
		ctrl.data.toggleSideNav = toggleSideNav;
		ctrl.data.logOut = logOut;
		ctrl.data.changePath = changePath;
		ctrl.data.menuItems = menuItems;
		ctrl.data.sidenavId = sidenavId;
		$rootScope.menuItems = menuItems;

		$rootScope.$on('$routeChangeSuccess', function() {

			var path;

			if($route.current)
				path = 	$route.current.$$route.originalPath;

			else {
				$location.path(config.confs.notFoundPath|| "inicio");
				return;
			}

			if(config.confs.pathsToHideMenu && config.confs.pathsToHideMenu.indexOf(path)!=-1){

				ctrl.data.showMenu = false;
			}

			else
				ctrl.data.showMenu = true;

			if(path!=config.confs.loginPath)
				changePath(path);
		});

		function changePath(path){
			
			$timeout($mdSidenav(ctrl.data.sidenavId).close, 500);
			stMenuUtil.changePath(path);
		}

		function toggleSideNav(){
			$mdSidenav(ctrl.data.sidenavId).toggle();
		}

		function logOut(){

			$timeout($mdSidenav(ctrl.data.sidenavId).close, 500);
			loginUtil.logOut();

		}

	}	

})();


"use strict";

(function(){

	angular.module("stapi")
	.config(function(){
	
	});


})();


"use strict";
(function(){

	angular.module("stapi") 

	.factory('stMenuUtil', function($rootScope,$filter, stUtil, $location){


		var _changePath = function(path){

			var item;
			
			var menuItems =  $rootScope.menuItems;

			if(typeof path=='string'){
				path = path.replace("/","");
				var indexItem = stUtil.buscaOb(menuItems, path,"path");
				item = menuItems[indexItem] || {};
			}
			else{
				item = path;
			}
			$rootScope.currentPathIcon= item.icon;
			$rootScope.currentPathLabel = item.label;
			$rootScope.currentPath = item.path;
			document.title = item.label || '';

			//Histórico de navegação
			$rootScope.routeHistory = 	$rootScope.routeHistory || [];
			var routeHistory =   $rootScope.routeHistory;

			//Retira do histórico caso o item seja repetido
			var indexHistory = stUtil.buscaOb(routeHistory, item.label, "label");

			if(indexHistory!=-1){

				routeHistory.splice(indexHistory,1);
			}

			$rootScope.routeHistory.push(item);
			$location.path(item.path);

		}


		var _startOnboard = function(scope){


		}		

		return {

			startOnboard: _startOnboard,
			changePath: _changePath

		}

	})

})();

"use strict";
(function(){

	angular.module("stapi")

	/**
	 * @ngdoc controller
	 * @name stapi.controller:StControl
	 * @description Controlador genérico de requisições
	 * 
	 */

	.controller("genericListController", genericListController)
	.controller("genericListControl", genericListControl)
	.controller("genericDetalheController", genericDetalheController)

	function genericDetalheController($scope, stService, functionToDetailNotify, objectName, stCrudTools, $mdDialog, item){

		var ctrl = this;
		ctrl.data = {};
		ctrl.data.item = item;
		ctrl.scope = $scope;
		ctrl.data.loading = false;
		ctrl.data.cancelFunction = cancelFunction;
		ctrl.data.deleteFunction = deleteFunction;
		ctrl.data.saveFunction = saveFunction;

		function cancelFunction(){

			$mdDialog.cancel();
		}

		function deleteFunction(item){

			ctrl.data.loading = true;
			var options = {
					objectName: objectName,
					item: item,
					$mdDialog: $mdDialog,
					functionToNotify: functionToDetailNotify
			};
			stCrudTools.deleteAndNotify(options).then(function(){

				ctrl.data.loading = false;

			}).catch(function(){

				ctrl.data.loading = false;
			});

		}

		function saveFunction(item){

			ctrl.data.loading = true;
			var options = {
					objectName: objectName,
					item: item,
					$mdDialog: $mdDialog,
					functionToNotify: functionToDetailNotify
			};
			stCrudTools.saveAndNotify(options).then(function(data){

				ctrl.data.loading = false;
				ctrl.data.item.id  = data.item.id;


			}).catch(function(){

				ctrl.data.loading = false;
			});

		}
	}
	
	

	function genericListControl($scope, filtros, $route, $mdMedia, $mdDialog, options , config, $q, stService, stUtil,  $mdEditDialog, stCrudTools, $log){

		var ctrl = this;
		var  objectName  = options.objectName,
		detalheTemplateUrl = options.detalheTemplateUrl, 
		detalheController = options.detalheController,
		detalheControllerAs =  options.detalheControllerAs,
		fixProperties = options.fixProperties|| {},
		fixQuerys = options.fixQuerys || [];
		
		ctrl.scope = $scope;

		$scope.$on("filialChangeStart", function(evt, current, next){


		});

		$scope.$on("filialChangeSuccess", function(evt, current, previous){

			ctrl.data.filialChangeSuccess();
		});

		$scope.$on("filialChangeError", function(evt, current, next){


		});

		//Os propriedades e funções definidas em ctrl.data permitem override
		ctrl.data = {};

		ctrl.data.objectName = objectName;
		ctrl.data.filtros = filtros;
		ctrl.data.selectedItems = [];
		ctrl.showMdMenu = showMdMenu;
		ctrl.data.getSelectedItemsIds = getSelectedItemsIds;
		ctrl.data.resolveDetalheNotify = resolveDetalheNotify;

		//Funções de CRUD
		ctrl.data.getList = getList;
		ctrl.data.saveFunction = saveFunction;
		ctrl.data.openDetail = openDetail;
		ctrl.data.deleteFunction = deleteFunction;
		ctrl.data.editColumn = editColumn;
		ctrl.data.changeAttrValue = changeAttrValue;

		//Resolução do detalhamento do item
		ctrl.data.saveSuccesResolve =  saveSuccessResolve;
		ctrl.data.saveErrorResolve =  saveErrorResolve;
		ctrl.data.deleteSuccessResolve =  deleteSuccessResolve;
		ctrl.data.deleteErrorResolve =  deleteErrorResolve;
		ctrl.data.cancelResolve =  cancelResolve;

		//Alteração de filial
		ctrl.data.filialChangeStart = filialChangeStart;
		ctrl.data.filialChangeSuccess = filialChangeSuccess;
		ctrl.data.filialChangeError = filialChangeError;
		
		function filialChangeStart(){
             
		}

		function filialChangeSuccess(){
			
			 getList();
		}
		
		function filialChangeError(){

		}

		function cancelResolve(obj){

		}

		function saveSuccessResolve(obj){

			stUtil.showMessage("","Salvo com sucesso!");
			obj.$mdDialog.hide();
			
			if(obj.itemAnt.id){
				ctrl.data.getList();
			}
			
			else{
			    $route.reload();
			}

		}

		function saveErrorResolve(obj){
			stUtil.showMessage("","Ocorreu um erro ao salvar o item", "danger");
		}

		function deleteSuccessResolve(obj){

			stUtil.showMessage("","Item deletado com sucesso");
			obj.$mdDialog.hide();
			ctrl.data.getList();
		}

		function deleteErrorResolve(obj){
			stUtil.showMessage("","Ocorreu um erro ao deletar o item", "danger");
		}

		function resolveDetalheNotify(obj){

			var preMsg = "";

			if(obj.event == stCrudTools.CANCEL){

				ctrl.data.cancelResolve(obj);
			}

			else if(obj.event == stCrudTools.SAVE_SUCCESS){

				ctrl.data.saveSuccesResolve(obj);
			}

			else if(obj.event == stCrudTools.SAVE_ERROR){

				ctrl.data.saveErrorResolve(obj);

			}
			else if(obj.event == stCrudTools.DELETE_SUCCESS){

				ctrl.data.deleteSuccessResolve(obj);
			}
			else if(obj.event == stCrudTools.DELETE_ERROR){

				ctrl.data.deleteErrorResolve(obj);

			}

		}

		function getSelectedItemsIds(){

			var ids = [];
			ctrl.data.selectedItems.filter(function(item){

				ids.push(item.id);
			});

			return ids;
		}

		function showMdMenu($mdMenu, ev){

			$mdMenu.open(ev);
		}

		function editColumn (event, options) {
			event.stopPropagation(); // in case autoselect is enabled

			var editDialog = {
					modelValue:  stUtil.getValue(options.item, options.column),
					placeholder: options.placeholder,
					save: function (input) {

						stUtil.setValue(options.item, options.column, input.$modelValue);
						changeAttrValue(options.item.id, options.column, input.$modelValue);

					},
					targetEvent: event,
					title: options.title || "",
					validators: options.validators || {}
			};

			return  $mdEditDialog.small(editDialog);

		};

		function changeAttrValue(idItem, column, value){

			stService.changeAttrValue(objectName, idItem, column, value);
		}

		function saveFunction(_item){

			stService.save(objectName, _item).then(function(){

			});

		}

		function deleteFunction(ids){

			stService.delete(objectName, ids).then(function(){

				stUtil.showMessage("","Os itens foram deletados com sucesso!");
				getList();

			}).catch(function(){

				stUtil.showMessage("","Ocorreu um erro ao deletar os itens!","md-error");

			});

		}

		function openDetail(item, parent){
			

			if(typeof item === 'number'){

				stService.getById(objectName, item).then(function(data){

					var item =  setFixPropertiesToItem(data.item);
					showDetailDialog(item, parent);

				}).catch(function(){

					stUtil.showMessage("","Ocorreu um erro ao recuperar o item","danger");
				});

			}else {
			
				item = item || {};
				item = angular.copy(item);
				item = setFixPropertiesToItem(item);
				showDetailDialog(item, parent);
			}

		}
		
		function setFixPropertiesToItem(item){
			
			var fix = fixProperties || {};
			
			for(var key in fix){
				
				item = stUtil.setValueOfNivel(item, key, fix[key]);
			}
			
			return item;
			
		}

		function showDetailDialog(item, parent){

			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
			$mdDialog.show({
				controllerAs: detalheControllerAs,
				controller: detalheController,
				resolve:{
					item: function(){return  item},
					objectName: function(){ return objectName},
					functionToDetailNotify: function(){ return ctrl.data.resolveDetalheNotify},

				},
				templateUrl: detalheTemplateUrl,

				parent: parent || angular.element(document.body),
				clickOutsideToClose: false,
				multiple: true,
				fullscreen: config.fullScreenItemDetail || true,
				autoWrap: true
			})
			.then(function(res) {

			}, function() {

				stCrudTools.cancelAndNotify(ctrl.data.resolveDetalheNotify);

			});

		}

		function getList(){

			var deferred = $q.defer();
			ctrl.data.loading = true;
			ctrl.data.requestListParams.querys =  ctrl.data.requestListParams.querys || [];
			var fixQuerysAndFixProperties =  [];
			fixQuerysAndFixProperties = fixQuerysAndFixProperties.concat(stUtil.transformJSONToSqlComparators(fixProperties));
			fixQuerysAndFixProperties  = fixQuerysAndFixProperties.concat(fixQuerys);
			var paramOptions = angular.copy(ctrl.data.requestListParams);
			paramOptions.querys = paramOptions.querys || [];
			paramOptions.querys = paramOptions.querys.concat(fixQuerysAndFixProperties);
			stService.getList(paramOptions).then(function(data){
				
				if(ctrl.data.requestListParams.pagina!=0 && data.itens.length==0){
					ctrl.data.requestListParams.pagina = 0;
					getList();
					return;
				}

				ctrl.data.loading = false;
				deferred.resolve(data);
				ctrl.data.totalItens = data.countAll;
				ctrl.data.objetos = data.itens;
				ctrl.data.selectedItems = [];

			}).catch(function(){
				ctrl.data.loading = false;
				deferred.reject();
			});
			
			return deferred.promise;

		}

	}

	//DEPRECATED
	function genericListController($scope, filtros, $route, $mdMedia, $mdDialog, objectName, detalheTemplateUrl, detalheController, detalheControllerAs, config, $q, stService, stUtil,  $mdEditDialog, stCrudTools, $log){

		var ctrl = this;
		
		$log.warn("genericListController is now deprecated use genericListControl instead");
		
		ctrl.scope = $scope;


		$scope.$on("filialChangeStart", function(evt, current, next){


		});

		$scope.$on("filialChangeSuccess", function(evt, current, previous){

			ctrl.data.filialChangeSuccess();
		});

		$scope.$on("filialChangeError", function(evt, current, next){


		});

		//Os propriedades e funções definidas em ctrl.data permitem override
		ctrl.data = {};

		ctrl.data.objectName = objectName;
		ctrl.data.filtros = filtros;
		ctrl.data.selectedItems = [];
		ctrl.showMdMenu = showMdMenu;
		ctrl.data.getSelectedItemsIds = getSelectedItemsIds;
		ctrl.data.resolveDetalheNotify = resolveDetalheNotify;

		//Funções de CRUD
		ctrl.data.getList = getList;
		ctrl.data.saveFunction = saveFunction;
		ctrl.data.openDetail = openDetail;
		ctrl.data.deleteFunction = deleteFunction;
		ctrl.data.editColumn = editColumn;
		ctrl.data.changeAttrValue = changeAttrValue;

		//Resolução do detalhamento do item
		ctrl.data.saveSuccesResolve =  saveSuccessResolve;
		ctrl.data.saveErrorResolve =  saveErrorResolve;
		ctrl.data.deleteSuccessResolve =  deleteSuccessResolve;
		ctrl.data.deleteErrorResolve =  deleteErrorResolve;
		ctrl.data.cancelResolve =  cancelResolve;

		//Alteração de filial
		ctrl.data.filialChangeStart = filialChangeStart;
		ctrl.data.filialChangeSuccess = filialChangeSuccess;
		ctrl.data.filialChangeError = filialChangeError;
		
		function filialChangeStart(){
             
		}

		function filialChangeSuccess(){
			
			 getList();
		}
		
		function filialChangeError(){

		}

		function cancelResolve(obj){

		}

		function saveSuccessResolve(obj){

			stUtil.showMessage("","Salvo com sucesso!");
			obj.$mdDialog.hide();
			
			if(obj.itemAnt.id){
				ctrl.data.getList();
			}
			
			else{
			    $route.reload();
			}

		}

		function saveErrorResolve(obj){
			stUtil.showMessage("","Ocorreu um erro ao salvar o item", "danger");
		}

		function deleteSuccessResolve(obj){

			stUtil.showMessage("","Item deletado com sucesso");
			obj.$mdDialog.hide();
			ctrl.data.getList();
		}

		function deleteErrorResolve(obj){
			stUtil.showMessage("","Ocorreu um erro ao deletar o item", "danger");
		}

		function resolveDetalheNotify(obj){

			var preMsg = "";

			if(obj.event == stCrudTools.CANCEL){

				ctrl.data.cancelResolve(obj);
			}

			else if(obj.event == stCrudTools.SAVE_SUCCESS){

				ctrl.data.saveSuccesResolve(obj);
			}

			else if(obj.event == stCrudTools.SAVE_ERROR){

				ctrl.data.saveErrorResolve(obj);

			}
			else if(obj.event == stCrudTools.DELETE_SUCCESS){

				ctrl.data.deleteSuccessResolve(obj);
			}
			else if(obj.event == stCrudTools.DELETE_ERROR){

				ctrl.data.deleteErrorResolve(obj);

			}

		}

		function getSelectedItemsIds(){

			var ids = [];
			ctrl.data.selectedItems.filter(function(item){

				ids.push(item.id);
			});

			return ids;
		}

		function showMdMenu($mdMenu, ev){

			$mdMenu.open(ev);
		}

		function editColumn (event, options) {
			event.stopPropagation(); // in case autoselect is enabled

			var editDialog = {
					modelValue:  stUtil.getValue(options.item, options.column),
					placeholder: options.placeholder,
					save: function (input) {

						stUtil.setValue(options.item, options.column, input.$modelValue);
						changeAttrValue(options.item.id, options.column, input.$modelValue);

					},
					targetEvent: event,
					title: options.title || "",
					validators: options.validators || {}
			};

			return  $mdEditDialog.small(editDialog);

		};

		function changeAttrValue(idItem, column, value){

			stService.changeAttrValue(objectName, idItem, column, value);
		}

		function saveFunction(_item){

			stService.save(objectName, _item).then(function(){

			});

		}

		function deleteFunction(ids){

			stService.delete(objectName, ids).then(function(){

				stUtil.showMessage("","Os itens foram deletados com sucesso!");
				getList();

			}).catch(function(){

				stUtil.showMessage("","Ocorreu um erro ao deletar os itens!","md-error");

			});

		}

		function openDetail(item, parent){
			

			if(typeof item === 'number'){

				stService.getById(objectName, item).then(function(data){

					var item =  data.item;
					showDetailDialog(item, parent);

				}).catch(function(){

					stUtil.showMessage("","Ocorreu um erro ao recuperar o item","danger");
				});

			}else {
			
				item = item || {};
				item = angular.copy(item);
				showDetailDialog(item, parent);
			}

		}
		
		

		function showDetailDialog(item, parent){

			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
			$mdDialog.show({
				controllerAs: detalheControllerAs,
				controller: detalheController,
				resolve:{
					item: function(){return  item},
					objectName: function(){ return objectName},
					functionToDetailNotify: function(){ return ctrl.data.resolveDetalheNotify},

				},
				templateUrl: detalheTemplateUrl,

				parent: parent || angular.element(document.body),
				clickOutsideToClose: false,
				multiple: true,
				fullscreen: config.fullScreenItemDetail || true,
				autoWrap: true
			})
			.then(function(res) {

			}, function() {

				stCrudTools.cancelAndNotify(ctrl.data.resolveDetalheNotify);

			});

		}

		function getList(){

			var deferred = $q.defer();
			ctrl.data.loading = true;
			ctrl.data.requestListParams.querys =  ctrl.data.requestListParams.querys || [];
			
			stService.getList(ctrl.data.requestListParams).then(function(data){
				
				if(ctrl.data.requestListParams.pagina!=0 && data.itens.length==0){
					ctrl.data.requestListParams.pagina = 0;
					getList();
					return;
				}

				ctrl.data.loading = false;
				deferred.resolve(data);
				ctrl.data.totalItens = data.countAll;
				ctrl.data.objetos = data.itens;
				ctrl.data.selectedItems = [];

			}).catch(function(){
				ctrl.data.loading = false;
				deferred.reject();
			});
			
			return deferred.promise;

		}

	}


})();

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

"use strict";
(function(){

	angular.module("stapi") 

	.factory("loginUtil", loginUtil);

	function loginUtil(cacheGet,$localStorage,$rootScope,$cookieStore,stService,filialUtil, $location, dateUtil, $mdDialog, st, config){

		var _openModalDateErro = function(){

			$mdDialog.show({
				animation: true,
				templateUrl:"global/st-api/app-login/template-module/modalDateErro.html",
				size:'lg',
				controller:function($scope){

				}
			});

		}

		var _openLembrarSenha = function(){

			$mdDialog.show({
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

						stService.executeGet("/lembrar-senha-sms", {numero: _numero}).then(function(res){

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
			delete $rootScope.currentFilial;
			delete $rootScope.user;
			delete $rootScope.authToken;
			delete $rootScope.usuarioSistema;
			delete $localStorage.senha;
			$cookieStore.remove('authToken');
			$cookieStore.remove('usuarioSistema')
			var confs = config.confs || {};
			$location.path(confs.loginPath || "login");
		};

		var _configureSystemForUser = function(loginData){
			
			var filiais = loginData.filiais;
			$rootScope.filiais = filiais;

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
			var tenantConfs =  loginData.config.confs;
			var staticConfs = config.confs;
			console.log("Configurações estáticas !!!!!!");
			console.log(staticConfs);
			var confsToApply = staticConfs;
			for(var key in tenantConfs ){
				
				confsToApply[key] = tenantConfs[key];
			}
			//Aplica as configurções em config
			
		
			config.confs = confsToApply;
			
			$cookieStore.put('usuarioSistema', usuarioSistema);

			var idFilialInConfig = parseInt($rootScope.config.confs.currentFilialId);
			
			var filiaisPermitidas = [];
			
			if(usuarioSistema.filiaisPermitidas && usuarioSistema.filiaisPermitidas.length>0)
				filiaisPermitidas = $rootScope.usuarioSistema.filiaisPermitidas.split(",");
			
			//Filial salva nas configuraçõs e  (está na lista de permitidas ou a lista de permitidas está vazia)
			if(idFilialInConfig>0 && ( filiaisPermitidas.indexOf(idFilialInConfig+"")!=-1 || filiaisPermitidas.length==0 )){
				$rootScope.currentFilial = filialUtil.getFilialById(idFilialInConfig);
			}
			
			else  {
			var filteredFiliais = filiais.filter(function(filial){
				
				if(filiaisPermitidas.indexOf(filial.id+"")!=-1)
					return filial;
			});
			
			//Seta a primeira filial permitida como current
			$rootScope.currentFilial = filteredFiliais[0];
			}
			
			//Caso a filial não seja definida em nenhuma condição, a filial Matriz é setada
			if(!$rootScope.currentFilial || !$rootScope.currentFilial.id)
				$rootScope.currentFilial = {id: 1, nome: "Matriz"};
			
		}

		var _logar = function(login, lembrarSenha, callback){
			
			if(!login.empresa){
				callback();
			}

			$localStorage.empresa = login.empresa;
			$localStorage.usuario = login.usuario;

			if(lembrarSenha==true)
				$localStorage.senha = login.senha;
			else{

				delete  $localStorage.senha;
			}

			//remove o token antigo
			$cookieStore.remove('authToken');

			stService.executePost("/user/login/", login).then(function(data){

				//Verifica se a data do computador é a mesma do backend
				var dataFrontEnd  = dateUtil.getDate(new Date());
				var dataBackEnd = dateUtil.getDate(data.dataBackEnd);

				if(dataFrontEnd.getTime() != dataBackEnd.getTime()){
			           $mdDialog.show(
						      $mdDialog.alert()
						        .parent(angular.element(document.body))
						        .clickOutsideToClose(true)
						        .title('Data incorreta')
						        .htmlContent('<p>A data do seu dispositivo está incorreta. Isso pode ocasionar erros no uso do sistema.</p>')
						        .ok('OK')
						  
						    );
					
				}

				_configureSystemForUser(data);
				callback(data);

			}).catch(function(data,erro){

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
	}

})();

"use strict";
(function(){

	angular.module("stapi")

	.controller("buttonFilialCtrl", buttonFilialController);
	
	function buttonFilialController($scope, $rootScope, $timeout, $localStorage, configUtil, cacheGet, stUtil){

		var ctrl = this;
		ctrl.scope = $scope;
		ctrl.changeFilial = changeFilial;
		
		$rootScope.$watch("currentFilial",function(currentFilial){

			if(currentFilial)
				ctrl.currentFilial = currentFilial;
		});
		
		$rootScope.$watch("filiais",function(filiais){

			if(filiais)
				ctrl.filiais = filiais
		});

	
		function changeFilial(filial){
			
			var previousFilial = ctrl.currentFilial;
			
			
		$rootScope.$broadcast("filialChangeStart", ctrl.currentFilial, filial);
			
			if(filial.bloqueada==1){
                 
				stUtil.showMessage("","A origem '"+filial.nome+"' está bloqueada.","danger");
				return;
			}

			if($scope.filiaisPermitidas!=null && $scope.filiaisPermitidas.indexOf(filial.id+"")==-1){

				stUtil.showMessage("","A origem '"+filial.nome+"' não está disponível para este usuário","danger");
				return;
			}
			
			//ctrl.currentFilial = filial;
			$rootScope.currentFilial = filial;
			$localStorage.currentFilial = filial;
			stUtil.showMessage("","Origem alterada para  '"+filial.nome || filial.xNome+"'.","info");
			
			$rootScope.$broadcast("filialChangeSuccess", ctrl.currentFilial, previousFilial);
			
			//atualizar caches
			/*
			cacheGet.getOfflineCache(function(){

				stUtil.showMessage("","Origem alterada para  '"+filial.nome || filial.xNome+"'.","info");

			});
			*/
		
		}

	}

})();

"use strict";

(function(){

	angular.module("stapi")

	.factory("filialUtil", filialUtil)
	
	function filialUtil(stService,$rootScope,$localStorage,stUtil,st,$mdDialog,$http,config){

		//Abre os detalhes da filial para edição
		var _openDetalheCurrentFilial= function(filial,callback){

			$mdDialog.show({
				animation: true,
				templateUrl:'global/st-api/st-filial/html/modalDetalheFilial.html',
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
						$http.post(stService.getBaseUrl()+"filial/upload-certificado/", fd, {
							transformRequest : angular.identity,
							headers : {
								'Content-Type' : undefined
							}
						}).then(function(data) {

							$rootScope.currentFilial.nomeCertificado = data.item;
							$scope.filial.nomeCertificado = data.item;
						}).catch(function() {

						});
					}

					$scope.salvar = function(filial){

						stService.save("filial",filial).then(function(data){

							stUtil.showMessage("","Salvo com sucesso","info");	

							if(callback)
								callback(data.item);
						});

					}

				}
			});
		}

		var _getAllFiliais = function(callback){

			stService.getAll("filial").then(function(data){

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

			}).catch(function(){
				
				callback();
			});

		}

		var _getFilialById = function(id){

			var filial ={};

			var index = stUtil.buscaOb($rootScope.filiais, id, "id");

			if(index!=-1)
				filial = $rootScope.filiais[index];

			return filial;

		}

		return {

			getFilialById:_getFilialById,
			getAllFiliais:_getAllFiliais,
			openDetalheCurrentFilial: _openDetalheCurrentFilial
		}

	}

})();


"use strict";
(function(){

	angular.module("stapi")

	.directive("buttonFilial", buttonFilial)
	.directive("alertFilial", alertFilial)
	.directive("setAllFilials", setAllFilials);

	function buttonFilial(filialUtil, $mdDialog){
		
		return{
			templateUrl:"global/st-api/st-filial/html/buttonFilial.html",
			controllerAs:"$buttonFilialCtrl",
			bindToController: "true",
			controller: "buttonFilialCtrl"

		}

	}

	function alertFilial(filialUtil){

		return{
			templateUrl:"global/st-api/st-filial/html/alertFilial.html",
			scope:{
				label:"="
			},
			controller:function($scope,$rootScope){

				$scope.currentFilial = $rootScope.currentFilial;
			}

		}

	}

	function setAllFilials(filialUtil){

		return{
			templateUrl:'global/st-api/st-filial/html/setAllFilials.html',
			scope:{
				objeto:"=",
				defaultValue:"=",//true ou false
			},
			controller :function($scope,$rootScope){

				if($scope.defaultValue=="true")
					$scope.defaultValue = true;
				else if($scope.defaultValue=="false")
					$scope.defaultValue=false;

				$scope.filiais = $rootScope.filiais;

				if(!$scope.objeto)
					$scope.objeto  = {allFilials:true};

				if(!$scope.objeto.id){
					$scope.objeto.allFilials = $scope.defaultValue || false;

				}

			}

		}

	}

})();


"use strict";
(function(){
angular.module("stapi").controller("cadastrosController",function($scope,stService,$rootScope,stUtil,$filter,cadastrosUtil){


	$scope.apagar = function(op,index){


		stService.apagar("opcao",[op.id]).then(function(){
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

		stService.getLikeMap("opcao",["descricao='"+descricao+"'"],0,0,'').then(function(data){

			$scope.opcoes = data.itens;
		});

	}

});
})();

"use strict";
(function(){
angular.module("stapi").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/cadastros",{

		templateUrl:"global/st-api/cadastros/template-route/cadastros.html",
		controller:"cadastrosController"

	}); 

})
})();



"use strict";
(function(){

	angular.module("stapi") 

	.factory('cadastrosUtil', function($rootScope,$filter, stUtil,$mdDialog){

		var	_openCadastro = function(cadastro,callback){

			var _modalInstance =   $mdDialog.show({
				animation: true,
				templateUrl:"global/st-api/cadastros/template-module/detalheCadastro.html",
				size:'lg',
				controller:function($scope,stService,stUtil){

					$scope.cadastro = cadastro;

					$scope.fechar = function(modal){

						modal.$dismiss("");

					}

					$scope.salvar = function(cadastro,modal){

						stService.save("opcao",cadastro).then(function(data){

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

	angular.module("stapi")

	//Configurações do sistema
	.factory("configUtil", configUtil);
	
	
	function configUtil ($mdDialog, stService, $rootScope, stUtil, $localStorage, $location){

		
		
		var _getConfig = function(callback){

				stService.getAll("config").then(function(data){
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

			stService.save("config",config).then(function(data){

				$rootScope.config=data.item;

				if(callback)
					callback(data.item)

			});

		}


		var _openConfig = function(tab, callback){

			$mdDialog.show({
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

						stService.save("config",conf).then(function(data){

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

			openConfig: _openConfig,
			getConfig: _getConfig,
			setConfig: _setConfig
			
		};

	}

})();

"use strict";
(function(){
	
	angular.module("stapi")
	
	.directive('buttonOpenConfig', buttonOpenConfig);
	
	 function buttonOpenConfig(configUtil) {
		return {
			templateUrl:"global/st-api/st-config/html/button-config.html",
			
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
	}

})();

"use strict";
(function(){

	angular.module("stapi") 
	
	//Diretiva para Status de carregamento
	.directive('stPagination', stPagination);
	
	 function stPagination(anchorScroll) {
		return {
			restrict: 'AE',
			templateUrl:'global/st-api/st-pagination/html/stPagination.html',
			scope:{
                
				idElementToScroll:"@",
				querys:"=",//Querys bindadas

			},
			controller:function($scope, $rootScope){
				
				$scope.pagina=0;
				$scope.max = $rootScope.config.confs.maxItensPage || 7

				$scope.setPagina = function(pagina){

					anchorScroll.scrollTo($scope.idElementToScroll || "anchor_cima");
					$scope.pagina=pagina;
					
					if($scope.$parent.getLikeMap){
				     	$scope.$parent.getLikeMap($scope.querys||[''],$scope.pagina, $rootScope.config.confs.maxItensPage||7, "", "id", "DESC");
					}

				}

			}

		}
	}
	

})();

"use strict";
(function(){

	angular.module("stapi")

	.directive("stStringCheck", stInputChip)

	function stInputChip(stUtil){

		return {

			restrict:"E",
			templateUrl: 'global/st-api/st-string-check/html/stStringCheck.html',
			controllerAs: "ctrl",
			bindToController: true,
			scope: {
				ngModel:"=",
				items: "<",
				titulo: "@"
			},
			controller: function($scope){

				var ctrl = this;
				ctrl.selected = ctrl.ngModel?   ctrl.ngModel.split(",") : [];
			
				
				$scope.$watch("ctrl.selected", function(value){

					ctrl.ngModel = value.join();
				}, true);
				
				ctrl.toggle = function (item, list) {
					
					var idx = stUtil.buscaOb(list, item, "attr");
					if (idx > -1) {
						list.splice(idx, 1);
					}
					else {
						list.push(item);
					}
				};

				ctrl.exists = function (item, list) {
					return stUtil.buscaOb(list, item, "attr") > -1;
				};

				ctrl.isIndeterminate = function() {
					return (ctrl.selected.length !== 0 &&
							ctrl.selected.length !== ctrl.items.length);
				};

				ctrl.isChecked = function() {
					return ctrl.selected.length === ctrl.items.length;
				};

				ctrl.toggleAll = function() {
					if (ctrl.selected.length === ctrl.items.length) {
						ctrl.selected = [];
					} else if (ctrl.selected.length === 0 || ctrl.selected.length > 0) {
						var array =  ctrl.items.slice(0);
						var arrayInt = [];
						for(var i in array){

							arrayInt.push(array[i].attr);
						}
						ctrl.selected  =arrayInt;
					}
				};

			}
		}

	}


})();

"use strict";
(function(){

	angular.module("stapi")
	
	.directive("stStringChip", stInputChip)
	
	function stInputChip(){
		
		return {
			
			restrict:"E",
			template: ' <md-chips ng-model="ctrl.items"  placeholder="{{ctrl.placeholder}}"></md-chips>',
			controllerAs: "ctrl",
			bindToController: true,
			scope: {
			   ngModel:"=",
			   placeholder: "@"
			},
			controller: function($scope){
				
				var ctrl = this;
				ctrl.items = ctrl.ngModel ? ctrl.ngModel.split(",") : [];
				
				$scope.$watch("ctrl.items", function(value){
					
					if(value)
					ctrl.ngModel = value.join();
				});
			}
		}
		
	}
	
	  
})();

"use strict";
(function(){

	angular.module("stapi") 
	.directive('stVerticalSpace', stVerticalSpace)
	.directive("stPanel", stPanel)
	.directive("panel", stPanel)
	.directive("stToolbar", stToolbar)
	
	
	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-toolbar
	 * @restrict E
	 **/
	function stToolbar(){

		return{
			restrict:"E",
			transclude: true,
			templateUrl:"global/st-api/st-layout/html/stToolbar.html"
			
		}
	}

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-vertical-space
	 * @restrict E
	 * @description adicionar uma margen  vertical padrão de 15px
	 **/
	function stVerticalSpace(){

		return{
			restrict:"E",
			replace:true,
			template:'<div class="row col-lg-12"><div style="margin: 15px;"></div></div>'
		}
	}

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-panel
	 * @restrict E
	 * @example
	 **/
	function stPanel(){

		return{

			restrict:"E",
			transclude: true,
			template: '<div class="panel"><div class="panel-body"></div></div>',
			link: function(scope, element, attrs, ctrl, transclude) {

				transclude(scope, function(clone) {
					
					element.children(0).children(0).append(clone);
				
				});
			}

		}
	}

})();

"use strict";
(function(){

	angular.module("stapi") 

	.directive("stFilterPagination",stFilterPagination)
	.directive("stFilter",stFilter)
	.directive("stFilterMap",stFilterMap)

	function stFilterPagination(){

		return {
			templateUrl:'global/st-api/st-filter/html/stFilterPagination.html',
			restrict:"E",
			scope:{

				queryOptions: "=",
				getList: "=",
				totalItens: "=",
				itensInPage:"=",
				filtros: "<"

			},
			bindToController: true,
			controllerAs:"vm",
			controller:"stFilterPaginationController"
		}

	}

	function stFilter(){

		return {
			templateUrl:'global/st-api/st-filter/html/stFilter.html',
			restrict:"E",
			scope:{

				filtros:"=",//Filtros do tipo String
				queryOptions: "=",
				getList: "="

			},
			bindToController: true,
			controllerAs:"vm",
			controller:"stFilterController"
		}

	}

	function stFilterMap($filter, $rootScope){

		return {
			templateUrl:'global/st-api/st-filter/html/stFilterMap.html',
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

	}
})();

"use strict";
(function(){

	angular.module("stapi") 

	.controller("stFilterController", stFilterController)

	.controller("stFilterPaginationController", stFilterPaginationController)

	function stFilterPaginationController($scope, config, $anchorScroll,  $location){

		var vm = this;
		vm.scope = $scope;

		vm.setPagina = function(pagina){

			$location.hash('top');
			$anchorScroll();
			vm.queryOptions.pagina = pagina;
			vm.getList(vm.queryOptions);

		}
	}

	function stFilterController($scope){

		var vm = this;
		vm.scope = $scope;

		vm.openMenuFiltros = function($mdMenu, ev){

			$mdMenu.open(ev);
		}

		vm.executarBusca = function(){

			var query = getQueryFromFilter(vm.filtroAtivo);
			vm.queryOptions.querys = [query]; 

			//Garante que a busca comece na primeira página
			vm.queryOptions.pagina = 0;

			//Excuta a função de busca bindada ao componente
			vm.getList(vm.queryOptions);
		}


		//Altera o filtro ativo
		vm.changeFiltroAtivo = function(filtro){

			vm.filtroAtivo = filtro;

		}

		function getQueryFromFilter(filtro){

			var queryValue = filtro.value;
			var query  = "";

			if(filtro.value.length>0){

				//Definie like como operador padrão caso não seja definido
				filtro.operator  = filtro.operator || "like";
				var operator =  filtro.operator;

				//Adiciona aspas na query caso o operador seja do tipo like
				if(operator === "like"){
					queryValue = "'%"+queryValue+"%'";
				}

				query = filtro.attr +" "+  operator + " " + queryValue+" ";

			}
			return query;
		}

		function init(){

			vm.filtroAtivo = vm.filtros[0];
		}
		init();
	}

})();

"use strict";
(function(){

	angular.module("stapi.stAutoComplete", ["stapi"]);

})();

"use strict";
(function(){

	angular.module("stapi") 

	.directive('stAutoComplete', stAutoComplete)
	.directive('autoComplete', stAutoComplete);


	/**
	 * @ngdoc  directive
	 * @name stapi.directive: st-auto-complete
	 * @param {String@}  label  Texto que aparecerá acima da caixa de texto, ex: Nome do cliente
	 * @param {String@}  objectName  Nome do objeto que será utilizado na pesquisa (Em camel case), ex: Cliente
	 * @param {String@}  attr  Atributo do objeto que será utilizado na pesquisa , ex: nome
	 * @param {Object=}  ng-model  Objeto no escopo a qual o elemento está relacionado , ex: empresa
	 * @param {String@}  initialBusca  Expressão padrão para busca de objeto, ex: Paulo
	 * @param {String@}  extraClass  Classe css extra a ser adicionada ao elemento input da diretiva
	 * @param {String@}  labelCad  Texto a ser exibido no botão de cadastro de novo item
	 * @param {String@}  placeHolderBusca  place-holder do input de busca
	 * @param {Boolean=}  valueOnly  se true, não seta o objeto inteiro no model, apenas o valor(objjeto[attr])
	 * @example
	 * <p>Exemplo utilizando Um Objeto</p>
	 * <pre>
	 * <auto-complete 
	        label="Nome do cliente"
	        object-name="Cliente"
	        attr="nome",
	        ng-model="empresa" 
            initial-busca="João"  
		    extra-class="input-lg"  
		    label-cad="Cadastrar novo Cliente" 
		    place-holder="Primeiro, digite o nome do cliente"  
		    >
		 </auto-complete>
	 *</pre>
	 *<p>Exemplo utilizando com.siertech.stapi.opcao</p>
	 *<pre>
	 * <st-auto-complete     
		    label-cad="Cadastrar categoria teste" 
		    place-holder="placeHolderCategoria"  
		    object-name="Opcao"  
		    attr="valor" label="Descrição"
		    fix-properties="{descricao:'categoria_teste'}" 
		    ng-model="categoria" 
		    value-only="true"
		    initial-busca=""
		  </st-auto-complete>
		  </pre>
	 **/
	function stAutoComplete() {
		return {
			restrict: 'E',
			require:'ngModel, objectName',

			scope:{

				placeholder:"@",
				label:"@",
				listItemIcon:"@",
				idInput:"@",
				objectName:"@",//nome do objeto Objeto (Em camel case)
				getCompleteObject:"<", // se true o objeto completo é definido no model e não apenas attr e id, se o atributo for do tipo genérico, o objeto e setado por completo de qualquer maneira
				attr:"@",
				ngModel: "<",
				initialBusca:"@",//String a ser setada no campo de busca (input)
				fixProperties:"<",//Propriedades fixas do objeto, usada tanto para cadastros tanto para buscas
				valueOnly:"<",//se true, não seta o objeto inteiro no model, apenas o valor(objjeto[attr])
				resultadoBusca:"=",//Bind para resultados da busca
				useCache:"<",//cacheGet
				autoShowBusca:"<"//Mostra a tela de busca automaticamente
			},
			
			templateUrl:"global/st-api/st-autocomplete/html/stAutoComplete.html",
			controller: "stAutoCompleteController",
			bindToController:true,
			controllerAs:"$stAutoCompleteCtrl"
			
		}

	}


})();

"use strict";
(function(){

	angular.module("stapi") 

	.controller('stAutoCompleteController', stAutoCompleteController)

	function stAutoCompleteController($scope, $element, stService, stUtil, $mdDialog, $timeout ,cacheGet, genericUtil, $log, $mdMedia, $rootScope){

		var $modalInstance;
		var ngModelCtrl = $element.controller('ngModel');

		var ctrl = this;
		ctrl.scope = $scope;
		ctrl.parent     = $scope.$parent;

		//Funções do escopo
		ctrl.buscarItem = buscarItem;
		ctrl.openBusca = openBusca;
		ctrl.fecharDialog  = fecharDialog;
		ctrl.getValueOfNivel = getValueOfNivel;
		ctrl.cadastrarItem = cadastrarItem;
		ctrl.selecionarItem = selecionarItem;
		ctrl.loadingIsVisible = loadingIsVisible;

		if(!ctrl.objectName){
			$log.error("O parâmetro object-name deve ser informado");
			return;
		}

		function fecharDialog(){

			$mdDialog.hide();
		}
		
		function loadingIsVisible(){
			
			return ctrl.loading;
		}

		function openBusca (parentElement){

			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
			$mdDialog.show({
				templateUrl:"global/st-api/st-autocomplete/html/buscaStAutoComplete.html",
				scope: $scope.$new(),
				controller: function($scope){

					//Busca Inicial
					if(ctrl.initialBusca !=undefined ){

						ctrl.buscarItem(ctrl.initialBusca );
					}
				},
				parent: parentElement || angular.element(document.body),
				clickOutsideToClose: false,
				multiple: true,
				fullscreen: useFullScreen

			});

		}

		//Busca de itens
		function buscarItem(valueattr){

			valueattr = valueattr||'';

			//Sem Cache (Busca remota)	
			//!ctrl.useCache || ctrl.useCache==false
			if(!ctrl.useCache || ctrl.useCache==false)	{

				var query = ctrl.attr+" like '%"+valueattr+"%'";
				var qs = [];

				//Adiciona querys das propriedades fixas
				qs = qs.concat(stUtil.transformJSONToSqlComparators(ctrl.fixProperties));
				qs.push(query);
				var objeto = ctrl.objectName;
				objeto = objeto[0].toUpperCase() + objeto.slice(1);
				var subattr="";
				if(ctrl.subattr){

					subattr =","+ctrl.subattr.attr;
				}

				var columnsToQuery="";

				if(genericUtil.isGenericQuery(ctrl.attr)){

					columnsToQuery="";
				}
				else{
					columnsToQuery = "id,"+ctrl.attr+subattr||"*";
				}

				var ops = {
						qs : qs,	
						columns:columnsToQuery,
						groupBy:"id",
						objeto:objeto
				};

				ctrl.loading=true;

				stService.getProjecoes(ops).then(function(data){
					ctrl.loading=false;
					ctrl.obs = data.itens;

				}).catch(function(){
					ctrl.loading=false;
					ctrl.messageResult="Ocorreu um erro, tente novamente.";
				});
			} 

			//Busca em cache
			else{

				var ini = new Date();
				var itens = cacheGet.get(ctrl.objectName.toLowerCase(), ctrl.attr, valueattr);

				itens = jlinq.from(itens)
				.starts(ctrl.attr, valueattr)
				.select();
				var its = [];
				for(var i in itens){

					its.push([itens[i].id,itens[i][ctrl.attr]]);
				}
				ctrl.obs = its;
			}
		}

		function getValueOfNivel(item, attr){

			return stUtil.getValueOfNivel(item, attr);
		}

		function cadastrarItem(value, allFilials){

			var attr = ctrl.attr;
			var fix = ctrl.fixProperties;
			ctrl.loading = true;
			var ob = {};
			stUtil.setValueOfNivel(ob, attr, value);

			//Atributos pre-definidos
			for(var k in fix){
				ob[k] = fix[k];	
			}

			//auxItemFilial
			ob["allFilials"] = allFilials;

			var query = attr+" = '"+stUtil.getValueOfNivel(ob, attr)+"'";
			var qs = [];
			qs.push(query);

			//Propriedades fixas
			qs = qs.concat(stUtil.transformJSONToSqlComparators(ctrl.fixProperties));

			stService.getLikeMap(ctrl.objectName.toLowerCase(), qs ,0, 0, "").then(function(data){

				if(data.itens.length>0){
					stUtil.showMessage("","Já existe um registro com '"+stUtil.getValueOfNivel(ob, attr)+"' cadastrado no sistema","danger");
					ctrl.loading = false;
					return;
				}
				else {

					stService.save(ctrl.objectName.toLowerCase(), ob).then(function(data){

						cacheGet.add(ctrl.objectName.toLowerCase(), [data.item]);
						var objeto=[data.item.id, stUtil.getValueOfNivel(data.item, attr)];
						ctrl.selecionarItem(objeto);
						value="";
						ctrl.loading = false;
						stUtil.showMessage("","'"+stUtil.getValueOfNivel(ob, attr)+"' cadastrado com sucesso!","info");
						$mdDialog.hide();
					}).catch(function(){

						stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet.","danger");
						ctrl.loading = false;
						$mdDialog.hide();
					});
				}

			}).catch(function(){

				stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet.","danger");
				ctrl.loading = false;
			});

		}

		function selecionarItem (item){

			ctrl.labelValue="";

			if(ctrl.getCompleteObject==true || genericUtil.isGenericQuery(ctrl.attr)){
				
				ctrl.loading = true;
				stService.getById(ctrl.objectName.toLowerCase(),item[0] || item.id).then(function(data){

					ctrl.loading = false;
					data.item[ctrl.attr] = item[1] || stUtil.getValueOfNivel(item, ctrl.attr);
					setValueItem(data.item);
					$mdDialog.hide();
				}).catch(function(){
					ctrl.loading = false;
				});
			}
			else{
				var ob = {};
				ob.id = item[0] || item.id;
				ob[ctrl.attr] = item[1] || stUtil.getValueOfNivel(item, ctrl.attr);
				setValueItem(ob);
				$mdDialog.hide();

			}

		}

		function setValueItem(objetoSele){

			var viewValue;
			//Valor simples
			if(ctrl.valueOnly==true){
				viewValue = objetoSele[ctrl.attr];	
				ctrl.showValue =  objetoSele[ctrl.attr];
			}

			//Objeto com atributos genéricos
			else if(genericUtil.isGenericQuery(ctrl.attr)){

				viewValue = objetoSele;
				ctrl.showValue = stUtil.getValueOfNivel(objetoSele, ctrl.attr);

			}

			//Objeto composto
			else{
				viewValue = objetoSele;
				ctrl.showValue =  objetoSele[ctrl.attr];
			}

			ngModelCtrl.$setViewValue(viewValue);
			ctrl.attrValue = objetoSele[ctrl.attr];
			ctrl.obs =null;

		}

	

		function init(){

			if(!ctrl.ngModel)
				return;

			if(ctrl.valueOnly!=true){
				setValueItem(ctrl.ngModel);
				ctrl.definidoNoInit = ctrl.ngModel;
			}
			else{

				ctrl.showValue = ctrl.ngModel;
			}

			ctrl.placeHolderBusca = ctrl.placeHolderBusca ||'Digite um termo para buscar';
			var lastKeyUp = 0;

			if(ctrl.autoShowBusca==true)
				ctrl.openBusca();
		}

		init();
	}
})();

"use strict";
(function(){

	angular.module("stapi") 

	.directive('stModalContent', stModalContent)
	.directive('modalContent', stModalContent)
	.directive('stDetalheContent', stDetalheContent)
	.directive("stModal", stModal);

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-modal-content 
	 * @restrict E
	 * @example
	 * <pre>
	 *    <st-modal-content item="vm.item" modal-instance="this" loading-ok-action="vm.salvandoItem" ok-action="vm.salvarItem"  delete-action="vm.deletarItem"icone-titulo="'list'" titulo="' Titulo  '">
	 *    </st-modal-content>
	 * </pre>
	 **/

	function stModalContent() {

		return {
			//templateUrl:'global/st-api/st-modal/template-module/modalContent.html',
			templateUrl:'global/st-api/st-modal/html/modalContent.html',
			restrict:"E",
			transclude:true,
			scope:{

				titulo: "=",
				iconeTitulo: "=",
				modalInstance: "=",
				labelCloseButton: "=",
				disableOkButton:"=",
				loadingOkAction:"=",
				okAction:"<",
				okActionLabel:"=",
				forceOkActionShowLabel:"=",//se true força a exibição do label presente no okAcion
				okActionIcon:"=",
				cancelAction:"=",
				deleteAction:"=",
				item: "="//Objeto referencia, ex: pdv

			},
			bindToController: true,
			controllerAs: "vm",
			controller: function($scope, $timeout){

				var vm = this;
				vm.callToCancelAction= function(ctrl){

					if(vm.cancelAction)
						vm.cancelAction(ctrl);

					else if(vm.modalInstance)
						vm.modalInstance.$dismiss("cancel");

				}


			}

		};
	}
	
	
	function stDetalheContent() {

		return{

			templateUrl:"global/st-api/st-modal/html/detalheContent.html",
		    transclude: true,
		    replace: true,
		    scope: {
		    	controller: "<"
		    },
		    bindToController: true,
		    controllerAs:"$stDetalheCtrl",
		    controller: function($scope){
		    	var ctrl = this;
		    	ctrl.parent = ctrl.controller;
		      
		    }
		   
		}

	}


	function stModal($filter){

		return {

			templateUrl:"global/st-api/st-modal/html/stModal.html",
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

	}

})();

"use strict";
(function(){
angular.module("stapi")

.directive("stSelectedItemsActions", stSelectedItemsActions);

function stSelectedItemsActions(){
	
	return{
		
		templateUrl: "global/st-api/st-selected-items-actions/html/stSelectedItemsActions.html",
		bindToController: true,
		transclude: true,
		scope: {
			selectedItems: "<",
			deleteFunction: "&"
		},
		controllerAs: "$stSelectedItemsActionsCtrl",
		controller: function($scope){
			var ctrl = this;
			ctrl.scope = $scope;
		
		}
		
	}
}

})();
"use strict";
(function(){

	angular.module("stapi") 

	.directive('stNav', stNav);
	
	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-nav
	 * @restrict E
	 * @example
	 * <pre>
	 *    <st-nav active-tab="tab"  tabs="[{icon:'home',label:'Início'}, {label:'Clientes', icon:'user'}]" </ st-nav>
	 * </pre>
	 **/
	function stNav(){

		return{
			restrict:"E",
			templateUrl:'global/st-api/st-nav/html/stNav.html',
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
	}

})();

"use strict";

(function(){

	angular.module("stapi")
	.directive('stTable', stTable)
	
	function stTable(){
		return {
			restrict: 'E', 
			transclude:true,
			scope:{

			columns :"<",
			items: "<",
			openDetail: "<",
			deleteFunction: "<",
			editColumn: "<",
			selectedItems: "="

			},

			templateUrl:'global/st-api/st-table/html/stTable.html',
			bindToController: true,
			controllerAs: "$stTableCtrl",
			controller: function($scope, stUtil, $filter){
				var ctrl = this;
				ctrl.scope = $scope;
				ctrl.getColumnValue = getColumnValue;
				
				function getColumnValue(ob, attr, filter){
					
					var value =  stUtil.getValueOfNivel(ob, attr);
					
					if(filter && filter.length>0){
						
						var parts = filter.split(":");
						
						value = $filter(parts[0])(value, parts[1]);
					}
					
					return value;
					
				}
			}
		}
	}

})();


"use strict";
(function(){
angular.module("stapi")

.directive("stDetalhe", stDetalhe);

function stDetalhe(){
	
	return{
		
		templateUrl: "global/st-api/st-detalhe/html/stDetalhe.html",
		bindToController: true,
		replace:true,
		transclude: true,
		scope: {
			saveFunction: "&",
			cancelFunction: "&",
			deleteFunction: "&",
			item: "<",
			loading:"<",
			title: "@"
		},
		controllerAs: "$stDetalheCtrl",
		controller: function($scope){
			var ctrl = this;
			ctrl.scope = $scope;
		
		}
		
	}
}

})();
"use strict";

(function(){

	angular.module("stapi")

	.directive('stGridItem', stGridItem)
	

	function stGridItem(){
		return {
			restrict: 'E', 
			transclude:true,
			scope:{

			  label: "@",
			  icon: "@",
			  deleteFunction: "&",
			  openDetail: "&",
			  item: "<"

			},

			templateUrl:'global/st-api/st-grid-item/html/stGridItem.html',
			bindToController: true,
			controllerAs: "$stGridItemCtrl",
			controller: function(){
				var ctrl = this;
			}
		}
	}

})();


"use strict";

(function(){

	angular.module("stapi")

	.directive('stCardList', stCardList)
	.directive('cardList', stCardList);

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-card-list
	 * @restrict E
	 * @example
	 * <pre>
	 *    <div ng-repeat="ob in objetos" class="col-lg-4 generic-transition">
		   	 <st-card-list  index="{{$index}}"  ob="ob" pivo="'nome'"  edit-function="openItem" delete-function="deletarItem">
		   </st-card-list>
	 </div>
	 * </pre>
	 **/
	function stCardList(){
		return {
			restrict: 'E', 
			transclude:true,
			scope:{

				ob:"=",
				hideButtons:"=",
				pivo:"=",
				editFunction:"=",
				deleteFunction:"=",
				index:"@",
				icon:"@"

			},

			templateUrl:'global/st-api/st-card-list/html/stCardList.html',
			bindToController:true,
			controllerAs:"vm",
			controller: "stCardListController"
		}
	}

})();


"use strict";
(function(){
	angular.module("stapi") 

	.controller("stCardListController",stCardList);

	function stCardList(stUtil){

		var vm = this;

		if(vm.ob && vm.pivo)
			vm.labelPivo = stUtil.getValueOfNivel(vm.ob,vm.pivo);

	}

})();

"use strict";
(function(){
	angular.module("stapi") 

	//Modal em forma de diretiva
	.directive("testUserButton", testUserButton);

	function testUserButton(stService, $mdDialog, stUtil){
		return {

			restrict:"AE",
			templateUrl:"global/st-api/st-test-user/html/testUserButton.html",
			link:function($rootScope, element, attrs){

				var _openDetalhe = function(){

					$rootScope.testIsOpen=true;

					var modal = $mdDialog.show({
						animation: true,
						templateUrl:"global/st-api/st-test-user/html/testUserDetalhe.html",
						size:'lg',
						controller: function($scope, $rootScope,  $modalInstance, chronoService, $timeout){

							$scope.$on("modal.closing", function(){

								$rootScope.testIsOpen = false;

							}); 

							var  _getProxTest = function(){

								$scope.carregandoTest = true;
								stService.executeGet("testuser/prox-test").then(function(data){

									$rootScope.definition = data.item;
									if(data.item!=null)
										$("#descricao-teste").html(data.item.descricao);
									$scope.carregandoTest = false;

									stService.executeGet("/testuser/saldo-for-user").then(function(data){

										$rootScope.saldoTestes = data.item || 0;

										stService.executeGet("/testuser/total-tests-for-user").then(function(data){

											$rootScope.quantTests = data.item || 0;

										});

									});

								}).catch(function(){

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

									stService.executeGet("projecao/execute-query", {query:$rootScope.definition.queryVerification}).then(function(data){

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

								$mdDialog.show({
									animation: true,
									templateUrl:"global/st-api/st-test-user/html/testeUserResposta.html",
									size:'lg',
									controller: function($scope, $modalInstance){

										$scope.test = test;	
										$scope.salvar  = function(){

											if(!$scope.test.nivelDificuldadeFromUser){
												stUtil.showMessage("","Escolha uma opção","danger");

												return;
											}

											stService.executePost("testuser/add/", $scope.test).then(function(){

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

	}
})();

"use strict";
(function(){
	angular.module("stapi").config(function($routeProvider, $httpProvider){

		$routeProvider.when("/testdefinition",{

			templateUrl:"global/st-api/st-test-user/html/testDefinition.html",
			controller: function($scope, stService, stUtil, $mdDialog){

				$scope.openDetalhe = function(definition){

					var modal = $mdDialog.show({
						animation: true,
						templateUrl:"global/st-api/st-test-user/html/detalheTestDefinition.html",
						size:'lg',
						controller: function($scope, $modalInstance){

							$scope.definition = definition || {};
							$scope.salvar = function(){

								stService.executePost("testdefinition/add/",$scope.definition).then(function(){

									$modalInstance.close();

								});
							}

						}

					});
				}

			}

		}); 

		$routeProvider.when("/teste",{

			templateUrl:"global/st-api/st-test-user/html/test.html",

		}); 

	})
})();


"use strict";
(function(){

	angular.module("stapi") 

	.factory('tutorialUtil', tutorialUtil);
	
	function tutorialUtil($rootScope,$filter, stUtil, $mdDialog){

		var _openDetalheTutorial = function(tutorialItem){

			$mdDialog.show({
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

	}

})();

"use strict";

(function(){

	angular.module("stapi")

	.directive('buttonTutorial', buttonTutorial);
	
	function buttonTutorial ($mdDialog, tutorialUtil){
		return {
			restrict: 'AE',
			
			link: function(scope, element, attrs) {
			
				element.bind('click', function(){
					
					$mdDialog.show({
						animation: true,
						templateUrl:"global/st-api/st-tutorial/html/tutorialList.html",
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
	}

})();

