import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login.jsx";
import { Register } from "./pages/register.jsx";
import { Homepage } from "./components/Homepage.jsx";
import { Account_detail } from "./pages/account_detail.jsx";
import { Product } from "./components/Product.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Sign-up" element={<Register />} />
        <Route path="/" element={<Homepage/>} />
        <Route path="/" element={<Product/>} />
        <Route path="/account-details" element={<Account_detail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;