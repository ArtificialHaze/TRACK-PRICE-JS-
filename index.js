// INSTALL DOTENV AND NIGHTMARE, BEFORE USING CODE BELOW

require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const nightmare = require("nightmare")();

const args = process.argv.slice(2);
const url = args[0];
const minPrice = args[1];

checkPrice();

async function checkPrice() {
  try {
    const priceString = await nightmare
      .goto(url)
      .wait("#priceblock_ourprice") //PRICE HTML ELEMENT FROM VENDOR
      .evaluate(() => document.getElementById("priceblock_ourprice").innerText)
      .end();
    const priceNum = parseFloat(priceString.replace("$", ""));
    if (priceNum < minPrice) {
      await sendMail("Price is good", `The price on ${url} has dropped!`);
    }
  } catch (err) {
    await sendMail("Price checker error", err.message);
    throw err;
  }
}

function sendMail(subject, body) {
  const email = {
    to: "MAIL_GOES_HERE",
    from: "VENDOR/SHOP_MAIL_GOES_HERE",
    subject: subject,
    text: body,
    html: body,
  };
  return sgMail.send(email);
}
