import React from "react";
import clsx from "clsx"; 

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  bgcolor?: string; 
  textcolor?: string; 
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  icon,
  children,
  bgcolor = "bg-gray-100",
  textcolor = "text-basic1",
  ...props
}) => {
  return (
    <label
      className={clsx(
        "input flex items-center gap-2 rounded-lg px-3 py-2 w-full",
        bgcolor
      )}
    >
      {label && (
        <span className="text-sm font-medium">{label}</span>
      )}
      {icon && (
        <span className={clsx("h-[1em] opacity-70 flex items-center", textcolor)}>
          {icon}
        </span>
      )}
      <input
        className={clsx(
          "grow outline-none bg-transparent",
          textcolor,            
          `placeholder:${textcolor}` 
        )}
        placeholder={placeholder}
        {...props}
      />
      {children && <span className="flex items-center gap-1">{children}</span>}
    </label>
  );
};

export default Input;