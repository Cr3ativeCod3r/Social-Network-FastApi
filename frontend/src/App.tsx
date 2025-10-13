import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/User/Profile";
import Chat from "./pages/Chat";
import Posts from "./pages/Notes/page";
import UsersList from "./pages/Admin/AdminUsers";
import NoteDetail from "./pages/Notes/crud/ReadNote";
import Layout from "./layout/layout";
import NotesList from "./pages/Notes/crud/ReadNotes";

import AdminLayout from "./pages/Admin/layout/AdminLayout";
import AdminStats from "./pages/Admin/AdminStats";

import UserLayout from "./pages/User/Layout/UserLayout";
import UserNotes from "./pages/User/components/UserNotes";

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
          path="/user/me"
          element={
            <Layout>
              <UserLayout>
                <Profile />
              </UserLayout>
            </Layout>
          }
        />
         <Route
          path="/user/notes/:id"
          element={
            <Layout>
              <UserLayout>
                <UserNotes />
              </UserLayout>
            </Layout>
          }
        />
         {/* <Route
          path="/user/savednotes"
          element={
            <Layout>
              <UserLayout>
                <Profile />
              </UserLayout>
            </Layout>
          }
        /> */}

        <Route
          path="/chat"
          element={
            <Layout>
              <Chat />
            </Layout>
          }
        />

        <Route
          path="/Admin/users"
          element={
            <Layout>
              <AdminLayout>
                <UsersList />
              </AdminLayout>
            </Layout>
          }
        />

        <Route
          path="/Admin/Notes"
          element={
            <Layout>
              <AdminLayout>
                <NotesList />
              </AdminLayout>
            </Layout>
          }
        />

        <Route
          path="/Admin/stats"
          element={
            <Layout>
              <AdminLayout>
                <AdminStats />
              </AdminLayout>
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