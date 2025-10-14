import { Routes, Route } from "react-router-dom";
import Layout from "../../layout/layout";
import AdminLayout from "./layout/AdminLayout";
import UsersList from "../../views/AdminUsers";
import NotesList from "../Notes/ReadNotes";
import AdminStats from "../../views/AdminStats";

const Admin = () => {
  return (
    <Routes>
      <Route
        path="/users"
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
        path="/stats"
        element={
          <Layout>
            <AdminLayout>
              <AdminStats />
            </AdminLayout>
          </Layout>
        }
      />
    </Routes>
  );
};

export default Admin;