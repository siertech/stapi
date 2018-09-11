
describe('Testes appRelatorioController', function () {
	 
	var $httpBackend,$controller, $mdDialogInstance;
	
	  beforeEach(module("stapi"));
	  //beforeEach(module('stFilter'));
	  beforeEach(module('karma.templates'));
      
      beforeEach(inject(function(_$httpBackend_,_$controller_){
    	  
    	  $httpBackend = _$httpBackend_; 
    	  $controller = _$controller_;
    	  $mdDialogInstance = jasmine.createSpyObj('$mdDialogInstance', ['close', '$dismiss']);
      }));
      
    
	  
});
