import React, { useState } from "react";

type Props = {
  onCancel: Function;
  onSubmit: Function;
};

function SchedulePostModal(props: Props) {
  const { onCancel, onSubmit } = props;
  const [time, setTime] = useState("");
  const [postContent, setPostContent] = useState("");

  return (
    <section>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-[420px]">
          {/*content*/}
          <div className="px-8 w-full flex justify-center bg-slate-900 border-0 rounded-[20px] shadow-lg relative flex-col outline-none focus:outline-none">
            <div className="w-full flex flex-row items-center justify-between pt-[10px]">
              <h3 className="text-xl font-semibold text-white">
                Schedule a Post
              </h3>
              <button
                className="hover:bg-blue-700 p-1 border-0 float-right text-3xl text-gray-700 leading-none font-semibold outline-none focus:outline-none"
                onClick={() => onCancel()}
              >
                x
              </button>
            </div>

            <section className="w-full mt-8 mb-2">
              <label className="text-white mb-1">Time</label>
              <input
                type="text"
                onChange={(event) => setTime(event.target.value)}
                placeholder="Format: Mon Jan 01 2024 21:08:20"
                className="w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[40px] pl-[10px] bg-gray-300 border-1 rounded-lg border-gray-600 outline-none"
              />
            </section>

            <section className="w-full mb-8">
              <label className="text-white mb-1">Content</label>
              <input
                type="text"
                onChange={(event) => setPostContent(event.target.value)}
                placeholder="Post Content"
                className="w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[40px] pl-[10px] bg-gray-300 border-1 rounded-lg border-gray-600 outline-none"
              />
            </section>

            {/*footer*/}
            <div className="flex flex-col items-center justify-end my-4">
              <button
                className="w-full h-[40px] mb-[5px] border rounded-[20px] text-black bg-white font-bold ease-linear transition-all duration-150"
                onClick={() =>
                  onSubmit("scheduled", { time: time, content: postContent })
                }
              >
                Schedule post
              </button>
              <button
                className="w-full h-[40px] mt-[8px] border rounded-[20px] text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => onCancel()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </section>
  );
}

export default SchedulePostModal;
