
'use strict'


var SpyObjects = function(){
	
	
  this.modal = jasmine.createSpyObj('$mdDialogInstance', ['close', '$dismiss']);
	
	
};

module.exports = new SpyObjects();


