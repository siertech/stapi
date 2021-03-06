"use strict";
(function(){

	angular.module("stapi") 
	
   .directive('ovtsZoomControls', function( $window, $document, $timeout ){

  return {

    restrict: 'A',

    replace: true,

    transclude: true,

    template: '<div class="ovts-zoom-controls"></div>',

    scope: {},

    controllerAs: 'zoom',

    controller: function($scope){

      this.in = function() {
        if($scope.currentStep < $scope.stepCnt) {
          $scope.currentStep += 1;
        }
      }

      this.out = function() {
        if($scope.currentStep > 0) {
          $scope.currentStep -= 1;
        }
      }

      this.isMaxedIn = function() {
        return $scope.currentStep == $scope.steps.length - 1;
      }

      this.isMaxedOut = function() {
        return $scope.currentStep == 0;
      }

    },

    link: function($scope, ele, attrs, controller, transclude){
      var options = $scope.$eval(attrs.ovtsZoomControls) || {};
      var eleTarget = $document[0].querySelector(options.target);
      $scope.$watch(function(){
        return [eleTarget.clientWidth, eleTarget.clientHeight];
      }, calc, true);

      $window.addEventListener('resize', calc);

      function calc() {
        var eleControls = ele[0];
        var steps = $scope.steps = [];
        var stepCnt = $scope.stepCnt = options.stepCnt || 4;
        var animation = options.animationFn || '.7s ease-out';
        var transformOrigin = options.transformOrigin || 'center top';
        var minHeight = options.minHeight;
        var minWidth = options.minWidth;
        var maxHeight = options.maxHeight;
        var maxWidth = options.maxHeight;
        var min = options.min;
        var max = options.max;
        var minWidthOffset = options.minWidthOffset || 0;
        var minHeightOffset = options.minHeightOffset || 0;
        var maxWidthOffset = options.maxWidthOffset || 0;
        var maxHeightOffset = options.maxHeightOffset || 0;
        var offsetX = options.offsetX || 0;

        if(minWidth === 'initial') {
          minWidth = eleTarget.clientWidth;
        }

        if(minHeight === 'initial') {
          minHeight = eleTarget.clientHeight;
        }

        if(minWidth === 'window') {
          minWidth = $window.innerWidth
        }

        if(minHeight === 'window') {
          minHeight = $window.innerHeight
        }

        if(maxWidth === 'initial') {
          maxWidth = eleTarget.clientWidth
        }

        if(maxHeight === 'initial') {
          maxHeight = eleTarget.clientHeight
        }

        if(maxWidth === 'window') {
          maxWidth = $window.innerWidth
        }

        if(maxHeight === 'window') {
          maxHeight = $window.innerHeight
        }

        minHeight += minWidthOffset;
        minHeight += minHeightOffset;
        maxWidth += maxWidthOffset;
        maxHeight += maxHeightOffset;

        transclude($scope, function(nodes){
          angular.element(eleControls).append(nodes);
        })

        $scope.currentStep = calculateSteps();

        applyTransformOrigin(eleTarget, transformOrigin)

        $scope.$watch('currentStep', function(currentStep, oldStep){
          if(currentStep !== oldStep){
            applyAnimation(eleTarget, animation);
          }
          applyTransform(eleTarget, steps[currentStep]);
        });

        function calculateSteps(){
          var width = eleTarget.clientWidth;
          var height = eleTarget.clientHeight;
          var minWidthScale =  minWidth / width || -Infinity;
          var minHeightScale =  minHeight / height || -Infinity;
          var maxWidthScale =  maxWidth / width || Infinity;
          var maxHeightScale =  maxHeight / height || Infinity;
          var minScale = Math.max(minWidthScale, minHeightScale);
          var maxScale = Math.min(maxWidthScale, maxHeightScale);
          var minLog = Math.log(minScale);
          var maxLog = Math.log(maxScale);


          if(minScale > 1 || maxScale < 1) {

            steps.push(1)

          }else{

            var x = stepCnt * minLog / (maxLog - minLog)
            var initalStep = Math.round(stepCnt * -minLog / (maxLog - minLog));

            for (var i = 0; i <= stepCnt; i++) {
              var step;
              if (i < initalStep) {
                step = -minLog / initalStep * i + minLog;
              }
              else if(i > initalStep) {
                step = maxLog * ( i - initalStep ) / (stepCnt - initalStep);
              }
              else {
                step = 0;
              }
              steps.push(Math.pow(Math.E, step));
            }

          }
          return steps.indexOf(1);
        };

        function applyTransformOrigin(element, cssValue) {
          element.style.transformOrigin = cssValue;
          element.style.webkitTransformOrigin = cssValue;
          element.style.mozTransformOrigin = cssValue;
          element.style.msTransformOrigin = cssValue;
          return element.style.oTransformOrigin = cssValue;
        };

        function applyTransform (element, value) {
          var cssValue = "scale(" + value + "," + value + ")";
          element.style.transform = cssValue;
          element.style.webkitTransform = cssValue;
          element.style.mozTransform = cssValue;
          element.style.msTransform = cssValue;
          return element.style.oTransform = cssValue;
        };

        function applyAnimation (element, cssValue) {
          element.style.transition = cssValue;
          element.style.webkitTransition = cssValue;
          element.style.mozTransition = cssValue;
          return element.style.oTransition = cssValue;
        };

      }

    }
  }
})

	.directive('ngEnter', function () {

		return{

			link:   function (scope, element, attrs) {
				element.bind("keydown keypress", function (event) {
					if(event.which === 13) {
						scope.$apply(function (){
							scope.$eval(attrs.ngEnter);
						});

						event.preventDefault();
					}
				});
			}

		}

	})


	.directive("htmlView", function() {
		return {
			scope:{
				titulo:"=",
				content:"="
			}, 	
			templateUrl:"global/st-api/st-util/template-module/htmlView.html",
			bindToController: true,
			controllerAs: "vm",
			controller: function(){

			}
		}
	})

	.directive("htmlCompile", function($compile){
		return{
			scope:{
				html:"="
			},

			controller: function($scope, $element){

				$scope.$watch("html", function(template){

					var linkFn = $compile(template);
					var content = linkFn($scope);
					$element.html(content);


				});

			}
		}
	})


	/**
	 * @ngdoc directive
	 * @name stapi.directive: view-chose
	 * @restrict E
	 * @example
	 * <view-chose class="col-lg-3" view-type="config.confs.viewType" ></view-chose>
	 **/
	.directive("viewChose",function(){
		return{

			restrict:"E",
			transclude:true,
			scope:{
				viewType:"="	
			},
			templateUrl:"global/st-api/st-util/template-module/viewChose.html",
			bindToController:true,
			controllerAs:"vm",
			controller: function(configUtil){

				var vm = this;

				if(!vm.viewType)
					vm.viewType = "grid";

				vm.change = function(){

					vm.viewType = vm.viewType == "grid" ? "table": "grid";
					configUtil.setConfig("viewType", vm.viewType);
				}
			}


		}
	})



	//Diretiva necessária para upload de arquivos
	.directive('delayCount',function (onlineStatus) {
		return {
			restrict: 'E',
			template:"{{count}}",
			scope:{
				number:"=",
				time:"=",
				finish:"="
			},
			controller: function($scope, $interval) {
				$scope.count = 0;
				$interval(function(){

					if($scope.count<$scope.number)
						$scope.count++;
					else{
						$scope.finish = true;
						return;
					}

				}, $scope.time|| 300);
			}
		};
	})

	//Diretiva necessária para upload de arquivos
	.directive('networkButtonStatus',function (onlineStatus) {
		return {
			restrict: 'E',
			templateUrl:"global/st-api/st-util/template-module/networkButtonStatus.html",
			controller: function($scope) {
				$scope.onlineStatus = onlineStatus;

				$scope.$watch('onlineStatus.isOnline()', function(online) {
					$scope.online_status= online;
				});
			}
		};
	})

	//Diretiva necessária para upload de arquivos
	.directive('fileModel', ['$parse', function ($parse) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;

				element.bind('change', function(){
					scope.$apply(function(){
						modelSetter(scope, element[0].files[0]);
					});
				});
			}
		};
	}])


	.directive('stInitial', function() {
		return {
			restrict: 'A',
			controller: [
				'$scope', '$element', '$attrs', '$parse', function($scope, $element, $attrs, $parse) {
					var getter, setter, val;
					val = $attrs.ngInitial || $attrs.value;
					getter = $parse($attrs.ngModel);
					setter = getter.assign;
					setter($scope, val);
				}
				]
		};
	})

	.directive("buttonInfoOb",function($mdDialog, filialUtil){

		return{
			link: function (scope, element, attrs){

				element.bind("click",function(){

					var objeto = JSON.parse(attrs.objeto);
					var historicos = objeto.historicoObjeto.split(",");
					
					var content = "";
					for(var i in historicos){
						content+="<p>"+historicos[i]+"</p>";
					}
					
					 $mdDialog.show(
						      $mdDialog.alert()
						        .parent(angular.element(document.body))
						        .clickOutsideToClose(true)
						        .title("Informações")
						        .htmlContent(content)
						        .ariaLabel("Informações")
						        .ok("ok")
						    );


				});

			}

		}

	})


	/**
	 * @ngdoc directive
	 * @name stapi.directive: button-add
	 * @restrict E
	 * @example
	 * <pre>
	 *   <button-add ng-click="vm.openItem()"></button-add>
	 * </pre>
	 **/
	.directive("floatButtonAdd",function(){
		return{

			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/buttonAdd.html",
			scope: {
				tooltipLabel: "@"
			}


		}
	})


	.directive("estadosCidades",function(){
		return{

			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/estadosCidades.html",
			scope:{
				estado:"=",
				cidade:"=",

				codigoUf:"=",
				codigoMunicipio:"=",
				nomeMunicipio:"=",
				uf:"=",

			},
			bindToController:true,
			controller:"estadosCidadesController as vm",
		}
	})

	.directive('stNoItens',function(){

		return{
			template:'<p class="text-muted" style="padding:10px;">'+
			'<i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{label}}'+
			'</p>',
			scope:{
				label:"="
			}
		}
	})

	//Destacar oxorrencias em um texto
	.directive('destaqueTexto',function(){

		return {
			restrict:"E",
			template:"<strong><span class='{{class}}' ng-class=\"{'busca-destaque':(first!=-1 && $index>=first && $index<=last)}\" ng-repeat='c in texto track by $index'>{{c}}</span></strong>",
			scope:{

				busca:"=",
				texto:"=",
				class:"="

			},
			controller:function($scope){

				if($scope.busca && $scope.busca.length>0){

					var texto = $scope.texto.toLowerCase();
					var busca = $scope.busca.toLowerCase();

					$scope.first = texto.indexOf(busca);
					$scope.last = $scope.first +busca.length;

				}

				else{
					$scope.first=-1;
					$scope.last=-1;

				}

			}
		}

	})

	//Diretiva de atalhes
	.directive('buttonExpressCad',function(movUtil,stService){

		return {
			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/buttonExpressCad.html",
			controller:function($scope){


				//Cadastro de despesa normal
				$scope.cadDespesa = function(){

					var mov = {tipo:1};
					movUtil.openMov(mov,function(){

					});

				}

			}
		}

	})


	.directive('stItemSelection',function(stService){

		return{

			restrict:"E",
			require:'ngModel',
			templateUrl:'global/st-api/st-util/template-module/itemSelection.html' ,
			scope:{

				maxItens:"=",//Quantidade de itens por página,
				objectOp:"=",
				label:"=",//Atributo do item a ser exibido
				extraLabel:"="	
			},
			link:function($scope,elements,attrs,ctrl){
				$scope.setPagina = function(pagina){

					$scope.pagina = pagina;

					stService.getLikeMap($scope.objectOp,[''],pagina,$scope.maxItens||0,'').then(function(data){

						$scope.itens = data.itens;

					});
				}

				$scope.setPagina(0);

				$scope.selecionarItem = function(item){

					ctrl.$setViewValue(item);
				}
			}
		}
	})


	//Diretiva para impressão
	.directive('stShow', function ($window,$animate) {
		return {
			restrict: 'A',
			multiElement: true,
			link: function(scope, element, attr) {
				scope.$watch(attr.stShow, function ngShowWatchAction(value) {

					if(value==true){
						element.addClass("st-show");
					}
					else{
						element.removeClass("st-show"); 
					}

				});
			}
		};
	})



	//Diretiva para impressão
	.directive('stPrint', function ($window) {
		return {
			restrict: 'A',
			scope:{


			},
			link: function (scope, element, attr) {

				element.bind("click",function(){


					var ele = $("#"+element.attr('id-print'));
					ele.addClass("printShow");
					ele.removeClass("printHide");
					$window.print();
					ele.removeClass("printShow");
					ele.addClass("printHide");


				});

			}
		}
	})




	//Diretiva para Status de carregamento
	.directive('loading', function () {
		return {
			restrict: 'E',
			scope:{

				label:"="

			},
			replace:true,
			template: '<div class="loading"><i class="fa fa-refresh fa-spin"></i> <i>{{label}}</i></div>',
			link: function (scope, element, attr) {
				scope.$watch('loading', function (val) {
					if (val)
						scope.loadingStatus = 'true';
					else
						scope.loadingStatus = 'false';
				});
			}
		}
	})






	.directive("stList",function($filter){


		return {

			templateUrl:'view/api/st-list.html',
			restrict:"E",
			scope:{

				itens:"=",
				left:"@",
				right:"@",
				link:"@",
				tl:"@",
				tr:"@",
				cl:"@",
				cr:"@",
				bl:"@",
				br:"@",
				tamleft:"@",
				tamright:"@",
				labelitem:"@"


			},

			link: function($scope, element, attrs) {

				if(!$scope.tamleft)
					$scope.tamleft=6;

				if(!$scope.tamright)
					$scope.tamright=6;

				$scope.getLt = function(item,position){

					if(!$scope[position] && position=='cl')
						position="left";

					if(!$scope[position] && position=='cr')
						position="right";


					var frase="";

					if(!$scope[position])
						return "";


					frase  = $scope[position];


					var expressoes = frase.split(",");
					var regex;//Regex para cada expressao
					var i;
					var termos = [];
					var termo = {

							atributo:'',
							valor:0,
							tipo:'',
							exp:''

					};

					for(var i in expressoes){

						termo = {};

						//Literal
						if(expressoes[i].indexOf("[")==-1)
						{

							regex = new RegExp(/\'[\w | \W]+\'/);
							termo.valor = regex.exec(expressoes[i])[0].replace(/\'/g,"");
							termo.tipo='string';
							termo.atributo=null;
							termo.exp=expressoes[i];



						}	
						else {

							regex = new RegExp(/\[[\w |\W]+\:/);
							var atributo = regex.exec(expressoes[i])[0];
							atributo = atributo.replace("[","");
							atributo = atributo.replace(":","");
							var atributos = atributo.split(".");
							termo.atributo = atributos[0];

							var sub_  = atributo.split(".")[1];

							var valor = item[termo.atributo];

							if(sub_)
								valor  = valor[sub_];

							termo.valor = valor;
							regex = new RegExp(/\'[\w | \W]+\'/);
							termo.tipo = regex.exec(expressoes[i])[0].replace(/\'/g,"");
							termo.exp = expressoes[i];




						}

						termos.push(termo);	


					}

					//Literal a ser renderizado
					var lt="";
					var pre="";

					var j;
					for(var j in termos){

						if(termos[j].tipo=='money'){

							lt="R$ ";
							termos[j].valor = $filter('number')(termos[j].valor,2);

						}
						else if(termos[j].tipo=='string')
							termos[j].valor = $filter('uppercase')(termos[j].valor);


						lt+=termos[j].valor;

					}



					return lt;

				}


				$scope.getLink = function(item){

					var link = $scope.link ;

					if(!link)
						return"#";

					var pattern  = new RegExp(/\[[a-z]+\]/);
					var atributo  = pattern.exec($scope.link);
					var attr = atributo[0];
					attr = attr.replace("[","");
					attr  = attr.replace("]","");
					link = link.replace(pattern,item[attr]);

					return link;

				}



			}


		}

	})

	.directive('stCheck', function() {
		return {
			templateUrl:"global/st-api/st-util/template-module/stCheck.html",
			transclude:true,
			scope:{

				ngModel:"=",
				ngChange:"=",
				ngDisabled:"=",
				label:"=",
				labelClass:"="
			}
		}
	})

	.directive('stRelatorio', function(relatorioService,stUtil) {
		return {
			templateUrl:"view/relatorio/relatorioDirective.html",
			transclude:true,
			scope:{
				url:"=",
				nomeObjeto:"="	 

			},
			controller:function($scope){

				$scope.dataDe = new Date();
				$scope.dataAte = new Date();

				$scope.teste = function(){

				}

				$scope.gerarRelatorio = function(column,operador,valueColumn,countColumn,query,nomeRelatorio){

					$scope.nomeRelatorio = nomeRelatorio;//Nome do relatório

					var ops = {};

					//Preparação das opções
					ops.nomeObjeto = $scope.nomeObjeto;//Nome da classe Principal do objeto do relatório
					ops.column=column;//Coluna principal dos dados a serem exibidos ex:'formaPagamento'
					ops.operador=operador;//Operador a ser utilizado na query ex: 'like','='
					ops.countColumn=countColumn;//Columna utilizada para contagem, ex: 'Quantidade' ,'*'
					ops.valueColumn = valueColumn;//Coluna utlizada para soma, ex:'Valor'
					ops.url = $scope.url;
					ops.querys = [];
					ops.labels = ["Dinheiro","Cheque"];
					ops.querysLabel=[];
					ops.dataDe = stUtil.formatData($scope.dataDe);
					ops.dataAte = stUtil.formatData($scope.dataAte);

					ops.querysLabel = ops.querys;//Query utilizada na recuperação de labels


					if(query && query.length>0)
						ops.querys.push(query);


					/* Querys Extras
					if($scope.nomeProduto && $scope.nomeProduto.length>0 )
						ops.querys.push("produto like '%"+$scope.nomeProduto+"%'");
					 */



					relatorioService.getProjecoes(ops,function(data){


						$scope.proj = data;



					});

				}


			}


		};
	})



	.directive('convertToNumber', function() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				ngModel.$parsers.push(function(val) {
					return val ? parseInt(val, 10) : null;
				});
				ngModel.$formatters.push(function(val) {
					return val ? '' + val : null;
				});
			}
		};
	})

	.directive('navClick', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {


				element.on('click', function (event) {

					var elementoMenu = $("#elementoMenu");	

					elementoMenu.attr('class','sidebar-nav navbar-collapse collapse');


				});
			}
		};
	})

	//Anchor Scroll
	.service('anchorScroll', function(){

		this.scrollTo = function(eID) {

			// This scrolling function 
			// is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

			var startY = currentYPosition();
			var stopY = elmYPosition(eID);
			var distance = stopY > startY ? stopY - startY : startY - stopY;
			if (distance < 100) {
				scrollTo(0, stopY); return;
			}
			var speed = Math.round(distance / 100);
			if (speed >= 20) speed = 20;
			var step = Math.round(distance / 25);
			var leapY = stopY > startY ? startY + step : startY - step;
			var timer = 0;
			if (stopY > startY) {
				for ( var i=startY; i<stopY; i+=step ) {
					setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
					leapY += step; if (leapY > stopY) leapY = stopY; timer++;
				} return;
			}
			for ( var i=startY; i>stopY; i-=step ) {
				setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
				leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
			}

			function currentYPosition() {
				// Firefox, Chrome, Opera, Safari
				if (self.pageYOffset) return self.pageYOffset;
				// Internet Explorer 6 - standards mode
				if (document.documentElement && document.documentElement.scrollTop)
					return document.documentElement.scrollTop;
				// Internet Explorer 6, 7 and 8
				if (document.body.scrollTop) return document.body.scrollTop;
				return 0;
			}

			function elmYPosition(eID) {
				var elm = document.getElementById(eID);
				var y = elm.offsetTop;
				var node = elm;
				while (node.offsetParent && node.offsetParent != document.body) {
					node = node.offsetParent;
					y += node.offsetTop;
				} return y;
			}

		};

	})

	.directive('stCollapsePanel', function( $timeout){
		return {
			restrict:"E",
			transclude:true,
			templateUrl: 'global/st-api/st-util/template-module/stCollapsePanel.html',
			scope:{
				titulo:"=",
				icone:"=",
				show:"=",
				extraClass:"="
			} ,
			link:function($scope){


			}
		}
	})

	.directive('stAccordion', function(){
		return {
			restrict: "E",
			replace: true,
			transclude: true,
			template: '<div class="panel-group" ng-transclude></div>',
			scope:{

				accordionIn:"="
			},
			link: function(scope,elem, attrs){
				var id = elem.attr("id");

				if (!id) 
				{
					id = "btst_acc" + scope.$id;
					elem.attr("id", id);
				}

				var arr = elem.find(".accordion-toggle");
				for (var i = 0; i < arr.length; i++) {
					$(arr[i]).attr("data-parent", "#" + id);
					$(arr[i]).attr("href", "#" + id + "collapse" + i);
				}

				var arr = elem.find('.panel-collapse');

				if(scope.accordionIn==true){
					$(arr[0]).addClass("in");
				}

				for (var x = 0; x < arr.length; x++) {
					$(arr[x]).attr("id", id + "collapse" + x);
				}

			},
			controller: function(){}
		}}).directive('stAccordionPanel', function(){
			return {
				require: '^stAccordion',
				restrict: "E",
				replace: true,
				transclude: true,
				scope: {

					title:"=",
					idPanel:"@"

				},
				template: 
					'<div class="panel panel-default panel-pdvficha">'+
					'	<div id="{{idPanel}}" data-toggle="collapse" class="panel-heading accordion-toggle collapsed">'+
					'   	{{title}} <i class="fa fa-edit"></i>'+
					'	</div>'+
					'	<div class="panel-collapse collapse panel-body" ng-transclude>'+
					'	</div>'+
					'</div>',
					link: function(scope,elem,attrs){
						scope.$watch("title", function(){
							var hdr = elem.find(".accordion-toggle");
							hdr.html(scope.title+' <i class="fa arrow"></i>');
						})
					}
			}
		})


		.filter('indexDay', function (stUtil) {
			return function (value) {

				return stUtil.getDayOfIndex(value);
			};
		})

		.filter('limiter', function () {
			return function (value,max, tail) {
				if (!value) return '';

				max = parseInt(max, 10);
				if (!max) return value;
				if (value.length <= max) return value;

				value = value.substr(0, max);

				var lastspace = value.lastIndexOf(' ');
				if (lastspace != -1) {
					//Also remove . and , so its gives a cleaner result.
					if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
						lastspace = lastspace - 1;
					}
					value = value.substr(0, lastspace);
				}


				return value + (tail || ' …');
			};
		})

		.filter('tojson', function () {
			return function (value) {
				if (!value) return '';


				return JSON.parse(value);
			};
		})


		.directive('autoFocus"', function($timeout) {
			return {
				link: function(scope, element) {

					console.log("Chamou o focus");

					$timeout(function() {
						element[0].focus(); 
						console.log("Chamou o focus");
					});

				}
			};
		})


		/**	
		 * @ngdoc directive
		 * @name stapi.directive: focus-me
		 * @restrict E
		 * @description Auto focus no elemento
		 * @example
		 * <pre>
		 *     <input  ng-model="model"   class="form-control"  focus-me="true"/>
		 * </pre>
		 * **/
		.directive('focusMe', function($timeout) {
			return {
				scope: { trigger: '=focusMe' },
				require:'ngModel',
				link: function(scope,element,attr,ctrl) {


					scope.$watch('trigger', function(value) {

						if(value === true) { 
							$timeout(function() {

								var ele = element[0] ; 
								ele.selectionStart = ele.value.length;
								//ele.selectionEnd = ele.value.length;;
								ele.focus();
								scope.trigger = false;
							},1000);
						}
					});
				}
			};
		})

		.directive('verticalSpace',function($log){

			$log.warn("vertical-space is now deprecated. Use st-vertical-space instead.");

			return{
				restrict:"E",
				replace:true,
				template:'<div class="row"><div class="vertical-space"></div></div>'
			}

		})

		.directive('stValue',function(){

			return{
				restrict:"E",
				scope:{

					object:"=",
					attr:"=",
					value:"=",

				},
				link:function($scope){

					if(!$scope.object)
						$scope.object = {};

					$scope.object[$scope.attr] = $scope.value;

					$scope.$watch($scope.value,function(){

						$scope.object[$scope.attr] = $scope.value;

					});

				}
			}

		})

		.directive("usuarioSistema",function( $mdDialog,stService,stUtil,loginUtil){

			return{
				restrict:"E",
				templateUrl:"global/st-api/st-util/template-module/usuario-sistema/usuarioSistema.html",
				controller:function($scope, $rootScope, $cookieStore, filialUtil){


					$rootScope.$watch('usuarioSistema', function(usuarioSistema){

						$scope.usuarioSistema = usuarioSistema;
					});


					$scope.logOut = function(){

						loginUtil.logOut();

					}


					$scope.editarFilial = function(){

						filialUtil.openDetalheCurrentFilial(function(filial){


						});
					}

					$scope.editarUsuario = function(usuarioSistema){

						var modal =  $mdDialog.show({
							animation: true,
							templateUrl:"global/st-api/st-util/template-module/usuario-sistema/modalEditUsuario.html",
							size:'lg',
							controller:function($scope){

								$scope.usuarioSistema = usuarioSistema;

								$scope.salvar = function(usuarioSistema,modal){

									if(!usuarioSistema.senha){
										stUtil.showMessage("","O campo senha deve ser preenchido!","danger");
										return;
									}

									if(usuarioSistema.senha!=usuarioSistema.senha2){
										stUtil.showMessage("","As senhas não conferem!","danger");
										return;
									}
									if(usuarioSistema.senha.length<6){
										stUtil.showMessage("","A senha deve ter pelo menos 6 caracteres.","danger");
										return;
									}

									stService.save("operadorsistema",usuarioSistema).then(function(){

										stUtil.showMessage("","Salvo com sucesso!","info");
										modal.$dismiss('cancel');
									});
								}

								$scope.fechar = function(ele){

									ele.$dismiss('cancel');
									callback($scope.objeto);

								}



							}
						});
					}
				}

			}
		})

		.directive("stToggle",function(){

			return{
				restrict:"E",
				templateUrl:"global/st-api/st-util/template-module/stToggle.html",
				scope:{

					ngModel:"=",
					ngDisabled:"=",
				},

			}
		})


		.directive("stSplitCheck",function(){

			return{
				restrict:"E",
				templateUrl:"global/st-api/st-util/template-module/st-split-check.html",
				scope:{

					ngModel:"=",//Valores que serão definidos no objeto, de acordo com os itens selecionados
					preValues:"=",
					limiteLabel:"="
				},
				controller:function($scope){

					if($scope.ngModel==null)
						$scope.ngModel ="";

					var its = $scope.preValues.split(",");

					var itens = [];

					for(var i in its){

						var sele = $scope.ngModel.indexOf(its[i])!=-1;

						itens.push({label:its[i],selecionado:sele});
					}

					$scope.itens = itens;

					$scope.changeCheck = function(){

						var model = "";
						for(var j in $scope.itens){

							if( $scope.itens[j].selecionado==true){
								model = model+","+$scope.itens[j].label;
							}
						}

						$scope.ngModel = model;
					}


				}
			}
		})


		.directive("stStep",function(){

			return{
				restrict:"E",
				templateUrl:"global/st-api/st-util/template-module/st-step.html",
				scope:{

					steps:"=",
					step:"=",
					initialStep:"="

				},
				controller:function($scope){

					if(!$scope.initialStep)
						$scope.step = 0;


					$scope.changeStep = function(index){

						$scope.step = index;
					}
				}

			}
		})

		.directive("inputEdit",function(){

			return{
				restrict:"E",
				templateUrl:"global/st-api/st-util/template-module/inputEdit.html",
				transclude:true,
				scope:{

					label:"=",
					ngModel:"=",
					icon:"=",
					type:"="

				},
				controller:function($scope){

					if($scope.ngModel)
						$scope.mostraValor=true;
					else{
						$scope.mostraValor=false;
					}


				}

			}
		})

		.directive("stCollapse",function(){

			return{
				restrict:"E",
				templateUrl:"global/st-api/st-util/template-module/st-collapse.html",
				transclude:true,
				scope:{

					label:"=",


				},
				controller:function($scope){

					$scope.show = false;


				}

			}
		})

		.directive('stPeriod',function(dateUtil,$localStorage){

			return{
				restrict:"E",
				templateUrl:'global/st-api/st-util/template-module/stPeriod.html',
				require:['de','ate','submit'],
				scope:{

					de:"=",
					ate:"=",
					submit:"=",
					change:"=",
					syncPeriod:"=",//se true, o periodo selecionado é sincronizado em local storage

				},

				controller:function($scope){

					if($scope.syncPeriod==true){

						$scope.de = 	$localStorage.dataDe;
						$scope.ate = 	$localStorage.dataAte;

						$scope.$watch("de",function(de){
							$localStorage.dataDe = de;
						});

						$scope.$watch("ate",function(ate){

							$localStorage.dataAte = ate;
						});

					}



					$scope.alterarPeriodo = function(periodo){

						var p = dateUtil.getPeriodOf(periodo);

						$scope.de = p.de;
						$scope.ate = p.ate;

					}



				}
			}


		})



		.directive("stAlertButton",function(){

			return{
				restrict:"E",
				templateUrl:"global/st-api/st-util/template-module/stAlertButton.html",
				controller:function($scope,$interval,stService,$mdDialog, $location,$stDetalhe, $route){

					var getAlerts = function(){

						stService.executeGet("projecao/execute-query",
								{query:"select p.id,p.nome,'',p.quantidade from Produto p where (p.quantidade<=p.minQuant) and p.disable =0"}).then(function(data){
									$scope.itens =  data.itens;
									$scope.numAlerts = data.itens.length;

								}).catch(function(){


								});



					}

					$interval(getAlerts,15000);

					$scope.openAlerts = function(itens){

						$mdDialog.show({
							animation: true,
							templateUrl:"global/st-api/st-util/template-module/modalAlertEstoque.html",
							size:'md',
							controller:function($scope){

								$scope.itens = itens;

								$scope.fechar = function(ele){

									ele.$dismiss('cancel');
									callback($scope.objeto);

								}

								$scope.toProduct = function(idProduto,modal){

									modal.$dismiss("cancel");

									stService.getById("produto",idProduto).then(function(data){

										$stDetalhe.open("view/produto/addAndUpdateProduto.html",data.item,$scope,function(res){

											$route.reload();

										}); 

									});		

								}

							}
						});
					}

				}

			}
		})

})();
