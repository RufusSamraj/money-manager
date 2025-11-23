import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar";

function App() {
  return (
    <div className="pb-16">
      <Routes>
        <Route path="/date" element={<div>Date Page</div>} />
        <Route path="/stats" element={<div>Stats Page</div>} />
        <Route path="/accounts" element={<div>Accounts Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
        <Route path="/profile" element={<div>Profile Page</div>} />
      </Routes>

      <Navbar />
    </div>
  );
}

export default App;
