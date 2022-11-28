const stripe = require("stripe")('sk_test_51Lrnh3Hn5HPNBT2DHgZxIB7EYtwPMCRUxe9wEUc5LXQbDRuRRKQ7pBJccxVCGoOytN4UAtfiQKG6nOgxekqUI4nT00fYlNuUwH');
const cookie = require('cookie');

exports.handler = async (event, context) => {

  const name = event.body.split("name=")[1].split("&email=")[0].replaceAll('+', ' ');
  const email = decodeURIComponent(event.body.split("email=")[1].split("&stripeToken=")[0]);
  const stripeToken = event.body.split("stripeToken=")[1];
  const myCookie = cookie.serialize('emailHash', email);
  //console.log(stripeToken)

  try {
    const token = stripeToken;

    const charge = await stripe.charges.create(
      {
        amount: 10000,
        currency: "usd",
        description: "Down payment for first access to fast-query",
        source: token,
      }
    );
      //console.log(charge)
    return {
      statusCode: 302,
      headers: {
        "Location": "/thank-you",
        'Set-Cookie': myCookie
      },
      body: "Success",
    };

  } catch (err) {

    return {
      statusCode: 400,
      body: err,
    };
  }
};