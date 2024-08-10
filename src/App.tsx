
import Main from "./pages/Main/Main"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeatherDetail from "./pages/WeatherDetail";
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Main/>
          }
        />
        <Route path="/weather/:id" element={<WeatherDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
