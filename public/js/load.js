//get stripe source

window.onload = function load (){
    const stripeSrc ="https://checkout.stripe.com/checkout.js";
    const script = document.querySelectorAll('script');
    for (let i = 0; i < script.length; i++) {
        console.log(script[i].src.contains(stripesrc));

}

}
