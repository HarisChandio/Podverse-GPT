import React from 'react';
interface HeadingProps {
  label: string;
}
const Heading: React.FC<HeadingProps> = ({ label }) => {
  return <div className="font-bold text-4xl font-sans pt-6 pb-1">
    {label}
  </div>;
};
export default Heading;