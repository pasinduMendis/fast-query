const mongoose = require("mongoose");
require("./customFunctions/userModel");
const User = mongoose.model("users");
const shortid = require("shortid");
const cookie = require('cookie');

exports.handler = async (event, context) => {

  const array = event.body.split("firstName=");
  const firstName = decodeURIComponent(array[1]);
  const myCookie = cookie.serialize('emailHash', firstName);

  try {
    mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true,
    useUnifiedTopology: true, useFindAndModify: false});

    const existingUser = await User.findOne({ first_name: firstName });

    if (existingUser) {

    }

    if (!existingUser) {
      const shortIdVariable = shortid.generate();

      const user = await new User({
        first_name: firstName,
        referralId: shortIdVariable,
        numberOfReferrals: 0
      }).save();
    }
    mongoose.disconnect();

    return {
      statusCode: 302,
      headers: {
        "Location": "/early-access",
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