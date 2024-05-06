import "./App.css";
import Layout from "./components/Layout/Layout";
import Error404 from "./pages/404/404";
import Overview from "./pages/Overview/Overview";

import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Layout>
      <Routes>
        <Route exact path="/" element={<Overview />} />
        <Route exact path="/404" element={<Error404 />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </Layout>
  );
}

export default App;
