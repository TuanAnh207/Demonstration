/**
 * Created by apple on 8/12/14.
 */
function fillCustomerData(customer){
    $('#customer_name').text(customer.name);
    $('#customer_address').text(customer.address);
    $('#customer_city').text(customer.city);
    $('#customer_phone').text(customer.phone);
    $('#customer_information').data('customer',customer);
}