function Card({
  title,
  description,
  image,
  action,
}) {
  return (
    <div
      className="
      group
      bg-white
      dark:bg-slate-800
      rounded-3xl
      overflow-hidden
      shadow-lg
      hover:shadow-2xl
      hover:-translate-y-3
      hover:scale-105
      transition-all
      duration-300
      border
      border-gray-100
      dark:border-slate-700
      "
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="
          h-52
          w-full
          object-cover
          group-hover:scale-110
          transition-transform
          duration-500
          "
        />
      </div>

      <div className="p-6">

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {title}
          </h2>

          <span className="text-blue-600 text-xl">
            →
          </span>
        </div>

        <p className="text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
          {description}
        </p>

        {action && (
          <button
            className="
            w-full
            bg-gradient-to-r
            from-blue-600
            to-purple-600
            text-white
            py-3
            rounded-xl
            font-semibold
            hover:opacity-90
            transition
            "
          >
            {action}
          </button>
        )}

      </div>
    </div>
  );
}

export default Card;