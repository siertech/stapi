
describe('Testes alterarBaixaController', function () {

	var $httpBackend,$controller,$mdDialogInstance,$rootScope;

	beforeEach(module("stapi"));
	//beforeEach(module('stFilter'));
	beforeEach(module('karma.templates'));

	beforeEach(inject(function(_$httpBackend_,_$controller_,_$rootScope_){

		$httpBackend = _$httpBackend_; 
		$controller = _$controller_;
		$mdDialogInstance = jasmine.createSpyObj('$mdDialogInstance', ['close', '$dismiss']);
		$rootScope = _$rootScope_;

	}));

	
	/*Não deve ser modificado!*/
	var staticMovList = [
	   
	   {valor:100, baixada: true},  
	   {valor:100, baixada: true},  
	   {valor:100, baixada: false},   
	               
	];
	

	it("filtrar somente movimentações a pagar'", inject(function(dateUtil){
		
		var vm = $controller("movListController",{$rootScope:$rootScope});
		
		vm.changeTipoBaixa("a_pagar");
		
		expect(vm.movsGroup.length).toBe(1);
		
	}));



});
