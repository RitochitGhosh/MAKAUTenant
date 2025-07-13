import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";
import VerifyEmail from "./pages/VerifyEmail";
import AddProperty from "./pages/AddProperty";
import PropertyDetail from "./pages/PropertyDetail";
import Footer from "./components/Footer";
import ManageProperties from "./pages/ManageProperty";
import EditProperty from "./pages/EditProperty";
import Explore from "./pages/Explore";
import WishListPage from "./pages/WishList";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  return (
    <BrowserRouter>
    <Header />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/reset-password" element={ <ResetPassword /> } />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/verify-email/:id/:token" element={<VerifyEmail />} />
          <Route path="/add-property/" element={<AddProperty />} />
          <Route path="/property/:id" element={ <PropertyDetail /> } />
          <Route path="/manage-properties" element={ <ManageProperties /> } />
          <Route path="/edit-property/:id" element={ <EditProperty /> } />
          <Route path="/wishlist" element={ <WishListPage /> } />
        </Route>
        <Route path="/explore" element={<Explore />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
