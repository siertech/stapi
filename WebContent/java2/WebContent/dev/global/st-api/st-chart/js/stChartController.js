"use strict";
(function(){

	angular.module("stapi").controller("stChartContentCtrl", function($scope){

		  var ctrl = this;
		  ctrl.charts = [];
	});
	
	angular.module("stapi").controller("stChartItemCtrl", function($scope){

	});
	angular.module("stapi").controller("stChartCtrl",function($scope, $mdColors, $mdColorUtil, stChartUtil, $filter){



		//Período
		$scope.de = $scope.de || "1900-10-05";
		$scope.ate = $scope.ate || "3000-10-05";

		//Quantidade máxima padrão de itens a serem exibidos 
		$scope.maxItens =  $scope.maxItens || stChartUtil.MAX_ITENS_DEFAULT;
		$scope.order = stChartUtil.ORDER_DEFAULT;//

		delete $scope.projs;
		function getDados (maxItens){

			$scope.loading = true;
			//Montagem das informações basicas para recuperação da projeção a partir de $scope.info

			var querys = $scope.querys || [];
			if(typeof querys == 'string')
				querys = querys.split(",");

			var basicInfo = {
					qs:querys || [],
					columns:$scope.labelColumn+","+$scope.valueColumn+" ",
					objeto:$scope.objectName,
					groupBy:$scope.labelColumn,
					extra:"order by "+($scope.orderBy || $scope.valueColumn)+" "+$scope.order,
					max:$scope.max

			}

			var dadosExemplo  = $scope.dadosExemplo;

			delete $scope.proj;
			stChartUtil.chartFactory($scope,basicInfo,$scope.periodColumn,function(proj){


				//Dados de exemplo
				if(proj.labels.length==0){
					proj = dadosExemplo;

					if(proj)
						proj.dadosExemplo=true;

				}

				var filter = $scope.labelFilter  || "";

				filter  = filter.split(":");

				if(filter[0].length>0 && proj){

					for(var i in proj.labels){

						proj.labels[i] = $filter(filter[0])(proj.labels[i], filter[1]);
					}
				}

				//Como definir dinamicamente???
				$scope.chartOptions = {

						/*
					 tooltips: {
					        callbacks: {
					          label: function(data) {

					            var label = proj.labels[data.index];

					            return label;
					          }
					        }
					 }

						 */

				}

				var colors = [

					$mdColorUtil.rgbaToHex($mdColors.getThemeColor("blue")),
					$mdColorUtil.rgbaToHex($mdColors.getThemeColor("grey")),
					$mdColorUtil.rgbaToHex($mdColors.getThemeColor("red")),
					$mdColorUtil.rgbaToHex($mdColors.getThemeColor("green")),
					$mdColorUtil.rgbaToHex($mdColors.getThemeColor("yellow")),

					];
				if(proj)
					proj.colors= colors;

				$scope.proj  = proj;

				$scope.loading = false;

			});

		}

		getDados();
		$scope.getDados = getDados;

	});

})();
