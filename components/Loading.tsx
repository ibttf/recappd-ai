import React from "react";

function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
      <style>
        {`
          .loader {
            border-top-color: #059669;  // This is the green-600 color in TailwindCSS
            animation: loading 1.5s infinite linear;
          }

          @keyframes loading {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Loading;
