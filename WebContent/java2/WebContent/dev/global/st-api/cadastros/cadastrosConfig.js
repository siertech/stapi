"use strict";
(function(){
angular.module("stapi").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/cadastros",{

		templateUrl:"global/st-api/cadastros/template-route/cadastros.html",
		controller:"cadastrosController"

	}); 

})
})();

