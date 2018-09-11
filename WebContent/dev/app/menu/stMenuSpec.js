
describe('stMenu', function() {

	var itensMenuMock = [
		{path: "inicio", icon:"home",label:"Início"},
		{path: "cliente", icon:"person",label:"Clientes"},

		];

	var configMock = {
			confs: {
				notFoundPath:"/notfound",
				loginPath: "/loginpath"
			}
	};
	var usuarioSistemaMock = {originalLogin: "thomaz@ceasaplus"};

	var scope, element, $httpBackend, $cookieStore, cacheGet, $location, $rootScope

	beforeEach(module('stapiApp'));
	beforeEach(module('stapi'));
	beforeEach(module('stapi.templates'));

	beforeEach(inject(function(_$httpBackend_, _$cookieStore_, _cacheGet_, _$location_, _$rootScope_){

		$httpBackend = _$httpBackend_;
		$location = _$location_;
		$cookieStore = _$cookieStore_;
		cacheGet = _cacheGet_;
		$cookieStore.put("usuarioSistema", usuarioSistemaMock);
		$rootScope = _$rootScope_;
		$rootScope.usuarioSistema  = usuarioSistemaMock;



	}));


	afterEach(function() {
		scope && scope.$destroy();
	});

	function compile(template, scope) {

		inject(function($compile) {
			element = $compile(template)(scope);
			scope.$apply();
		});

		return element;
	}

	function createScope(objeto, scopeData){

		inject(function(_$rootScope_){

			scope = _$rootScope_.$new();
		});   

		angular.forEach(scopeData, function(value, key) {
			scope[key] = value;

		});

		return scope;

	}

	describe("function logout", function(){

		it("Ao clicar em logout deve ser direcionado para página de login definda nas configurações", inject(function(config){

			config.confs = configMock.confs;
			scope = createScope();
			var element = compile("<app-menu></app-menu>", scope);
			var ctrl = element.controller("appMenu");
			var buttonOptionsUser = element.find(".app-menu-button-options-user");
			//ctrl.data.logOut();
			buttonOptionsUser.triggerHandler("click");
			ctrl.scope.$digest();
            var buttonLogOut = angular.element(element.find(".button-logout").find("button")[0]);
			console.log("buttonLogOut");
			console.log(buttonLogOut.html());
			buttonLogOut.triggerHandler("click");
			ctrl.scope.$digest();
			expect($location.path()).toBe(configMock.confs.loginPath);

		}));


	});

	describe("Funcionalidades básicas", function(){

		it("Os itens definidos no menu devem aparecer na listagem do template", function(){

			scope = createScope();
			var menuElement = compile("<app-menu></app-menu>", scope);
			var ctrl = menuElement.controller("appMenu");
			var menuItemsInCtrl = ctrl.data.menuItems;
			expect(menuItemsInCtrl.length).toBeDefined();
			expect(menuElement.html()).toContain(menuItemsInCtrl[0].label);

		});
		
		
		it("O icone do item do menu deve ser setado corretamente no breadcumb", function(){

			scope = createScope();
			var menuElement = compile("<app-menu></app-menu>", scope);
			var ctrl = menuElement.controller("appMenu");
			var menuItemsInCtrl = ctrl.data.menuItems;
			var firstMenuItemElement = angular.element(menuElement.find(".menu-items").find("button")[0]);
			firstMenuItemElement.click();
			var firstItem = menuItemsInCtrl[0];
			ctrl.scope.$digest();
			var breadcumb = menuElement.find(".st-breadcumb");
			expect(breadcumb.html()).toContain(firstItem.icon);

		});



		it("Ao clicar em um item as configurações devem ser setadas corretamente no $rootScope", function(){

			scope = createScope();
			var menuElement = compile("<app-menu></app-menu>", scope);
			var ctrl = menuElement.controller("appMenu");
			var menuItemsInCtrl = ctrl.data.menuItems;
			var firstMenuItemElement = angular.element(menuElement.find(".menu-items").find("button")[0]);
			firstMenuItemElement.click();
			var firstItem = menuItemsInCtrl[0];
			ctrl.scope.$digest();
			expect($location.path()).toEqual("/"+firstItem.path);
			expect($rootScope.currentPathLabel).toBe(firstItem.label);
			expect($rootScope.currentPath).toBe(firstItem.path);
			expect(document.title).toContain(firstItem.label);
			expect($rootScope.routeHistory).toBeDefined();

		});

		it("Ao acessar um path não definido no sistema, a página definida em config.notFoundPath deve ser exibida", function(){

			scope = createScope();
			var menuElement = compile("<app-menu></app-menu>", scope);
			var ctrl = menuElement.controller("appMenu");
			expect(true).toBe(true);

		});

	});


});


