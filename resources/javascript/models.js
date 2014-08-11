/**
 * Created by apple on 8/11/14.
 * Description: Application model constructors including:
 *  Core models:
 *      + Customer
 *      + Product
 *      + Misc
 *  Behavioural models:
 *      + ProductSale
 */
/** *************************** Application models **************************** */
function Customer(id, name, address, city, phone) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.city = city;
    this.phone = phone;
}
function Product(id, name, weight,price) {
    this.id = id;
    this.name = name;
    this.weight = weight;
    this.price = price;
}
function ProductSale(product, quantity) {
    this.product = product;
    this.quantity = quantity;
}
function Misc(date, orderno, rep1, rep2) {
    this.date = date;
    this.orderno = orderno;
    this.rep1 = rep1;
    this.rep2 = rep2;
}