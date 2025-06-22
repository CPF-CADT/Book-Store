import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/pages/account/login.jsx";
import { Register } from "./components/pages/account/register.jsx";
import { Homepage } from "./components/Homepage.jsx";
import { Account_detail } from "./components/pages/account/account_detail.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Sign-up" element={<Register />} />
        <Route path="/" element={<Homepage/>} />
        <Route path="/account-details" element={<Account_detail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;