import "./App.css";
import UserManagementSketch from "./screens2";
import StudyShareSketch from "./screens1";
import StudyShareFeaturesSketch from "./screens3";
import AdminDashboardSketch from "./screen4";
import SocialBanners from "./test";


function App() {
  return (
    <>
      <SocialBanners />
      <AdminDashboardSketch />
      <StudyShareSketch />
      <UserManagementSketch />
      <StudyShareFeaturesSketch/>
    </>
  );
}

export default App;
