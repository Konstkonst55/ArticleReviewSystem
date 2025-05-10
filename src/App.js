import React from "react";
import { Routes, Route } from "react-router-dom";

import "./scss/app.scss";
import Authorization from "./pages/Authorization";
import Registration from "./pages/Registration";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Authorization />} />
      <Route path="/registration" element={<Registration />} />
    </Routes>
  );
}

export default App;
