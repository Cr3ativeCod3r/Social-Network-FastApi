import React from "react";

import CreateNote from "./crud/CreateNote";
import ReadNotes from "./crud/ReadNotes";


const Posts: React.FC = () => {
  return (
    <>
      <CreateNote />
      <div className="bg-white min-h-screen text-black flex flex-col items-center justify-center max-w-4xl mx-auto mt-2 animate-fade-in">

        <ReadNotes />

      </div>
    </>
  );
};

export default Posts;