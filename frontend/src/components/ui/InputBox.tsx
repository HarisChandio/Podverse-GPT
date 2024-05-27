import React, { ChangeEvent } from 'react';

interface InputBoxProps {
  label: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const InputBox: React.FC<InputBoxProps> = ({ label, placeholder, onChange, type = "text" }) => {
  return (
    <div>
      <div className="text-sm font-medium text-left py-2">
        {label}
      </div>
      <input
        placeholder={placeholder}
        onChange={onChange}
        type={type}
        className="w-full px-2 py-1 rounded-md focus:outline-none border border-black"
      />
    </div>
  );
}

export default InputBox;
