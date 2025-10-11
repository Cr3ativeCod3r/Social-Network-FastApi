import React from "react";

interface PortalCardProps {
  titleColor?: string; 
}

const PortalCard: React.FC<PortalCardProps> = ({ titleColor = "text-basic1" }) => {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
      <h2 className="text-6xl font-bold mb-4 flex items-center gap-6">
        <span className={titleColor}>StudyShare</span>
      </h2>
      <p className="text-black text-xl">
        StudyShare to portal dla studentów, 
        <p>umożliwiający wymianę notatek i materiałów edukacyjnych.</p>
      </p>
    </div>
  );
};

export default PortalCard;