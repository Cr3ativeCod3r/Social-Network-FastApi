import React from "react";

import CreateNote from "./crud/CreateNote";
import ReadNotes from "./crud/ReadNotes";


const Posts: React.FC = () => {
  return (
    <div className="bg-white min-h-screen text-black flex flex-col items-center justify-center">
      <CreateNote/>
      <ReadNotes/>

    </div>
  );
};

export default Posts;