// <!-- Start Hotjar -->
// (function(h,o,t,j,a,r){
//   h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
//   h._hjSettings={hjid:465654,hjsv:5};
//   a=o.getElementsByTagName('head')[0];
//   r=o.createElement('script');r.async=1;
//   r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
//   a.appendChild(r);
// })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
// <!-- End Hotjar -->

// <!-- Start SteelHouse Tracking Pixel-->
(function(){"use strict";var e=null,b="4.0.0",n="22437",additional="",t,r,i;try{t=top.document.referer!==""?encodeURIComponent(top.document.referrer.substring(0,2048)):""}catch(o){t=document.referrer!==null?document.referrer.toString().substring(0,2048):""}try{r=window&&window.top&&document.location&&window.top.location===document.location?document.location:window&&window.top&&window.top.location&&""!==window.top.location?window.top.location:document.location}catch(u){r=document.location}try{i=parent.location.href!==""?encodeURIComponent(parent.location.href.toString().substring(0,2048)):""}catch(a){try{i=r!==null?encodeURIComponent(r.toString().substring(0,2048)):""}catch(f){i=""}}var l,c=document.createElement("script"),h=null,p=document.getElementsByTagName("script"),d=Number(p.length)-1,v=document.getElementsByTagName("script")[d];if(typeof l==="undefined"){l=Math.floor(Math.random()*1e17)}h="dx.steelhousemedia.com/spx?"+"dxver="+b+"&shaid="+n+"&tdr="+t+"&plh="+i+"&cb="+l+additional;c.type="text/javascript";c.src=("https:"===document.location.protocol?"https://":"http://")+h;v.parentNode.insertBefore(c,v)})()
// <!-- End SteelHouse Tracking Pixel-->

// <!-- Start KLAVIYO Tracking-->
var _learnq = _learnq || [];
_learnq.push(['account', 'L8urMJ']);
(function () {
var b = document.createElement('script'); b.type = 'text/javascript'; b.async = false; b.defer = true;
//:::::https://a.klaviyo.com/media/js/analytics/analytics.js redirects to https://static.klaviyo.com/onsite/js/klaviyo.js
//b.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'a.klaviyo.com/media/js/analytics/analytics.js';
b.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'static.klaviyo.com/onsite/js/klaviyo.js';
var a = document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(b, a);
})();
// <!-- End KLAVIYO Tracking-->

// <!-- BEGIN KLAVIYO SIGNUP FORM CODE -->
var __klKey = __klKey || 'L8urMJ';
(function() {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = false;
  s.defer = true;
  //:::::https://static.klaviyo.com/forms/js/client.js redirects to https://static.klaviyo.com/onsite/js/klaviyo.js
  s.src = '//static.klaviyo.com/onsite/js/klaviyo.js';
  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);
})();
// <!-- END KLAVIYO SIGNUP FORM CODE -->

// defer comm100
if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  var div = document.createElement('div');
  div.id = 'comm100-button-95000000-0000-0000-0000-008e000f4468';
  document.body.appendChild(div);
  var Comm100API=Comm100API||{};(function(t){function e(e){var a=document.createElement("script"),c=document.getElementsByTagName("script")[0];a.type="text/javascript",a.defer=!0,a.src=e+t.site_id,c.parentNode.insertBefore(a,c)}t.chat_buttons=t.chat_buttons||[],t.chat_buttons.push({code_plan:"95000000-0000-0000-0000-008e000f4468",div_id:"comm100-button-95000000-0000-0000-0000-008e000f4468"}),t.site_id=1000552,t.main_code_plan="95000000-0000-0000-0000-008e000f4468",e("https://vue.comm100.com/livechat.ashx?siteId="),setTimeout(function(){t.loaded||e("https://standby.comm100vue.com/livechat.ashx?siteId=")},5e3)})(Comm100API||{})
}

// event tracking 
var checkJqueryID = setInterval(function() {
  if (typeof jQuery !== 'undefined') {
    clearInterval(checkJqueryID);
    $(document).on('click', 'body:not(.ab-variation) #AddToCart', function() {
      ga('send', 'event', { eventCategory: 'addtocart_button', eventAction: 'addtocart_click', eventLabel: 'control', transport: 'beacon' });
    });
    $(document).on('click', 'body:not(.ab-variation) .btn-qv', function() {
      ga('send', 'event', { eventCategory: 'quickview_button', eventAction: 'quickview_click', eventLabel: 'control', transport: 'beacon' });
    });
    $(document).on('click', 'body:not(.ab-variation) input.btn.checkout-btn[name="checkout"]', function() {
      ga('send', 'event', { eventCategory: 'checkout_button', eventAction: 'checkout_click', eventLabel: 'control', transport: 'beacon' });
    });
  }
},1000);

// klaviyoForms submit
window.addEventListener("klaviyoForms", function(e) {
  if (e.detail.type == 'submit') {
    ga('send', 'event', 'Klaviyo form', 'form_submit', e.detail.formId);
  }
});

// snippet/term-and-condiction-init.liquid
// document.addEventListener('DOMContentLoaded', function() {
//   var BOLD = (window.BOLD = window.BOLD || {});
//   if (BOLD && BOLD.BMS && BOLD.BMS.BUILDS && BOLD.BMS.BUILDS.TermsAndConditions) {
//     var settings = {};
//     new BOLD.BMS.BUILDS.TermsAndConditions(settings);
//   }
// });

function getCookie(name) {
  var value = `; ${document.cookie}`;
  var parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// attentive US detect
function w_setCookie(name, value, days = 1) {
  var date = new Date();
  date.setTime(date.getTime()+(days * 24 * 60 * 60 * 1000));
  var expires = "; expires="+date.toUTCString();
  document.cookie = name+"="+value+expires+"; path=/";
}

if( (typeof( getCookie('attentive_location') ) === 'undefined') ){
  fetch('https://jsonip.com/')
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      // console.log(json);
      return fetch('https://tracker.efmt.app/v1/region-tracking?ip=' + json.ip);
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      // console.log(json);
      json.result ? w_setCookie('attentive_location', '1', 30) : w_setCookie('attentive_location', '2', 30);
    });
}
