const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");

module.exports = async function sendEmail(address) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const token = await jwt.sign(
        { email: address },
        process.env.VERIFICATION_TOKEN_SECRET
      );

      const msg = {
        to: address,
        from: "anush.aghamyan@gmail.com",
        subject: "Verification mail",
        text: "and easy to do anywhere, even with Node.js",
        html: `<strong>Confirm your account by following this link <a href="http://localhost:3000/auth/confirm/${token}">Confirm</a></strong>`,
      };

      sgMail.send(msg);
};
