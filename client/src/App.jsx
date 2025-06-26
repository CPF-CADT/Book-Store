import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login.jsx";
import { Register } from "./pages/register.jsx";
import { Homepage } from "./components/Homepage.jsx";
import { Account_detail } from "./pages/account_detail.jsx";
import { ProductGrid } from "./components/ProductCard.jsx";
import { FilterSideBar } from "./components/FilterSideBar.jsx";
import { SortControls } from "./components/SortControls.jsx";
import { LoginHeader } from "./components/HeaderFooter.jsx"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Sign-up" element={<LoginHeader />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Sign-up" element={<Register />} />
        <Route path="/" element={<Homepage/>} />
        <Route path="/" element={<ProductGrid/>} />
        <Route path="/" element={<FilterSideBar/>} />
        <Route path="/" element={<SortControls/>} />
        <Route path="/account-details" element={<Account_detail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;