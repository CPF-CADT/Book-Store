import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Account_detail } from "./pages/account_detail";
import { HomePageLayout } from "./HomePageLayout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePageLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account-details" element={<Account_detail />} />
        <Route index element={<HomePageLayout />} />
        {/* <Route path="about" element={<AboutPage />} />
        <Route path="books" element={<BookPage />} /> */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;