import { useState, useContext } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Cart from "../components/UI/Cart";
import { CartContext } from "../context/cartContext";

const products = [
  {
    id: 1,
    name: "30 Day Ab Challenge",
    href: "#",
    price: 150,
    description: `The Ab Challenge that’ll build, sculpt and strengthen your abs in just 30 days!
            Completely bodyweight, but dumbbells of your choice can be added for extra resistance.`,
    imageSrc:
      "https://d2j6dbq0eux0bg.cloudfront.net/images/100939530/4322223003.jpg",
    imageAlt:
      "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
    quantity: 1,
  },
];

const Store = () => {
  const [searchItem, setSearchItem] = useState("");
  const [filteredItems, setFilteredItems] = useState(products);
  const { addToCart, cartItems } = useContext(CartContext);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    if (searchTerm.trim() === "") {
      setFilteredItems(products);
    } else {
      const filteredTerms = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredItems(filteredTerms);
    }
  };

  const handleProductClick = (product) => {
    addToCart(product);
  };

  return (
    <>
      <Header />
      <section className="p-12">
        <div className="bg-white flex-wrap xl:flex justify-center">
          <div className="basis-2/3 mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-10 xl:border-r xl:border-gray-200 sm:mt-20">
            {/* Search Bar */}
            <div className="flex justify-center flex-row items-center mb-20">
				<MagnifyingGlassIcon className="size-6 mr-2" />
				<input
					type="text"
					value={searchItem}
					onChange={handleInputChange}
					placeholder="Type to search..."
					className="w-1/2 h-[50px] p-4 rounded-full bg-gray-100 placeholder:text-black"
				/>
            </div>
            <h2 className="sr-only">Products</h2>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {filteredItems.map((product) => (
                <a
                  key={product.id}
                  href={product.href}
                  className="cursor-pointer"
                >
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7">
                    <img
                      alt={product.imageAlt}
                      src={product.imageSrc}
                      className="h-full w-full object-cover object-center hover:opacity-50 transition duration-300 rounded-lg"
                    />
                    <h3 className="mt-4 text-sm text-gray-700">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      R{product.price.toFixed(2)}
                    </p>
                    <button
                      className="bg-gray-900 text-white p-2 rounded-sm mt-2"
                      onClick={() => handleProductClick(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="basis-1/3 py-24 relative">
            <div className="sm:h-[70vh] overflow-y-auto">
              <Cart cartItems={cartItems} />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Store;
