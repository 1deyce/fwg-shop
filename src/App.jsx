import { Route, Routes, BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/cartContext";
import Home from "./pages/Home";
import Store from "./pages/Store";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </>
  );
}

export default App;
