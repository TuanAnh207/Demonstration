/**
* Created by apple on 8/12/14.
*/
var moment = require('./resources/javascript/moment.js');

if (loaded ==null) {
    var loaded = false;
}
var idSequence = 0;

function focusChildren(childrenId) {
    $('#'+childrenId).focus();
}
$(document).ready(function () {
    /* Binding event to handler*/


    /* Angular */
    if(typeof angular == 'undefined') {
        $.ajax({
            url: 'bower_components/angular/angular.js',
            async:false,
            dataType: "script",
            success: function () {
                $.ajax({
                    url: 'bower_components/angular-sanitize/angular-sanitize.js',
                    async:false,
                    dataType: "script"
                });
            }
        });
    }
    if (typeof angular != 'undefined'){
        loaded = true;
        var app = angular.module('Demonstration', ['ngSanitize']);

        app.controller('mainControler',
            function ($scope) {
                var appElement = document.querySelector('[ng-app=Demonstration]');
                var appScope = angular.element(appElement).scope();
                appScope.misc_information = new Misc(moment().format('L'),' ',' ',' ');
                appScope.customer = new Customer('','','','','');
                appScope.productSales = [];

                $scope.calculateSellPrice = function(productSale){
                   return (parseInt(productSale.product.price)*(1+parseFloat(productSale.product.profit))).toFixed(2);
                };
                appScope.calculateItemTotal = function (productSale) {
                    return (parseInt(productSale.product.price)*(1+parseFloat(productSale.product.profit))*parseInt(productSale.quantity)).toFixed(2);
                };
                appScope.calculateWeightTotal = function (productSale) {
                    return (parseFloat(productSale.product.weight)*parseInt(productSale.quantity)).toFixed(2);
                }
                appScope.calculateInventory = function () {
                    var total =  0;
                    for(i=0;i<appScope.productSales.length;i++){
                        productSale = appScope.productSales[i];
                        total +=(parseInt(productSale.product.price)*(1+parseFloat(productSale.product.profit))*parseInt(productSale.quantity));
                    }
                    if (total==null) total = 0;
                    else total = parseFloat(total);
                    return total.toFixed(2);
                };
                
                $scope.addEmptyProduct = function () {
                    appScope.productSales.push(new ProductSale(new Product('','','','','',''),0));
                }
                $scope.removeProduct = function (productSale) {
                    var index = $scope.productSales.indexOf(productSale);
                    appScope.productSales.splice(index,1);
                };
                appScope.productInformationKeyUp = function (productSale,colsName) {
                    if (colsName =='name' )
                        productInformationKeyUpMain(productSale.product.name,'name');
                    else if (colsName=='quantity'){

                    }
                }
                $scope.getGenerateId = function () {
                    idSequence+=1;
                    return idSequence+'_productName';
                }

                $scope.templateFlag= {"printable_quotation":false,"printable_packinglist":false,"printable_invoice":false};
                $scope.showTemplate = function (id) {
                    for(var key in $scope.templateFlag){
                        if (key!=id)
                            $scope.templateFlag[key] = false;
                    }
                    $scope.templateFlag[id] = !($scope.templateFlag[id]);
                }
            }
        );
        app.directive('contenteditable', function () {
            return {
                restrict: 'A', // only activate on element attribute
                require: '?ngModel', // get a hold of NgModelController
                link: function (scope, element, attrs, ngModel) {
                    if (!ngModel) return; // do nothing if no ng-model

                    // Specify how UI should be updated
                    ngModel.$render = function () {
                        element.html(ngModel.$viewValue || '');
                    };

                    // Listen for change events to enable binding
                    element.on('blur keyup change', function () {
                        scope.$apply(readViewText);
                    });

                    // No need to initialize, AngularJS will initialize the text based on ng-model attribute

                    // Write data to the model
                    function readViewText() {
                        var html = element.html();
                        // When we clear the content editable the browser leaves a <br> behind
                        // If strip-br attribute is provided then we strip this out
                        if (attrs.stripBr && html == '<br>') {
                            html = '';
                        }
                        ngModel.$setViewValue(html);
                    }
                }
            };
        });
    }
});