'use client'
import React, { useState } from "react";

interface Props {
  postId: string,
}

function DeleteModal(props: Props) {
  const [showModal, setShowModal] = React.useState(false);
  
    const handleClick = async ()=>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/posts/${props.postId}`,{
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type':'application/json'
        },
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
        <svg className="w-[20px] h-[20px] fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="delete"><path d="M24.2,12.193,23.8,24.3a3.988,3.988,0,0,1-4,3.857H12.2a3.988,3.988,0,0,1-4-3.853L7.8,12.193a1,1,0,0,1,2-.066l.4,12.11a2,2,0,0,0,2,1.923h7.6a2,2,0,0,0,2-1.927l.4-12.106a1,1,0,0,1,2,.066Zm1.323-4.029a1,1,0,0,1-1,1H7.478a1,1,0,0,1,0-2h3.1a1.276,1.276,0,0,0,1.273-1.148,2.991,2.991,0,0,1,2.984-2.694h2.33a2.991,2.991,0,0,1,2.984,2.694,1.276,1.276,0,0,0,1.273,1.148h3.1A1,1,0,0,1,25.522,8.164Zm-11.936-1h4.828a3.3,3.3,0,0,1-.255-.944,1,1,0,0,0-.994-.9h-2.33a1,1,0,0,0-.994.9A3.3,3.3,0,0,1,13.586,7.164Zm1.007,15.151V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Zm4.814,0V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Z"></path></svg>
      </button>

      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative my-6 mx-auto w-[360px]">
              {/*content*/}
              <div className="w-full flex justify-center bg-slate-900 border-0 rounded-[20px] shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                <div className="items-center justify-center pt-[10px]">
                  <h3 className="text-xl font-semibold text-white">
                    Delete
                  </h3>
                  <button
                    className="hover:bg-blue-700 p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                  </button>
                </div>

                <section className='w-full h-[40px] flex flex-row justify-center text-[18px] text-red-600 font-semibold px-[32px]'>
                    Are you sure you want to delete?
                </section>

                <section className="w-full h-[70px] text-[16px] text-white px-[32px] font-normal">
                  Once you delete we will not be able to undo it. Delete only if you are sure about it.
                </section>
                {/*footer*/}
                <div className="flex flex-col items-center justify-end p-4">
                  <button
                    className="w-full h-[40px] mb-[5px] border rounded-[20px] text-black bg-white font-bold ease-linear transition-all duration-150"
                    type="button"
                    onClick={() =>{ handleClick(); setShowModal(false) }}
                  >
                    Delete
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

export default DeleteModal;