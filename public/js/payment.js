
//to get url data as a string
    const queryString = window.location.search;
// parse the query string’s parameters
    const urlParams = new URLSearchParams(queryString);

  const paymentRequestId = urlParams.get('paymentRequestId')
   $.ajax({
    url: 'https://kashier-dashboard.herokuapp.com/api/v1/paymentRequests/createSession',
    headers: {
        'Content-Type':'application/json'
    },
    method: 'POST',
    dataType: 'json',
    data: JSON.stringify({ paymentRequestId: paymentRequestId}),
    success: function(data,status){

        console.log(data.response.sessionCheckoutId);
        let session_id = data.response.sessionCheckoutId
        let order_id = data.response.paymentRequestId
        let merchant_name = data.response.storeName
        let line1 = data.response.line1
        let line2 = data.response.line2
       
        payment(session_id,merchant_name,order_id,line1,line2)
    },
      error: function (request, error) {
          Swal.fire({
              icon: 'info',
              title: 'Oops... '+ error,
              text: 'You have already paid',
              showConfirmButton: false,

          })


      },
});

payment=(session_id,merchant_name,order_id,line1,line2)=> {


    Checkout.configure({
        session: {
            id: session_id
        },
        interaction: {
            operation: 'PURCHASE',
            merchant: {
                name: merchant_name,
                address: {
                    line1: line1,
                    line2: line2
                }
            },

        },
        order: {
            id: order_id,

        }
    });

   Checkout.showEmbeddedPage('#embed-target')
}
function errorCallback(error) {

    $.ajax({
        url: 'https://kashier-dashboard.herokuapp.com/api/v1/paymentRequests/callback/'+paymentRequestId,
        headers: {
            'Content-Type':'application/json'
        },
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({ result: error}),
        success: function(data,status){


            console.log(data)

        },
        error: function (request, error) {
            console.log(request.messages);


            Swal.fire({
                icon: 'error',
                title: 'Oops... ',
                text: error,
                showConfirmButton: false,

            })

        },
    });

  Swal.fire({
        icon: 'info',
        title: 'Oops... '+ error.error.cause,
        text: 'You have already paid',
      showConfirmButton: false,

    })

}
function cancelCallback() {
    console.log('Payment cancelled');
}
function completeCallback(data ){

console.log('completeCallback');
    console.log(data)
    $.ajax({
        url: 'https://kashier-dashboard.herokuapp.com/api/v1/paymentRequests/callback/'+paymentRequestId,
        headers: {
            'Content-Type':'application/json'
        },
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({ result: data}),
        success: function(data,status){




        },
        error: function (request, error) {


        },
    });
    Swal.fire({
        icon: 'success',
        title: 'SUCCESS',
        text: 'Payment has been made successfully',
        showConfirmButton: false,

    })
}

// $(window).on('load', showDatetime());
//
// function showDatetime() {
//     Checkout.showEmbeddedPage('#embed-target')
// }