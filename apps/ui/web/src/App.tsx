import { Routes, Route } from "react-router-dom";
import TopNavBar from "./components/navbar";
import StatsPage from "./components/stats";

function App() {
  return (
    <>
      <TopNavBar />
      
      <div className="pt-16"> 
        <Routes>
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
