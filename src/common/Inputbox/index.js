import React from "react";

const InputBox = ({
  placeholder,
  className,
  type,
  name,
  onChange,
  onBlur,
  value,
}) => {
  return (
    <input
      placeholder={placeholder}
      className={`${className}`}
      type={type}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
    />
  );
};

export default InputBox;
