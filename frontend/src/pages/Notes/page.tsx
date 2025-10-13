import React from "react";

import CreateNote from "./crud/CreateNote";
import NotesList from "./crud/ReadNotes";

const Posts: React.FC = () => {
  return (
    <div className="flex flex-row min-h-screen">

      {/* <SubjectsDropdown /> */}
      <div className="flex flex-col mx-auto max-w-4xl">
        <CreateNote />
        <div className=" text-black flex flex-col items-center justify-center mx-auto mt-2 animate-fade-in">
          <NotesList />
        </div>
      </div>
    </div>
  );
};

export default Posts;