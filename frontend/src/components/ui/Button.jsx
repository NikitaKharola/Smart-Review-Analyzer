/**
 * Button Component
 *
 * Props:
 * @param {string} text
 * @param {Function} onClick
 * @param {string} className
 */

function Button({ text, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;