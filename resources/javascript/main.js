/**
 * Created by apple on 8/11/14.
 */

/*********** Initialize code ******************/
var fs= require('fs');

//if (customer == null) {
//    //var customer = new Customer('', '', '', '', '');
//}
if (customerDataSource == null){
    var customerDataSource = [];
}
if (productDataSource==null){
    var productDataSource =[];
}

function buildConfig(completeFn)
{
    return ;
}

$(document).ready(function () {
    $("#print_quotation_btn").click(function (event) {
        var html = fs.readFileSync("./quotation.html").toString();
        var html_head = html.match(/<head[^>]*>((\r|\n|.)*)<\/head/m),
            html_body = html.match(/<body[^>]*>((\r|\n|.)*)<\/body/m);

        html_head = html_head ? html_head[1] : '';
        html_body = html_body ? html_body[1] : '';

        $('#printable_quotation').html(html);
    });
    if (customerDataSource.length==0){
        customerDataSource = getCSVContent("./resources/data/customer_sample.csv")
    }
    if (productDataSource.length==0){
        productDataSource = getCSVContent("./resources/data/product_sample.csv")
    }
    $('#print_template_body').click(function () {
       window.print();
    });
    
    var customer_name_input = $('#customer_name');

    setCustomerAutocomplete(customer_name_input,'name');
})
function getCSVContent(path) {
    fileContent = fs.readFileSync(path);
    var results = Papa.parse(fileContent.toString(),{
        header: true,
        dynamicTyping: true,
        worker: false
    });
    if (results['errors'].length == 0) {
        console.log(JSON.stringify(results['data']));
        return results['data'];
    }
    else console.log("Parsed customer information error");
}
function productInformationKeyUpMain(data,searchAttr){
    specialKeyCode = [ 13, 16, 17, 27, 19, 37, 38, 39, 40, 45, 46 ];
    if (specialKeyCode.indexOf(event.keyCode) == -1 && !event.metakey) {
        id = event.target.id;
        var target = $('#' + id);
        if (!target.hasClass("ui-autocomplete-input"))
            setProductAutocomplete(target);
    }
}
function setProductAutocomplete(target) {
    var id = target.attr('id');
    target.autocomplete(
        {
            minLength : 0,
            source : function(request, response) {
                console.log('product autocomplete');
                if (rtrim(request.term.toLowerCase().trim(),' ').length==0)
                    response(productDataSource);
                else {
                    foundObjs = search(request.term, [ 'name' ], productDataSource);
                    response(foundObjs);
                }
            },
            select : function(event, ui) {
                index = parseInt(id.replace("productDescription_",""));
                var appElement = document.querySelector('[ng-app=Demonstration]');
                var appScope = angular.element(appElement).scope();
                appScope.$apply(function () {
                    quantity = $('#'+id.replace("productDescription_","productQuantity_")).text();
                    if (isNaN(parseInt(quantity))) quantity = 1;
                    productSale = new ProductSale(ui.item,quantity);
                    appScope.productSales[index] = productSale;
                });
                return false;
            },
            focus : function(event, ui) {
                return false;
            }
        }).autocomplete("instance")._renderItem = function(ul,
                                                           item) {
        return $("<li>").append(
                "<a>" + item.name + "<br>" + item.weight +"kg<br>"+item.price +"$</a>")
            .appendTo(ul);
    };
    target.autocomplete('widget').addClass("fixed-height");
    target.click(function () {
        target.autocomplete("search",target.text());
    })
}
function setCustomerAutocomplete(target,searchAttr) {
    target.autocomplete({
        minLength : 0,
        source : function(request, response) {
            if (rtrim(request.term.toLowerCase().trim(),' ').length==0)
                response(customerDataSource);
            else {
                foundObjs = search(request.term, [ searchAttr ], customerDataSource);
                response(foundObjs);
            }
        },
        select : function(event, ui) {
            //fillCustomerData(ui.item);
            var appElement = document.querySelector('[ng-app=Demonstration]');
            var appScope = angular.element(appElement).scope();
            appScope.$apply(function () {
                appScope.customer = ui.item;
            });
            return false;
        },
        focus : function(event, ui) {
            return false;
        }
    }).autocomplete("instance")._renderItem = function(ul, item) {
        return $("<li>").append(
                "<a>" + item.name + "<br>" + item.address + "," + item.city
                + "<br>" + item.phone + "</a>").appendTo(ul);
    };
    target.autocomplete('widget').addClass("fixed-height");
    target.click(function () {
        target.autocomplete("search","");
    })
}

/************** My search functions **************/
function search(searchObj, searchAttributes, sources) {
    foundObjs = [];
    searchObj = rtrim(searchObj.toLowerCase().trim(), ' ');
    for (i = 0; i < searchAttributes.length; i++) {
        attr = searchAttributes[i];
        for (j = 0; j < sources.length; j++) {
            objAttrValue = sources[j][attr].toLowerCase();
            if (typeof searchObj == typeof objAttrValue) {
                if (typeof objAttrValue == 'string'
                    || objAttrValue instanceof String) {
                    if (objAttrValue.toLowerCase().indexOf(searchObj) > -1
                        && foundObjs.indexOf(sources[j]) == -1) {
                        foundObjs[foundObjs.length] = sources[j];
                    }
                }
            }
        }
    }
    console.log("Found objects: ", foundObjs);
    return foundObjs;
}
function rtrim(str, ch) {
    for (i = str.length - 1; i >= 0; i--) {
        if (ch != str.charAt(i)) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
}