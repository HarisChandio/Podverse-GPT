import React from 'react';
import { CiBank } from 'react-icons/ci';

const LogoCard: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="py-5 flex items-center">
        <h1 className="text-5xl font-extrabold ml-4">
          Pod<span className="text-purple-500">Verse</span>
        </h1>
      </div>
      <div className="text-xl max-w-screen-sm py-5">
        <h3 className="font-mono">
          Introducing PodVerse: Where podcasts come alive with conversation! Tired of passive listening? Dive into interactive discussions, ask questions, and truly engage with the content. Don't just listen, converse, and enrich your podcast experience!
        </h3>
      </div>
    </div>
  );
};

export default LogoCard;
