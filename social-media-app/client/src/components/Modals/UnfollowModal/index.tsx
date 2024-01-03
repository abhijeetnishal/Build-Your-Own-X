interface Props {
  heading: string;
  followerId: string;
  onClose: () => void;
  onSubmit: Function;
}

export default function UnfollowModal(props: Props) {
  const { heading, followerId, onClose, onSubmit } = props;

  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative w-auto my-6 mx-auto max-w-[330px]">
        {/*content*/}
        <div className="p-4 w-full flex flex-col justify-center bg-slate-800 border-0 rounded-[20px] shadow-lg relative outline-none focus:outline-none">
          <div className="w-full flex items-center justify-center pt-[10px] text-xl text-white font-semibold">
            Unfollow @{heading}?
            <button
              className="hover:bg-blue-700 p-1 ml-auto bg-transparent border-0 text-zinc-100 opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              X
            </button>
          </div>
          {/*body*/}
          <div className="relative flex-auto">
            <p className="my-4 text-gray-500 text-[16px]">
              Their Tweets will no longer show up in your home timeline. You can
              still view their profile, unless their Tweets are protected.
            </p>
          </div>
          {/*footer*/}
          <div className="flex flex-col items-center justify-end">
            <button
              className="w-full h-[40px] mb-[5px] border rounded-[20px] text-black bg-white font-bold ease-linear transition-all duration-150"
              type="button"
              onClick={() => onSubmit(followerId)}
            >
              Unfollow
            </button>
            <button
              className="w-full text-white bg-black h-[40px] mt-[8px] border-0 rounded-[20px] font-bold uppercase text-sm py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
