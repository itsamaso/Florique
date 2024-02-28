import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './components/pages/Customer/CustomerCheckout/Cart'; // Adjust the path as necessary
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// Import your components
import LoginShopOwner from './components/pages/Auth/SigninShopOwner';
import SignupShopOwner from './components/pages/Auth/SignupShopOwner';
import SignUp from './components/pages/Auth/SignupClient';
import SignIn from './components/pages/Auth/SigninClient';
import HeroSection from './components/shared/HeroSection';
import FlowerDisplayPage from './components/pages/Customer/ShopsPage/ShopDisplayPage';
import FlowerShopCard from './components/pages/Customer/ShopsPage/ShopCard';
import ShopsPage from './components/pages/Customer/ShopsPage/ShopsPage';
import ShopOwnerProfile from './components/pages/ShopOwner/ShopOwnerProfile';
import CheckoutPage from './components/pages/Customer/CustomerCheckout/CheckoutPage';
import CustomerProfile from './components/pages/Customer/CustomerProfile/CustomerProfile';
import ImageStack from './components/buildBouquet/ImageStack';
import { AuthProvider } from './Services/AuthProvider';
const App = () => {
  return (
    <Router>
      <AuthProvider> {/* Wrap your routes in AuthProvider */}
      <CartProvider> {/* Wrap your routes in CartProvider */}
        <Routes>
        <Route path="/checkout/:id" element={<CheckoutPage />} />
        <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/" element={<HeroSection />} />
          <Route path="/shops" element={<ShopsPage/>} />
          <Route path="/shopowner" element={<ShopOwnerProfile  />} />
          <Route path="/shop/:id" element={<FlowerDisplayPage />} />
          <Route path="/signin/shopowner" element={<LoginShopOwner />} />
          <Route path="/signup/shopowner" element={<SignupShopOwner />} />
          <Route path="/signup/client" element={<SignUp />} />

        
          <Route  path="/build/:id" element={
          
          <DndProvider backend={HTML5Backend}>
          <ImageStack />
        </DndProvider>
          } />
          
  <Route path="/signinclient" element={<SignIn />} />
          {/* More routes as needed */}
        </Routes>
      </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
