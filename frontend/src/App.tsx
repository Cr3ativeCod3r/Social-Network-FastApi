import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile/Profile";
import Chat from "./pages/Chat";
import Posts from "./pages/Notes/Posty";
import UsersList from "./pages/Admin/Admin";
import NoteDetail from "./pages/Notes/crud/ReadNote";
import Layout from "./layout/layout";
import AdminLayout from "./pages/Admin/layout/AdminLayout";
import NotesList from "./pages/Notes/crud/ReadNotes";

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

        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route
          path="/chat"
          element={
            <Layout>
              <Chat />
            </Layout>
          }
        />

        <Route
          path="/Admin"
          element={
            <Layout>
              <AdminLayout>
                <UsersList />
              </AdminLayout>
            </Layout>
          }
        />

           <Route
          path="/Notes"
          element={
            <Layout>
              <AdminLayout>
                <NotesList />
              </AdminLayout>
            </Layout>
          }
        />

        <Route
          path="/posty"
          element={
            <Layout>
              <Posts />
            </Layout>
          }
        />

        <Route
          path="/note/:id"
          element={
            <Layout>
              <NoteDetail />
            </Layout>
          }
        />

        {/* 404 */}
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