# iPay SDK

## Installation

```bash
npm i @bank-of-georgia/ipay-sdk
```

## Usage

```js
const SDK = require('@bank-of-georgia/ipay-sdk');
```


#### Create config

```js
const ipay = new SDK.Ipay({
    intent: "AUTHORIZE",
    username: "1006",
    password: "581ba5eeadd657c8ccddc74c839bd3ad",
    api: "dev.ipay.ge",//dev.ipay.ge developer mode, ipay.ge production mode
    redirect_url: "http://localhost:3000",
    shop_order_id: "Shop order id",
    card_transaction_id: "",
    locale: "ka",
    industry_type: "ECOMMERCE",
    currency_code: "GEL"
});
```


#### Products array

```js
const items = [
     { product_id: "123456789", quantity: 1, amount: 1.00, description: "product description text 1" },
     { product_id: "987654321", quantity: 3, amount: 5.00, description: "product description text 2" }
];
```

#### create order
```js
const order = await ipay.createOrder(items);
```
##### response
```js
{
    status: 'CREATED',
    payment_hash: 'c4737a6b4a2e5c9e1fe00a284d1e7baa631c68e2',
    links:[
        { 
            href: 'https://dev.ipay.ge/opay/api/v1/checkout/orders/aa233c3b716cae55c403553c49657ee55fe208ad?locale=ka',
            rel: 'self',
            method: 'GET' 
        },
        { 
            href: 'https://dev.ipay.ge/?paymentId=aa233c3b716cae55c403553c49657ee55fe208ad',
            rel: 'approve',
            method: 'GET' 
        } 
    ],
    order_id: 'aa233c3b716cae55c403553c49657ee55fe208ad' 
}
```
payment_hash and order_id have to be stored in safe location


#### get orders
```js
const ordersList = await ipay.getOrders("<saved order_id>");
```


#### callback

```js
router.route('/pay/status').post( async (req, res, next) => {
    const { status, payment_hash, order_id, status_description, shop_order_id, ipay_payment_id } = req.body;
    const saved_order_id = "<saved order_id>";
    const saved_payment_hash = "<saved payment_hash>";
    if(order_id == saved_order_id && payment_hash == saved_payment_hash){
        //update status and send response
        res.sendStatus(200);
    }else{
        res.sendStatus(404);
    }
});
```