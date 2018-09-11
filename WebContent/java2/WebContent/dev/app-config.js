"use strict";
(function(){

	angular.module("stapi").factory('config', function($location, $window, $rootScope, $http, $templateCache){

	return {
		  
		scope: "static",
		confs:{
				path: "StApi",
				securityPaths: "all", //paths da aplicação onde a autenticação no sistema é necessária
				appVersion: "1.0",
				initialPath: "/inicio",
				loginPath: "/login",
				notFoundPath:"/notfound",
				pathsToHideMenu: ["/login"] //Nos paths definido aqui o menu não será exibido
		}
	}
	
});

})();
