import { Routes, Route } from "react-router-dom";
import Layout from "../../layout/layout";
import AdminLayout from "./layout/AdminLayout";
import UsersList from "../../screens/Admin/AdminUsers";
import NotesList from "../Notes/ReadNotes";
import AdminStats from "../../screens/Admin/AdminStats";
import SubjectsCrud from "../../screens/Admin/SubjectsCrud";
import ReportsList from "../../screens/Admin/Reports";

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
      <Route
        path="/subjects"
        element={
          <Layout>
            <AdminLayout>
              <SubjectsCrud />
            </AdminLayout>
          </Layout>
        }
      />
      <Route
        path="/reports"
        element={
          <Layout>
            <AdminLayout>
              <ReportsList />
            </AdminLayout>
          </Layout>
        }
      />
    </Routes>
  );
};

export default Admin;