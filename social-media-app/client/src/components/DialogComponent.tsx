'use client'
import React from "react";

interface Props {
  btnName: string,
  heading: string,
  followerId: string,
  followingId: string
}

export default function Modal(props: Props) {
  const [showModal, setShowModal] = React.useState(false);
  
    const handleClick = async ()=>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/follower-following/remove`,{
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          followerId: props.followerId,
          followingId: props.followingId
        })
      });
      
      if(response.ok){
        window.location.reload();
      }
    }
  
  return (
    <>
      <button
        className="w-full h-[30px] border rounded-[20px] hover:bg-red-600 text-white font-bold uppercase text-sm rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        { props.btnName }
      </button>

      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-[330px]">
              {/*content*/}
              <div className="w-full flex justify-center bg-slate-800 border-0 rounded-[20px] shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                <div className="items-center justify-center pt-[10px]">
                  <h3 className="text-xl text-white font-semibold">
                    Unfollow @{props.heading}?
                  </h3>
                  <button
                    className="hover:bg-blue-700 p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                  </button>
                </div>
                {/*body*/}
                <div className="relative flex-auto">
                  <p className="my-4 px-[16px] text-gray-500 text-[16px]">
                  Their Tweets will no longer show up in your home timeline. You can still view their profile, unless their Tweets are protected. 
                  </p>
                </div>
                {/*footer*/}
                <div className="flex flex-col items-center justify-end p-4">
                  <button
                    className="w-full h-[40px] mb-[5px] border rounded-[20px] text-black bg-white font-bold ease-linear transition-all duration-150"
                    type="button"
                    onClick={() =>{ handleClick(); setShowModal(false) }}
                  >
                    Unfollow
                  </button>
                  <button
                    className="w-full text-white bg-black h-[40px] mt-[8px] border-0 rounded-[20px] font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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