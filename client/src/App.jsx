import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Viewer from "./pages/Viewer";
import Audit from "./pages/Audit";
import Signature from "./pages/Signature";
import SignatureViewer from "./pages/SignatureViewer";
import SignDocument from "./pages/SignDocument";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/upload"
          element={<Upload />}
        />

        <Route
          path="/viewer"
          element={<Viewer />}
        />

        <Route
          path="/audit"
          element={<Audit />}
        />

        <Route
          path="/signature"
          element={<Signature />}
        />

        <Route
          path="/signature-viewer"
          element={<SignatureViewer />}
        />

        <Route
          path="/sign-document"
          element={<SignDocument />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;