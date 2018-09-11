describe('<cliente-list> clienteListCtrl', function() {

	beforeEach(module('stapi'));
	beforeEach(module('stapiApp'));
	beforeEach(module('stapi.templates'));

	var URL_LISTA_OBJETOS = /cliente/;
	var URL_GET_BY_ID= /cliente\/get/;

	var configMock = {
			confs: {
				maxItensPerPage: 15
			}
	};

	var listaObjetosMock = [
		{id: 1, principalAttr: "Thomaz Reis Damasceno do Carmo"},
		{id: 2,  principalAttr: "Talita Taiane do Carmo Damasceno"},
		];

	var scope, $controller, $compile, $rootScope, $httpBackend, element, $templateCache;

	beforeEach(inject(function(_$httpBackend_, _$rootScope_, _$controller_, _$compile_, _$templateCache_){

		$rootScope  = _$rootScope_;
		$templateCache = _$templateCache_;
		$compile = _$compile_;
		$httpBackend = _$httpBackend_;
		$controller =  _$controller_;
		configureBackendRequests();

	}));

	afterEach(function() {
		scope && scope.$destroy();
	});

	function compile(template, scope) {

		element = $compile(template)(scope);
		scope.$apply();
		return element;
	}

	function configureBackendRequests(){

		$httpBackend.whenGET( URL_LISTA_OBJETOS ).respond( getResponseListaObjetosMock() );
		$httpBackend.whenGET(/arrow-up.svg/ ).respond({});
	}

	function getResponseListaObjetosMock(objetos){

		var response = {
				itens: objetos || listaObjetosMock
		}
		return response;

	}

	function functionToDetailNotify(res){


	}

	function createClienteListElement(){

		scope  = $rootScope.$new();
		var template = "<cliente-list></cliente-list>";
		var element  =  compile(template, scope);
		scope.$apply();
		return element;
	}

	describe("Funcionamento básico", function(){

		it("as funções de crud devem ser definidas", function(){

			var clienteListElement = createClienteListElement();
			var ctrl = clienteListElement.controller("clienteList");
			expect(ctrl.data.openDetail).toBeDefined();
			expect(ctrl.data.editColumn).toBeDefined();
			expect(ctrl.data.deleteFunction).toBeDefined();

		})

		it("Ao alteração de ctrl.selectedRows deve ser propagada no controller ", function(){

			var clienteListElement = createClienteListElement();
			var ctrl = clienteListElement.controller("clienteList");
			ctrl.data.selectedItems.push(listaObjetosMock[0]);
			ctrl.data.selectedItems.push(listaObjetosMock[1]);
			expect(ctrl.data.getSelectedItemsIds().length).toBe(2);

		})


		it("A lista de objetos deve ser exibida corretamente no template ", function(){

			var clienteListElement = createClienteListElement();
			var ctrl = clienteListElement.controller("clienteList");
			$httpBackend.expectGET(URL_LISTA_OBJETOS);
			ctrl.data.getList();
			$httpBackend.flush();
			ctrl.scope.$apply();
			expect(clienteListElement.html()).toContain(listaObjetosMock[0].principalAttr);
			expect(clienteListElement.html()).toContain(listaObjetosMock[1].principalAttr);


		})


	});

	describe("Método openDetail ", function(){

		it("Cadastro de novo item botão normal", function(){

			var clienteListElement = createClienteListElement();
			var ctrl = clienteListElement.controller("clienteList");
			ctrl.data.getList();
			$httpBackend.flush();
			ctrl.scope.$digest();
			spyOn(ctrl.data, "openDetail");
			clienteListElement.find(".add-button").click();
			ctrl.scope.$digest();
			expect(ctrl.data.openDetail).toHaveBeenCalledWith();
		});

		it("Cadastro de novo item botão float", function(){

			var clienteListElement = createClienteListElement();
			var ctrl = clienteListElement.controller("clienteList");
			ctrl.data.getList();
			ctrl.scope.$digest();
			spyOn(ctrl.data, "openDetail");
			clienteListElement.find(".float-add-button").click();
			ctrl.scope.$digest();
			expect(ctrl.data.openDetail).toHaveBeenCalledWith();
		});

		it("O dialogo deve ser exibido corretamente", function(){

			var clienteListElement = createClienteListElement();
			var ctrl = clienteListElement.controller("clienteList");
			ctrl.data.openDetail();
			ctrl.scope.$digest();
			expect($(".md-dialog-is-showing").html()).toBeDefined();

		});

		it("O dialog deve ser exibido corretamente de acordo com o item",function(){

			var clienteListElement = createClienteListElement();
			var ctrl = clienteListElement.controller("clienteList");
			var itemToDetail = listaObjetosMock[0];
			var parent = angular.element("<div></div>");
			ctrl.data.openDetail(itemToDetail, parent);
			ctrl.scope.$apply();
			expect(parent.html()).toContain(itemToDetail.principalAttr);


		});
		
		it("Ao chamar ctrl.openDetail passando o id do item, deve-se recuperar o objeto completo",function(){

			var clienteListElement = createClienteListElement();
			var ctrl = clienteListElement.controller("clienteList");
			var item = listaObjetosMock[0];
			var fullObject = angular.copy(item);
			fullObject.principalAttr = 	fullObject.principalAttr+" - full-object"
			$httpBackend.expectGET( URL_GET_BY_ID ).respond({item: fullObject });
			var parentDetail = angular.element("<div></div>");
			ctrl.data.openDetail(item.id,  parentDetail);
			ctrl.scope.$apply();
			$httpBackend.flush();
			
			expect(parentDetail.html()).toContain("full-object");
			

		});


	});


	describe("Filtros (st-filter-map)", function(){

		it("Os filtros definidos no controller devem ser exibidos corretamente no template", function(){

			var clienteListElement = createClienteListElement();
			var clienteListElementCtrl = clienteListElement.controller("clienteList");
			var filtros = clienteListElementCtrl.filtros;
			var stFilterElement = clienteListElement.find("st-filter");

			for(var i in filtros){

				expect(stFilterElement.html()).toContain(filtros[i].label);
			}

		})

		it("Ao alterar o atributo de filtro, o label deve ser exibido corretamente no input", function(){

			var clienteListElement = createClienteListElement();
			var clienteListElementCtrl = clienteListElement.controller("clienteList");
			var filtro = clienteListElementCtrl.data.filtros[0];
			var stFilterElement = clienteListElement.find("st-filter");
			var stFilterElementCtrl = stFilterElement.controller("stFilter");
			stFilterElementCtrl.changeFiltroAtivo(filtro);
			stFilterElementCtrl.scope.$digest();
			expect(stFilterElement.find("label").html()).toContain(filtro.label);

		})

	});
	
	describe("Método editColmun", function(){
		
		
		
	});

	describe("Paginação (st-pagination)", function(){

		it("O template deve ser renderizado corretamente", function(){

			var clienteListElement = createClienteListElement();
			var ctrl = clienteListElement.controller("clienteList");
			ctrl.data.getList();
			$httpBackend.flush();
			ctrl.scope.$digest();
			var stFilterPaginationElement = clienteListElement.find("st-filter-pagination");

			expect(stFilterPaginationElement.find("span").html()).toContain("Página 1");

		})

		it("Ao clicar no botão de atualizar, a lista de objetos deve ser atualizada", function(){

			var clienteListElement = createClienteListElement();
			var ctrl = clienteListElement.controller("clienteList");
			ctrl.data.getList();
			$httpBackend.flush();
			ctrl.scope.$digest();
			var stFilterPaginationElement = clienteListElement.find("st-filter-pagination");
			var stFilterPaginationElementCtrl = stFilterPaginationElement.controller("stFilterPagination");
			stFilterPaginationElement.find("#st-pagination-refresh-button").click();
			$httpBackend.flush();
			stFilterPaginationElementCtrl.scope.$digest();
			expect(stFilterPaginationElement.find("span").html()).toContain("Página 1");

		})

	});

});