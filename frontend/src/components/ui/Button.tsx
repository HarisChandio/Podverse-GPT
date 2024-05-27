import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;  // You can specify a more specific type if needed
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full text-white bg-purple-500 hover:bg-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
    >
      {label}
    </button>
  );
};

export default Button;
