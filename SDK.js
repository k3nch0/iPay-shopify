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
            installment_month: 6,
            installment_type: 'STANDARD',
            success_redirect_url: "https://demo.ipay.ge/success",
            fail_redirect_url: "https://demo.ipay.ge/fail",
            reject_redirect_url: "https://demo.ipay.ge/reject",
            validate_items: true,
            shop_order_id: this.options.shop_order_id,
            locale: this.options.locale,
            purchase_units: [{
                amount: {
                    currency: "GEL",
                    value: "100.50"
                }
            }],
            cart_items: items
        }
        return checkoutDetails;
        let token = await this.token;
        const result = await api.checkout(this.options, token.access_token, checkoutDetails);
        if(result.error_message == "Requested token expired/invalid"){
            this.token = api.generateToken(this.options);
            token = await this.token;
        }
        return token.access_token;
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