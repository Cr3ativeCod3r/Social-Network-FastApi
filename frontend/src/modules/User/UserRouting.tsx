import { Routes, Route } from "react-router-dom";
import Layout from "../../layout/layout";
import UserLayout from "./Layout/UserLayout";
import Profile from "../../views/Profile";
import UserNotes from "../../views/UserNotes";
import SavedNotes from "../../views/SavedNotes";
import UserProfile from "../../views/UserProfile";

const User = () => {
  return (
    <Routes>
      <Route
        path="/me"
        element={
          <Layout>
            <UserLayout>
              <Profile />
            </UserLayout>
          </Layout>
        }
      />
      <Route
        path="/notes/:id"
        element={
          <Layout>
            <UserLayout>
              <UserNotes />
            </UserLayout>
          </Layout>
        }
      />
      <Route
        path="/savednotes"
        element={
          <Layout>
            <UserLayout>
              <SavedNotes />
            </UserLayout>
          </Layout>
        }
      />
      
      <Route
        path="/:id"
        element={
          <Layout>
            <UserProfile />
          </Layout>
        }
      />

    </Routes>
  );
};

export default User;