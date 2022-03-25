const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");

module.exports = async function sendEmail(address) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const user = await Users.findOne({ email: address });

  const token = await jwt.sign(
    { _id: user._id.valueOf() },
    process.env.VERIFICATION_TOKEN_SECRET
  );

  const msg = {
    to: address,
    from: "aghamyan.anush@gmail.com",
    subject: "Verification mail",
    html: `<strong>Confirm your account by following this link <a href="http://localhost:3000/auth/confirm/${token}">Confirm</a></strong>`,
  };

  sgMail.send(msg);
};
