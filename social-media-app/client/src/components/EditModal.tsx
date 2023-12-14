'use client'
import React, { useState } from "react";
import userIcon from '@/../public/user-icon.png'

interface Props {
  postId: string,
  heading: string,
}

function EditModal(props: Props) {
  const [showModal, setShowModal] = React.useState(false);

  const [postContent, setPostContent] = useState<string>('');
  
    const handleClick = async ()=>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/posts/${props.postId}`,{
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
            content: postContent
        })
      });

      if(response.status === 200){
        window.location.reload();
      }
    }
  
  return (
    <>
      <button
        className="w-full h-[30px] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        <svg className="w-4 h-4 fill-white" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
      </button>

      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative my-6 mx-auto w-[420px]">
              {/*content*/}
              <div className="w-full flex justify-center bg-slate-900 border-0 rounded-[20px] shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                <div className="items-center justify-center pt-[10px]">
                  <h3 className="text-xl font-semibold text-white">
                    Edit
                  </h3>
                  <button
                    className="hover:bg-blue-700 p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                  </button>
                </div>
                {/*body*/}
                <section className='w-full h-[80px] flex flex-row'>
                    <figure className='w-[70px] h-full pl-[16px] flex items-center'>
                        <img className='w-[35px] h-[35px]' src={userIcon.src} alt="" />
                    </figure>
                    <section className='w-full h-full mr-[16px]'>
                        <textarea placeholder={props.heading} value={postContent} onChange={(event)=>{setPostContent(event.target.value)}} 
                        className='pl-[4px] w-full h-full bg-black border-0 outline-none no-resize appearance-none block w-full text-gray-400 border rounded pl-[4px] pt-[2px] resize-none'>
                        </textarea>
                    </section>
                </section>
                {/*footer*/}
                <div className="flex flex-col items-center justify-end p-4">
                  <button
                    className="w-full h-[40px] mb-[5px] border rounded-[20px] text-black bg-white font-bold ease-linear transition-all duration-150"
                    type="button"
                    onClick={() =>{ handleClick(); setShowModal(false) }}
                  >
                    Update
                  </button>
                  <button
                    className="w-full h-[40px] mt-[8px] border rounded-[20px] text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default EditModal;