import { useEffect, useRef, useState } from "react";

const Checkbox = ({
  id,
  disabled,
  label,
  name,
  activeClass = "ring-black-500  bg-slate-900 dark:bg-slate-700 dark:ring-slate-700 ",
  checked = false,
  register,
  onChange,
}) => {
  return (
    <label
      className={`flex items-center ${
        disabled ? " cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      htmlFor={id}
    >
      <input
        type="checkbox"
        name={name}
        className="hidden"
        id={id}
        disabled={disabled}
        {...register}
        onChange={(e) => {
          if (onChange) onChange(e);
          if (register) register.onChange(e);
        }}
        checked={checked}
      />
      <span
        className={`h-4 w-4 border flex-none border-slate-100 dark:border-slate-800 rounded 
        inline-flex ltr:mr-3 rtl:ml-3 relative transition-all duration-150
        ${
          checked
            ? activeClass + " ring-2 ring-offset-2 dark:ring-offset-slate-800 "
            : "bg-slate-100 dark:bg-slate-600 dark:border-slate-600"
        }
        `}
      >
        {checked && (
          <img
            src="/assets/images/icon/ck-white.svg"
            alt=""
            className="h-[10px] w-[10px] block m-auto"
          />
        )}
      </span>
      <span className="text-slate-500 dark:text-slate-400 text-sm leading-6 capitalize">
        {label}
      </span>
    </label>
  );
};

export default Checkbox;
