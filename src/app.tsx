import { Editor } from "./pages/editor";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/landing";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/editor/:filename" element={<Editor />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
}
