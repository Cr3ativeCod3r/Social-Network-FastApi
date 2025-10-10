import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";


import Profile from "./pages/Profile/Profile";
import Chat from "./pages/Chat";
import Posts from "./pages/Posty";
import UsersList from "./pages/Admin/Admin";
;

import Layout from "./layout/layout";

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected or layout routes */}
          <Route path="/profile" element={
            <Layout>
              <Profile />
            </Layout>
          } />

          <Route path="/chat" element={
            <Layout>
              <Chat />
            </Layout>
          } />

          <Route path="/Admin" element={
            <Layout>
              <UsersList />
            </Layout>
          } />

          <Route path="/posty" element={
            <Layout>
              <Posts />
            </Layout>
          } />

          {/* 404 */}
          <Route path="*" element={<div className="p-8 text-center text-gray-500">404 – Page not found</div>} />
        </Routes>
      </Router>
  );
};

export default App;