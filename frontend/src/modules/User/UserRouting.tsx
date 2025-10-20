import { Routes, Route } from "react-router-dom";
import Layout from "../../layout/layout";
import UserLayout from "./Layout/UserLayout";
import Profile from "../../screens/User/Profile";
import UserNotes from "../../screens/User/UserNotes";
import SavedNotes from "../../screens/User/SavedNotes";
import UserProfile from "../../screens/User/UserProfile";

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