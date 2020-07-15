import {loadScript} from '../App.js';

const __DEV__ = document.domain === "localhost"

async function displayRazorpay(){
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    if(!res){
      alert('Razorpay SDK Failed')
      return
    }

    const data = await fetch('http://localhost:5000/razorpay',{ method:'POST' }).then((t) => t.json() )
    console.log(data)

    const options = {
      key: __DEV__ ? 'rzp_test_LyQUQA2sH58KIZ' : 'Production_key' ,
      amount: data.amount.toString(),
      currency: data.currency,
      order_id: data.id,
      name: "Hyperl Technologies",
      description: "Pay your bill..!!",
      image: "https://logos-download.com/wp-content/uploads/2016/09/React_logo_logotype_emblem.png",
      handler : function (response){
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature)
      },
      prefill: {
          "name": "T Kap_si"
      },
      theme: {
          "color": "rgb(218, 102, 241)"
      }
  };

  const paymentObj = new window.Razorpay(options);
  paymentObj.open()
  }

  export default displayRazorpay;