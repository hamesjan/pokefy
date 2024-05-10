import "./App.css";
import Layout from "./components/Layout/Layout";
import Error404 from "./pages/404/404";
import Overview from "./pages/Overview/Overview";
import { app } from "./firebaseconfig"; // Adjust the path as needed
import { Navigate, Route, Routes } from "react-router-dom";
import CallbackPage from "./pages/CallbackPage/CallbackPage";
import About from "./pages/About/About";

function App() {
  return (
    <div className="background">
      <Layout>
        <Routes>
          <Route exact path="/" element={<Overview />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route exact path="/404" element={<Error404 />} />
          <Route exact path="/about" element={<About />} />

          {/* <Route path="*" element={<Navigate replace to="/404" />} /> */}
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
