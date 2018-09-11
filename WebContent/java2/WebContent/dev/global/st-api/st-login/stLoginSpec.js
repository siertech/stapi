
describe('<st-autocomplete>', function() {

	var URL_LOGIN= /user\/login/;

	var filiaisMock = [
		{id: 1, nome: "Filial 1"},
		{id: 2, nome: "Filial 2"},
		{id: 3, nome: "Filial 3"}

		];
	
	var  staticConfsMock= {
		path: "inicio"
		
	}
	
	var  tenantConfsMock= {
		path: "inicio"
		
	}
	
	var usuarioSistemaMock = {
			id:1, 
			login: "admin@shared",
			filiaisPermitidas: "1,2"
	};

	var tokenMock="thomaz@ceasaplus: 123";

	function getLoginResponseMock(data){

		data  = data || {};
		return{
			token: data.token ||  tokenMock,
			usuarioSistema: data.usuarioSistema || usuarioSistemaMock,
			config: data.config || {confs:  tenantConfsMock},
			filiais: data.filiais || filiaisMock
		}
	}

	var dadosLoginMock = {
			empresa:"Empresa",
			usuario: "user",
			senha: "123"
	};

	var scope, element, $httpBackend, $cookieStore, $rootScope;

	beforeEach(module('stapi'));
	beforeEach(module('stapi.templates'));

	beforeEach(inject(function(_$httpBackend_, _$cookieStore_, _loginUtil_, _$rootScope_){

		$httpBackend = _$httpBackend_;
		$cookieStore = _$cookieStore_;
		loginUtil = _loginUtil_;
		$rootScope = _$rootScope_;
		

	}));


	afterEach(function() {
		scope && scope.$destroy();
		loginUtil.logOut();
	});

	function createScope(objeto, scopeData){

		inject(function(_$rootScope_){

			scope = _$rootScope_.$new();
		});   

		angular.forEach(scopeData, function(value, key) {
			scope[key] = value;

		});

		return scope;

	}

	function compile(template, scope) {

		inject(function($compile) {
			element = $compile(template)(scope);
			scope.$apply();
		});

		return element;
	}

	describe("Funcionalidades báscias", function(){

		it("As veriáveis devem ser setadas corretamente em $rootScope", function(){

			$httpBackend.expectPOST(URL_LOGIN).respond(getLoginResponseMock());
			loginUtil.logar(dadosLoginMock, true, function(){

			});
			$httpBackend.flush();
			expect($rootScope.usuarioSistema).toBeDefined();
			expect($rootScope.filiais).toBeDefined();
			expect($rootScope.config).toBeDefined();
			expect($rootScope.authToken).toBeDefined();

		});

	});
	
	describe("config", function(){
		
		
		it("As configurações que não forem sobreescritas devem permanecer acessíveis", inject(function(config){
			
		    //Simulação de configuração estática
		    config.confs = {
		    		initalPath: "initalPath",
		    		path: "Albar",
		    		testeDeConfiguracao: "teste"
		    };
		    var response =  getLoginResponseMock();
		    var initalPathByTentant = "initalPathByTenant"; 
            response.config.confs = {initalPath: initalPathByTentant };
			$httpBackend.expectPOST(URL_LOGIN).respond(response);
			loginUtil.logar(dadosLoginMock, true, function(){

			});
			$httpBackend.flush();
			console.log("Configurações aqui: ");
			console.log(config.confs);
			expect(config.confs.testeDeConfiguracao).toBe("teste");
		
	}));

		it("As configurações definidas no arquivo app-config.js devem ser sobrecarregadas pelas configurações do tenant", inject(function(config){
			
			    //Simulação de configuração estática
			    var staticInitalPath =  "initalPathStatic";
			    var tenantInitalPath = "initalPathTenant";
			    config.confs = {
			    		initalPath: staticInitalPath,
			    };
			    var response =  getLoginResponseMock();
	            response.config.confs = {initalPath: tenantInitalPath};
				$httpBackend.expectPOST(URL_LOGIN).respond(response);
				loginUtil.logar(dadosLoginMock, true, function(){

				});
				$httpBackend.flush();
				
			  expect(config.confs.initalPath).toEqual(tenantInitalPath);
			
		}));

	});


	describe("Filiais", function(){
		
		it("a lista de filiais disponiveis e PERMITIDAS devem ser setadas em $rootScope.filiais", function(){

			$httpBackend.expectPOST(URL_LOGIN).respond(getLoginResponseMock());
			loginUtil.logar(dadosLoginMock, true, function(){

			});
			$httpBackend.flush();

			expect($rootScope.filiais).toBeDefined();

		});

		it("Caso a o id da filial current esteja salvo nas configurações e a filial estiver permitida em usuarioSistem.filiaisPermitidas ela deve ser setada em $rootScope.currentFilial ", function(){

			var usuarioSistema = {
					login: "thomaz@ceasaplus",
					filiaisPermitidas: "1"
			};
			var config = {
					confs: {currentFilialId: 1}
			};
			var response = getLoginResponseMock({
				config: config,
				usuarioSistema: usuarioSistema
			});

			$httpBackend.expectPOST(URL_LOGIN).respond(response);
			loginUtil.logar(dadosLoginMock, true, function(){

			});
			$httpBackend.flush();

			expect($rootScope.currentFilial).toBeDefined();

		});
		
		
		it("Caso usuarioSistema.filiaisPermitidas não esteja definido, a filial salva na configuração deve ser definida", function(){

			var usuarioSistema = {
					login: "thomaz@ceasaplus",
					filiaisPermitidas: ""
			};
			var filiaisPermitidas = usuarioSistema.filiaisPermitidas.split(",");
			var config = {
					confs: {currentFilialId: 1}
			};
			var response = getLoginResponseMock({
				config: config,
				usuarioSistema: usuarioSistema
			});

			$httpBackend.expectPOST(URL_LOGIN).respond(response);
			loginUtil.logar(dadosLoginMock, true, function(){

			});
			$httpBackend.flush();

			expect($rootScope.currentFilial.id).toBe(1);

		});

		it("Caso o id da filial current esteja salvo nas configurações e a filial NÃO estiver permitida em usuarioSistem.filiaisPermitidas a filial setada deve estar entre as permitidas", function(){

			var usuarioSistema = {
					login: "thomaz@ceasaplus",
					filiaisPermitidas: "2,3"
			};
			var filiaisPermitidas = usuarioSistema.filiaisPermitidas.split(",");
			var config = {
					confs: {currentFilialId: 1}
			};
			var response = getLoginResponseMock({
				config: config,
				usuarioSistema: usuarioSistema
			});

			$httpBackend.expectPOST(URL_LOGIN).respond(response);
			loginUtil.logar(dadosLoginMock, true, function(){

			});
			$httpBackend.flush();

			expect(filiaisPermitidas.indexOf($rootScope.currentFilial.id+"")).not.toBe(-1);
			
		});
		
		
		it("Caso o tenant não possua filiais, a filial de id=1 deve ser setada (Matriz)", function(){

			var usuarioSistema = {
					login: "thomaz@ceasaplus",
					filiaisPermitidas: ""
			};
			
			var filiais = [];
			var config = {
					confs: {currentFilialId: 1}
			};
			var response = getLoginResponseMock({
				config: config,
				usuarioSistema: usuarioSistema,
				filiais: filiais 
			});

			$httpBackend.expectPOST(URL_LOGIN).respond(response);
			loginUtil.logar(dadosLoginMock, true, function(){

			});
			$httpBackend.flush();

			expect($rootScope.currentFilial.id).toBe(1);
			
		});


	});

});

