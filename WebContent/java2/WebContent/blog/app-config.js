"use strict";
(function(){

	var app;
	try{
		app  = angular.module("stBlog",["stapi"]);
	}catch(e){
		window.alert(e);
	}

	app.factory('config',function($location, $rootScope, $http, $templateCache){

		var	_path =  "StApi";
		var	_appVersion = "1.0";
		var	_initialPath =  "/inicio";
		var	_loginPath = "/inicio";
		var	_menuTemplateUrl =  "app/menu/html/menu.html";
		var   _securityPaths = [""];
		var	_baseUrl =  getBaseUrl();


		function getBaseUrl(){

			var pathApp = _path+"/";

			if($location.$$absUrl.indexOf("7070/"+pathApp)!=-1)
				return "http://"+$location.$$host+":7070/"+pathApp;

			else if($location.$$absUrl.indexOf("8080/"+pathApp)!=-1)
				return "http://"+$location.$$host+":8080/"+pathApp;

			else if($location.$$absUrl.indexOf("8080")!=-1)
				return "http://"+$location.$$host+":8080/";

			//SSL
			else if($location.$$absUrl.indexOf("https")!=-1)
				return "https://"+$location.$$host+"/";
			else
				return "http://"+$location.$$host+"/";

		}


		return {

			path:  _path,
			appVersion: _appVersion,
			initialPath: _initialPath,
			loginPath: _loginPath,
			menuTemplateUrl: _menuTemplateUrl,
			baseUrl: _baseUrl,
			securityPaths: _securityPaths
		}


	});


})();
