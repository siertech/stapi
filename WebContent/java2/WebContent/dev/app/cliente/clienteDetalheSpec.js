describe('<cliente-detalhe> clienteDetalheCtrl', function() {

	beforeEach(module('stapi'));
	beforeEach(module('stapiApp'));
	beforeEach(module('stapi.templates'));

	var URL_DELETE_OBJETO = /cliente\/delete/;
	var URL_SAVE_OBJETO = /cliente\/add/;

	var listaObjetosMock = [
		{id: 1, _string:{ nome: "Thomaz Reis Damasceno do Carmo"}},
		{id: 2, _string: { nome: "Talita Taiane do Carmo Damasceno"}},
		];

	var scope, $controller, $compile, $rootScope, $mdDialog,  $httpBackend;

	beforeEach(inject(function(_$rootScope_, _$controller_, _$compile_, _$mdDialog_, _$httpBackend_){
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$controller =  _$controller_;
		$mdDialog = _$mdDialog_;
		$httpBackend = _$httpBackend_;

	}));

	afterEach(function() {
		scope && scope.$destroy();
	});

	function compile(template, scope) {

		element = $compile(template)(scope);
		scope.$apply();
		return element;
	}

	function createClienteDetalheElement(){

		scope  = $rootScope.$new();
		var template = "<cliente-detalhe></cliente-detalhe>";
		return compile(template, scope);
	}

	describe("cancelFunction", function(){

		it("O dialog deve ser fechado corretamente ao ser canceldo pelo usuário", function(){

			scope = $rootScope.$new();	
			var item = listaObjetosMock[0];
			spyOn($mdDialog,"cancel");
			var ctrl = $controller("clienteDetalheCtrl", {
				objectName: "Cliente",
				$scope:  scope, 
				item: item, 
				$mdDialog:  $mdDialog,
				functionToDetailNotify: function(){}
			});

			ctrl.data.cancelFunction();
			ctrl.scope.$apply();
			expect( $mdDialog.cancel).toHaveBeenCalled();

		})

	});

	describe("saveFunction", function(){

		it("o controller deve notificar ao salvar um objeto", function(){

			scope = $rootScope.$new();	
			var item = listaObjetosMock[0];
			var functionToDetailNotify = jasmine.createSpy("functionToDetailNotify");
			var ctrl = $controller("clienteDetalheCtrl", {
				objectName: "Cliente",
				$scope:  scope, 
				item: item, 
				$mdDialog:  $mdDialog,
				functionToDetailNotify: functionToDetailNotify
			});
			$httpBackend.whenPOST( URL_SAVE_OBJETO).respond({item: item});
			ctrl.data.saveFunction(item);
			$httpBackend.flush();
			ctrl.scope.$apply();
			expect(functionToDetailNotify).toHaveBeenCalled();

		})
		
		it("o controller deve notificar ao deletar um objeto", function(){

			scope = $rootScope.$new();	
			var item = listaObjetosMock[0];
			var functionToDetailNotify = jasmine.createSpy("functionToDetailNotify");
			var ctrl = $controller("clienteDetalheCtrl", {
				objectName: "Cliente",
				$scope:  scope, 
				item: item, 
				$mdDialog:  $mdDialog,
				functionToDetailNotify: functionToDetailNotify
			});
			$httpBackend.whenPOST(URL_DELETE_OBJETO).respond({});
			ctrl.data.deleteFunction(item);
			$httpBackend.flush();
			ctrl.scope.$apply();
			expect(functionToDetailNotify).toHaveBeenCalled();

		})
		 
	});

});