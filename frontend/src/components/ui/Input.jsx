/**
 * Input Component
 *
 * Props:
 * @param {string} placeholder
 * @param {string} value
 * @param {Function} onChange
 * @param {string} type
 */

function Input({ placeholder, value, onChange, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
      w-full
      p-3
      border
      rounded-lg
      bg-white
      text-black
      placeholder-gray-500
      dark:bg-slate-800
      dark:text-white
      dark:border-slate-600
      dark:placeholder-slate-400
      focus:outline-none
      focus:ring-2
      focus:ring-purple-500
      "
    />
  );
}

export default Input;