import { Routes, Route } from "react-router";

import TopNavBar from "./components/navbar";
import StatsPage from "./components/stats/index";
import Model from "./Model"
import { Sidebar } from "./components/sidebar";

function App() {
  return (
    <>
      {/* <TopNavBar /> */}
      {/* <Sidebar /> */}

      {/* <div className="pt-16"> */}
        <Routes>
          {/* <Route path="/stats" element={<StatsPage />} /> */}
          <Route path="/" element={<Model />} />
        </Routes>
      {/* </div> */}
    </>
  );
}

export default App;
