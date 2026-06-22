/**
 * Loader Component
 *
 * Props:
 * @param {string} size
 */

function Loader({ size = "medium" }) {
  const sizes = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div
      className={`${sizes[size]} border-4 border-purple-600 border-t-transparent rounded-full animate-spin`}
    />
  );
}

export default Loader;