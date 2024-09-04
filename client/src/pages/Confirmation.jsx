import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../context/cartContext";
import emailjs from "@emailjs/browser";

const CheckoutSuccess = () => {
  const { cartItems } = useContext(CartContext);
  const [purchaseDate, setPurchaseDate] = useState("");
  const emailSentRef = useRef(false);

  useEffect(() => {
    const customerName = localStorage.getItem("customerName");
    const customerEmail = localStorage.getItem("customerEmail");
    console.log("customer: ", customerName, customerEmail);

    const emailSent = localStorage.getItem("emailSent");

    if (customerEmail && customerName && !emailSentRef.current && !emailSent) {
      const templateParams = {
        to_email: customerEmail,
        from_name: "Shop FWG",
        to_name: customerName,
        message: `Thank you for your order! To access your order, please click on the link below: 
          https://drive.google.com/uc?export=download&id=1lA7QO_gMMtM0xwI8cTArR2fn2wsvr6p9
        `,
      };

      emailjs
        .send(
          import.meta.env.VITE_SERVICE_ID,
          import.meta.env.VITE_TEMPLATE_ID,
          templateParams,
          { publicKey: import.meta.env.VITE_USER_ID }
        )
        .then((response) => {
          console.log(
            "Email sent successfully!",
            response.status,
            response.text
          ),
            localStorage.setItem("emailSent", "true");
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
        });

      emailSentRef.current = true;
    }
  }, []);

  useEffect(() => {
    const timestamp = Date.now();
    const date = new Date(timestamp);

    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);

    setPurchaseDate(formattedDate);
  }, []);

  return (
    <>
      <Header />
      <section className="antialiased h-[100vh] flex justify-center items-center">
        <div className="mx-auto max-w-2xl px-4 2xl:px-0">
          <h2 className="text-2xl text-black sm:text-5xl font-bold mb-8">
            Thanks For Your Order!
          </h2>
          <p className="text-slate-950 mb-6 md:mb-8">
            An email has been sent to you! You can access/download your program
            by clicking the link provided.
          </p>
          <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-black p-6 mb-6 md:mb-8">
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-slate-500 dark:text-gray-400">
                Date
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                {purchaseDate}
              </dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                Order Item/s
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                {cartItems.map((item) => item.name)}
              </dd>
            </dl>
          </div>
          <div className="flex justify-center mt-2 mb-6">
            <p>
              We&apos;d love to hear from you ! For questions or feedback,
              please email us at{" "}
              <span className="italic">fitnesswithgaby@gmail.com</span>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CheckoutSuccess;
