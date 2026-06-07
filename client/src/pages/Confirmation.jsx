import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/cartContext";

const CheckoutSuccess = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const [purchaseDate, setPurchaseDate] = useState("");
    const [orderedItems] = useState(() => cartItems.map((item) => item.name));

    useEffect(() => {
        const date = new Date();
        const options = { day: "numeric", month: "long", year: "numeric" };
        setPurchaseDate(date.toLocaleDateString("en-GB", options));
        clearCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Header />
            <section className="antialiased h-[100vh] flex justify-center items-center bg-black">
                <div className="mx-auto max-w-2xl px-4 2xl:px-0">
                    <h2 className="text-2xl text-white sm:text-5xl font-bold mb-8">
                        Thanks For Your Order!
                    </h2>
                    <p className="text-slate-50 mb-6 md:mb-8">
                        Once your payment is confirmed, an email with your
                        download link will be sent to you. This can take a few
                        minutes. If it doesn&apos;t arrive, please check your
                        spam folder.
                    </p>
                    <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-white/5 p-6 mb-6 md:mb-8">
                        <dl className="sm:flex items-center justify-between gap-4">
                            <dt className="font-normal mb-1 sm:mb-0 text-slate-500 dark:text-gray-400">
                                Date
                            </dt>
                            <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                                {purchaseDate}
                            </dd>
                        </dl>
                        {orderedItems.length > 0 && (
                            <dl className="sm:flex items-center justify-between gap-4">
                                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                                    Order Item/s
                                </dt>
                                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                                    {orderedItems.join(", ")}
                                </dd>
                            </dl>
                        )}
                    </div>
                    <div className="flex justify-center mt-2 mb-6 text-slate-50">
                        <p>
                            We&apos;d love to hear from you ! For questions or
                            feedback, please email us at{" "}
                            <span className="italic">
                                fitnesswithgabyr@gmail.com
                            </span>
                        </p>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default CheckoutSuccess;
