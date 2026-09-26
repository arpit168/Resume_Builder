import React from "react";

export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      {/* Logo Area */}
      <div className="flex flex-col items-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative mb-6">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Document Border */}
            <path
              d="M48 95H34C28.4772 95 24 90.5228 24 85V35C24 29.4772 28.4772 25 34 25H74C79.5228 25 84 29.4772 84 35V45"
              stroke="#0B1F40"
              strokeWidth="7"
              strokeLinecap="round"
              className="dark:stroke-gray-100"
            />
            <path
              d="M60 95H68"
              stroke="#0B1F40"
              strokeWidth="7"
              strokeLinecap="round"
              className="dark:stroke-gray-100"
            />

            {/* Top Right Lines */}
            <path
              d="M58 35H72"
              stroke="#0B1F40"
              strokeWidth="6"
              strokeLinecap="round"
              className="dark:stroke-gray-100"
            />
            <path
              d="M58 45H72"
              stroke="#0B1F40"
              strokeWidth="6"
              strokeLinecap="round"
              className="dark:stroke-gray-100"
            />

            {/* Profile */}
            <circle cx="42" cy="38" r="7" fill="#186DF5" />
            <path
              d="M32 54C32 49 36 45 42 45C48 45 52 49 52 54"
              fill="#186DF5"
            />

            {/* List Items */}
            <circle cx="32" cy="65" r="3.5" fill="#186DF5" />
            <path
              d="M42 65H72"
              stroke="#0B1F40"
              strokeWidth="6"
              strokeLinecap="round"
              className="dark:stroke-gray-100"
            />

            <circle cx="32" cy="76" r="3.5" fill="#186DF5" />
            <path
              d="M42 76H72"
              stroke="#0B1F40"
              strokeWidth="6"
              strokeLinecap="round"
              className="dark:stroke-gray-100"
            />

            <circle cx="32" cy="87" r="3.5" fill="#186DF5" />
            <path
              d="M42 87H56"
              stroke="#0B1F40"
              strokeWidth="6"
              strokeLinecap="round"
              className="dark:stroke-gray-100"
            />

            {/* Pencil */}
            <g transform="translate(5, 5)">
              {/* Tip */}
              <path d="M52 95L62 90L56 80L52 95Z" fill="#186DF5" />
              {/* Body Base */}
              <path
                d="M58 78L64 88L88 52L82 42L58 78Z"
                fill="#0B1F40"
                className="dark:fill-gray-300"
              />
              {/* Body highlight line */}
              <path
                d="M63 82L67 88L88 56L84 50L63 82Z"
                fill="white"
                className="dark:fill-gray-900"
                opacity="0.3"
              />
              {/* Eraser */}
              <path
                d="M84 39L90 49L95 46C97 43 96 39 93 36L91 34C88 32 85 33 84 39Z"
                fill="#186DF5"
              />
            </g>
          </svg>
        </div>

        <h1 className="text-[3.5rem] leading-none font-black tracking-tight mb-3 flex items-center">
          <span className="text-[#0B1F40] dark:text-gray-100">Hire-</span>
          <span className="text-[#186DF5]">Craft</span>
        </h1>

        <p className="text-[#0B1F40]/80 dark:text-gray-300 text-xl tracking-[0.25em] uppercase font-medium">
          Resume Builder
        </p>
      </div>

      {/* Spinner Area */}
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700 delay-300">
        <div className="relative w-16 h-16 animate-spin">
          {[1, 0.1, 0.2, 0.3, 0.45, 0.6, 0.75, 0.9].map((opacity, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-[#186DF5] rounded-full"
              style={{
                top: `${50 - 38 * Math.cos((i * Math.PI) / 4)}%`,
                left: `${50 + 38 * Math.sin((i * Math.PI) / 4)}%`,
                transform: "translate(-50%, -50%)",
                opacity: opacity,
              }}
            />
          ))}
        </div>
        <span className="text-[#0B1F40] dark:text-gray-200 font-semibold text-xl tracking-wider">
          Loading...
        </span>
      </div>
    </div>
  );
}
