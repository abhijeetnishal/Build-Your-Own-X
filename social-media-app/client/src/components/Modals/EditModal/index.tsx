import userIcon from "@/../public/user-icon.png";
import { PostDetails } from "@/types/post";
import Image from "next/image";
import { useState } from "react";

interface Props {
  post: PostDetails;
  onCancel: Function;
  onUpdate: Function;
}

function EditModal(props: Props) {
  const { post, onCancel, onUpdate } = props;

  const [postContent, setPostContent] = useState(post.content);

  return (
    <section>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-[420px]">
          {/*content*/}
          <div className="w-full flex justify-center bg-slate-900 border-0 rounded-[20px] shadow-lg relative flex-col outline-none focus:outline-none">
            <div className="w-full flex flex-row items-center justify-between pt-[10px] px-8">
              <h3 className="text-xl font-semibold text-white">Edit</h3>
              <button
                className="hover:bg-blue-700 p-1 border-0 float-right text-3xl text-gray-700 leading-none font-semibold outline-none focus:outline-none"
                onClick={() => onCancel()}
              >
                x
              </button>
            </div>
            {/*body*/}
            <section className="w-full h-[80px] flex flex-row">
              <section className="w-full h-full mx-4">
                <textarea
                  placeholder=""
                  value={postContent}
                  onChange={(event) => {
                    setPostContent(event.target.value);
                  }}
                  className="w-full h-full bg-black border-1 outline-none resize-none text-gray-400 rounded p-2"
                ></textarea>
              </section>
            </section>
            {/*footer*/}
            <div className="flex flex-col items-center justify-end p-4">
              <button
                className="w-full h-[40px] mb-[5px] border rounded-[20px] text-black bg-white font-bold ease-linear transition-all duration-150"
                onClick={() => onUpdate(post, postContent)}
              >
                Update
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

export default EditModal;
