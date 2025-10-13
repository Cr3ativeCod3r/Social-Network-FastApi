import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Chat from "./pages/Chat/Chat";
import Posts from "./pages/Notes/page";
import NoteDetail from "./pages/Notes/crud/ReadNote";
import Layout from "./layout/layout";
import Admin from "./pages/Admin/AdminRouting"; 
import User from "./pages/User/UserRouting";
import { useAuthStore } from "./store/authStore";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
};

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const RedirectIfAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  if (user) {
    return <Navigate to="/notatki" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuth>
              <Register />
            </RedirectIfAuth>
          }
        />

        <Route
          path="/user/*"
          element={
            <RequireAuth>
              <User />
            </RequireAuth>
          }
        />
        <Route
          path="/Admin/*"
          element={
            <RequireAuth>
              <Admin />
            </RequireAuth>
          }
        />

        <Route
          path="/chat"
          element={
            <RequireAuth>
              <Layout>
                <Chat />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/notatki"
          element={
            <RequireAuth>
              <Layout>
                <Posts />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/notatki/:id"
          element={
            <RequireAuth>
              <Layout>
                <NoteDetail />
              </Layout>
            </RequireAuth>
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