import axios from "axios";
import crypto from "crypto";

//CheckoutPayment
export const checkoutPayment = async (req, res) => {
  const cartItems = req.body;

  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const paymentData = {
    merchant_id: "17320049", //"10034730",
    merchant_key: "0qylizsmzlnqv", // y3yqgu6r7gs0g,
    amount: JSON.stringify(subtotal),
    // return_url: "https://localhost:5173/checkout-success",
    // email: "Gabyantoniar@gmai.com",
    item_name: cartItems.map((item) => item.name).join(", "),
  };

  const phrase = "michaeljeckson"; //TrainingMassage10

  const generateSignature = (data, passPhrase = null) => {
    // Create parameter string
    let pfOutput = "";

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        // console.log(key + " " + data[key]);
        if (data[key] !== "") {
          console.log(key + " " + data[key]);
          pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(
            /%20/g,
            "+"
          )}&`;
        }
      }
    }

    // Remove last ampersand
    let getString = pfOutput.slice(0, -1);
    if (passPhrase !== null) {
      getString += `&passphrase=${encodeURIComponent(phrase.trim()).replace(
        /%20/g,
        "+"
      )}`;
    }

    return crypto.createHash("md5").update(getString).digest("hex");
  };

  paymentData["signature"] = generateSignature(paymentData, phrase);

  const dataToString = (dataArray) => {
    // Convert your data array to a string
    let pfParamString = "";
    for (let key in dataArray) {
      if (dataArray.hasOwnProperty(key)) {
        pfParamString += `${key}=${encodeURIComponent(
          dataArray[key].trim()
        ).replace(/%20/g, "+")}&`;
      }
    }
    // Remove last ampersand
    return pfParamString.slice(0, -1);
  };

  const paymentString = dataToString(paymentData);
  const newPaymentString = paymentString.replace(/^|"$/g, "");

  const getPaymentId = async (newPaymentString) => {
    console.log(newPaymentString);
    try {
      const response = await axios.post(
        "https://www.payfast.co.za/eng/process",
        // "https://sandbox.payfast.co.za/eng/process",
        newPaymentString
      );
      console.log("response: ", response.data); // This will contain the payment ID or error message
      await axios.post(
        "https://localhost:5173/checkout-success",
        response.data
      );
    } catch (error) {
      console.error(error);
    }
  };

  getPaymentId(newPaymentString);
};
