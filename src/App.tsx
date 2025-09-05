import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RevisionsTool from "./pages/RevisionsTool";
import CoMaintainer from "./pages/CoMaintainer";
import Validate from "./pages/Validate";

function App() {
  // We intentionally don't set any default props here and handle undefined in the page components.
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RevisionsTool />} />
        <Route path="/co-maintainer" element={<CoMaintainer />} />
        <Route path="/validate" element={<Validate />} /> 
      </Routes>
    </Router>
  );
}

export default App;
