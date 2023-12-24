import React from "react";

type Props = {
    loaderLength: number;
};

function PostLoader({loaderLength}: Props) {
  return Array(loaderLength).fill(0).map((val, index) => (
    <div
      key={index}
      className="p-4 space-y-4 divide-y divide-gray-200 animate-pulse"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
    </div>
  ));
}

export default PostLoader;
