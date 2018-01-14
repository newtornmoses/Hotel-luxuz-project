// jquery locate form and inputs
// Stripe.setPublishableKey('pk_test_BaS7sO9TqkPmmPjyhOPKhHvQ');

// $(document).ready(() => {
//     var form = $('#checkout');

//     form.submit((e) => {

//         form.find('button').prop('disabled', true);
//         stripe.card.createToken({
//             number = $('#cardno').val(),
//             cvc = $('#cvc').val(),
//             cardholder = $('#cardname').val(),
//             exp_year = $('#exp_yr').val(),
//             exp_month = $('#exp_mth').val()


//         }, ResponseHandler);
//     });

// });

// // getToken;
// function ResponseHandler(status, response) {
//     if (response.error) {

//         form.find('button').prop('disabled', fasle);
//     } else {
//         var Token = response.id;

//         var hiddenInput = $('<input type="hidden" name="stripeToken"/>').val(Token);

//         form.append(hiddenInput);
//         form.get(0).submit();
//     }
// }


// method2

// const handler = StripeCheckout.configure({
//     key: "pk_test_BaS7sO9TqkPmmPjyhOPKhHvQ",
//     image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
//     locale: 'auto',
//     token: function(token) {
//         const Token = token.id;
//         return Token;
//     }
// });


// //on event listen

// document.querySelector('#stripe_btn').addEventListener('click', function(e) {
//     handler.open({
//         name: 'newtorn moses',
//         description: 'my shop',
//         amount: '20.00usd'

//     });
//     e.preventDefault();
// });

// // on navigation
// window.addEventListener(popstate, function() {
//     Handler.close();
// })