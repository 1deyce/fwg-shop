import { Route, Routes, BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/cartContext";
import Home from "./pages/Home";
import Store from "./pages/Store";
import CheckoutSuccess from "./pages/Confirmation";

function App() {
  return (
    <>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </>
  );
}

export default App;
