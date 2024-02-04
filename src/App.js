import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './components/pages/Customer/Cart'; // Adjust the path as necessary

// Import your components
import LoginShopOwner from './components/pages/Auth/SigninShopOwner';
import SignupShopOwner from './components/pages/Auth/SignupShopOwner';
import SignUp from './components/pages/Auth/SignupClient';
import SignIn from './components/pages/Auth/SigninClient';
import HeroSection from './components/shared/HeroSection';
import FlowerDisplayPage from './components/pages/FlowerDisplayPage';
import FlowerShopCard from './components/pages/Customer/ShopsPage/FlowerShopCard';
import ShopDisplayPage from './components/pages/Customer/ShopsPage/ShopDisplayPage';
import ShopOwnerProfile from './components/pages/ShopOwner/ShopOwnerProfile';
import CheckoutPage from './components/pages/Customer/CheckoutPage';
import CustomerProfile from './components/pages/Customer/CustomerProfile/CustomerProfile';
// Your predefined shop object
const shop = {
  // shop details
};

const App = () => {
  return (
    <Router>
      <CartProvider> {/* Wrap your routes in CartProvider */}
        <Routes>
        <Route path="/checkout/:id" element={<CheckoutPage />} />
        <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/" element={<HeroSection />} />
          <Route path="/shops" element={<ShopDisplayPage/>} />
          <Route path="/shopowner" element={<ShopOwnerProfile  />} />
          <Route path="/shop/:id" element={<FlowerDisplayPage />} />
          <Route path="/signin/shopowner" element={<LoginShopOwner />} />
          <Route path="/signup/shopowner" element={<SignupShopOwner />} />
          <Route path="/signup/client" element={<SignUp />} />
          <Route path="/signinclient" element={<SignIn />} />
          {/* More routes as needed */}
        </Routes>
      </CartProvider>
    </Router>
  );
};

export default App;
