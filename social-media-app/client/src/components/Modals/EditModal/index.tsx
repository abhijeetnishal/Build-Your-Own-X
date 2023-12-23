import userIcon from "@/../public/user-icon.png";
import { useState } from "react";

interface Props {
  post: {
    postContent: string;
    _id: string;
  };
  onCancel: Function;
  onUpdate: Function;
}

function EditModal(props: Props) {
  const { post, onCancel, onUpdate } = props;

  const [postContent, setPostContent] = useState(post.postContent);

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-[420px]">
          {/*content*/}
          <div className="w-full flex justify-center bg-slate-900 border-0 rounded-[20px] shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
            <div className="items-center justify-center pt-[10px]">
              <h3 className="text-xl font-semibold text-white">Edit</h3>
              <button
                className="hover:bg-blue-700 p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => onCancel()}
              ></button>
            </div>
            {/*body*/}
            <section className="w-full h-[80px] flex flex-row">
              <figure className="w-[70px] h-full pl-[16px] flex items-center">
                <img className="w-[35px] h-[35px]" src={userIcon.src} alt="" />
              </figure>
              <section className="w-full h-full mr-[16px]">
                <textarea
                  placeholder=""
                  value={postContent}
                  onChange={(event) => {
                    setPostContent(event.target.value);
                  }}
                  className="pl-[4px] w-full h-full bg-black border-0 outline-none no-resize appearance-none block w-full text-gray-400 border rounded pl-[4px] pt-[2px] resize-none"
                ></textarea>
              </section>
            </section>
            {/*footer*/}
            <div className="flex flex-col items-center justify-end p-4">
              <button
                className="w-full h-[40px] mb-[5px] border rounded-[20px] text-black bg-white font-bold ease-linear transition-all duration-150"
                onClick={() => onUpdate(post._id, postContent)}
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
    </>
  );
}

export default EditModal;
