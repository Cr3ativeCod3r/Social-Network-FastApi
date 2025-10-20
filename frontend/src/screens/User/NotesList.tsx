import React from "react";

import CreateNote from "../../modules/Notes/CreateNote";
import NotesList from "../../modules/Notes/ReadNotes";

const Posts: React.FC = () => {
  return (
    <div className="flex flex-row min-h-screen">
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