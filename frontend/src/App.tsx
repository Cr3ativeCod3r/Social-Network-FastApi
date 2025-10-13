import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Chat from "./pages/Chat/Chat";
import Posts from "./pages/Notes/page";
import NoteDetail from "./pages/Notes/crud/ReadNote";
import Layout from "./layout/layout";
import Admin from "./pages/Admin/AdminRouting"; 
import User from "./pages/User/UserRouting";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/user/*" element={<User />} />
        <Route path="/Admin/*" element={<Admin />} />

        <Route
          path="/chat"
          element={
            <Layout>
              <Chat />
            </Layout>
          }
        />

        <Route
          path="/notatki"
          element={
            <Layout>
              <Posts />
            </Layout>
          }
        />

        <Route
          path="/notatki/:id"
          element={
            <Layout>
              <NoteDetail />
            </Layout>
          }
        />

        <Route
          path="*"
          element={
            <div className="p-8 text-center text-gray-500">
              404 – Page not found
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;