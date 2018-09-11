"use strict";
(function(){

	angular.module("stapi")
	
	.directive("inputClear", inputClear)
	
	
	

	.directive("stDatePicker", stDatePicker)

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-input-check
	 * @restrict E
	 * @example
	 * <pre>
	 *     <st-input-check  ng-true-value="1"  ng-false-value="0" label="'Exibir somente devedores'" ng-model="check2"></st-input-check>
	 * </pre>
	 **/
	.directive("stInputCheck", stInputCheck)
	.directive("inputCheck", stInputCheck)

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-input-date
	 * @restrict E
	 * @example
	 * <pre>
	 *    <st-input-date class="col-lg-3" label="Data" ng-model="data" ></st-input-date>
	 * </pre>
	 **/
	.directive("stInputDate", getDirectiveDefinition("date"))
	.directive("inputDate", getDirectiveDefinition("date"))

	/**
	 * @ngdoc directive
	 * @name stapi.directive:st-input-string
	 * @restrict E
	 * @example
	 * <pre>
	 *    <st-input-string class="col-lg-3" label="Digite o nome" ng-model="nome" ></st-input-string>
	 * </pre>
	 **/
	.directive("stInput", getDirectiveDefinition("string"))
	.directive("stInputString", getDirectiveDefinition("string"))
	.directive("inputString", getDirectiveDefinition("string"))

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-input-double
	 * @restrict E
	 * @example
	 * <pre>
	 *    <st-input-double class="col-lg-3" label="Valor" ng-model="valor" ></st-input-double>
	 * </pre>
	 **/	
	.directive("stInputDouble", getDirectiveDefinition("double"))
	.directive("inputDouble", getDirectiveDefinition("double"))

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-input-int
	 * @restrict E
	 * @example
	 * <pre>
	 *    <st-input-int class="col-lg-3" label="Quantidade" ng-model="quantidade" ></st-input-int>
	 * </pre>
	 **/
	.directive("stInputInt", getDirectiveDefinition("int"))
	.directive("inputInt", getDirectiveDefinition("int"));

	function getDirectiveDefinition(tipoInput){

		var stInput = function($compile, dateUtil, $filter){
			return{

				restrict:"E",
				templateUrl: "global/st-api/st-input/html/stInput.html",
				require:"ngModel",
				scope:{
					ngModel:"="
				},
				link: function(scope, ele, attrs, ctrl){

					var labelElement = ele.find("label");
					var inputElement = ele.find("input").clone();

					labelElement.on("click", function(){
						inputElement.focus();
					});

					inputElement.attr("type", attrs.type);


					//Trasnforma o elemento de input de acordo com o tipo
					if(tipoInput=='int'){
						inputElement.attr("type", "tel");
					}

					else if(tipoInput=='double'){
						inputElement.attr("ui-number-mask", 2);
						inputElement.attr("type", "tel");
					}

					else if(tipoInput=='date')
						inputElement.attr("st-date-picker","");
				


					inputElement = $compile(inputElement)(scope);

					//Substitui o elemento para o correto
					ele.find("input").replaceWith(inputElement);

					scope.label = attrs.label;
					scope.icon = attrs.icon;

				}

			}
		}

		return stInput;
	}

	
	function stInputCheck(){
		
		return{
			
		    templateUrl:"global/st-api/st-input/html/stInputCheck.html"
			
		}
	}
	
	function stDatePicker($compile,$filter, stService,$rootScope,stUtil, dateUtil){

		return {
			require:'ngModel',	

			scope:{

			},

			link: function($scope, element, attrs,ctrl){
				
			
				element.datepicker({
					dateFormat: 'dd/mm/yy',
					"z-index":9999,
					onSelect: function (date) {
						
						ctrl.$setViewValue(dateUtil.formatDate(date));
						$scope.$apply();
					}
				});

				//Interceptador de Valores
				/*
				ctrl.$parsers.push(function(value){

				
					value = angular.copy(value);
					return dateUtil.formatDate(value);
				
					return value;
					
				});

               */
				//Filtros
				
				ctrl.$formatters.push(function(value){
					
                   value = angular.copy(value);
					value = $filter("date")(value,"dd/MM/yyyy");
					console.log("Filtered: ");
					console.log(value);
					
					return value;

				});
				
				
				
				
				

			}

		}

	}
	
	   function inputClear() {
	        return {
	            restrict: 'A',
	            compile: function (element, attrs) {
	                var color = attrs.inputClear;
	                var style = color ? "color:" + color + ";" : "";
	                var action = attrs.ngModel + " = ''";
	                element.after(
	                    '<md-button class="animate-show md-icon-button md-accent"' +
	                    'ng-show="' + attrs.ngModel + '" ng-click="' + action + '"' +
	                    'style="position: absolute; top: 0px; right: -6px;">' +
	                    '<div style="' + style + '">x</div>' +
	                    '</md-button>');
	            }
	        };
	    }
	    
	  
})();
