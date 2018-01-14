 // get datepicker
 $(document).ready(function() {

     $('.datepicker').datepicker();


     $('.datepicker2').datepicker();


 });


 //hambager
 var nav = document.querySelector('.navigation');
 //var nav3 = document.querySelector('.navigation3');

 var ham = document.querySelector('.myhambager');
 ham.addEventListener('click', () => {
     nav.classList.toggle('shownav');


 });

 ham.addEventListener('click', () => {
     nav3.classList.toggle('shownav');


 });










 // get current year
 var year = function year() {
     var date = new Date();
     var yr = date.getFullYear();
     return yr;
 }

 var updatedYear = document.querySelectorAll(".year");
 for (let i = 0; i < updatedYear.length; i++) {
     updatedYear[i].innerHTML = "&copy Copyright" + " " + year() + ',' + " " + "All rights Reserved by Luxuz Hotel ";
 }

 //google maps
 function createMap() {
     const loc = {
         lat: 25.2788,
         lng: 55.3309
     }
     const map = new google.maps.Map(document.getElementById('map'), {
         center: loc,

         zoom: 12
     });
     const marker = new google.maps.Marker({
         position: loc,
         map: map
     });

 }


 //hide all stripebuttons on the page

 var btn = document.querySelectorAll('.stripe-button-el');
 for (let i = 0; i < btn.length; i++) {
     btn[i].style.display = "none";
 }