const api = require('./api');
class Ipay {
    constructor(cfg) {
        if(!Ipay.instance){
            this.options = cfg;
            this.token = api.generateToken(cfg);
            return this;
        }
        return Ipay.instance;
    }
    
    async createOrder(items) {
        let totalAmount = items.reduce((total, currentValue) => total + currentValue.amount * currentValue.quantity, 0);
        const checkoutDetails = {
            intent: this.options.intent,
            installment_month: this.options.installment_month,
            installment_type: this.options.installment_type,
            success_redirect_url: "https://knife.ge/?installment_success",
            fail_redirect_url: "https://knife.ge/?installment_fail",
            reject_redirect_url: "https://knife.ge",
            validate_items: true,
            shop_order_id: this.options.shop_order_id,
            locale: this.options.locale,
            purchase_units: [{
                amount: {
                    currency: "GEL",
                    value: this.options.orderTotal
                }
            }],
            cart_items: items
        }

        let token = await this.token;
        const result = await api.checkout(this.options, token.access_token, checkoutDetails);
        if(result.error_message == "Requested token expired/invalid"){
            this.token = api.generateToken(this.options);
            token = await this.token;
        }

        return api.checkout(this.options, token.access_token, checkoutDetails);
    }

    async getOrders(order) {
        let token = await this.token;
        const result = await api.getOrders(this.options, token.access_token, order);
        if(result.error_message == "Requested token expired/invalid"){
            this.token = api.generateToken(this.options);
            token = await this.token;
        }
        return api.getOrders(this.options, token.access_token, order);
    }
}

module.exports = {
    Ipay
}