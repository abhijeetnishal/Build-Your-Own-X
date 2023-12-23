interface Props {
  onCancel: Function;
  onDelete: Function;
}

function DeleteModal(props: Props) {
  const { onCancel, onDelete } = props;

  return (
    <>
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-[360px]">
          {/*content*/}
          <div className="w-full flex justify-center bg-slate-900 border-0 rounded-[20px] shadow-lg relative flex-col outline-none focus:outline-none">
            <div className="w-full flex flex-row items-center justify-between pt-[10px] px-8">
              <h3 className="text-xl font-semibold text-white">Delete</h3>
              <button
                className="hover:bg-blue-700 p-1 border-0 float-right text-3xl text-gray-700 leading-none font-semibold outline-none focus:outline-none"
                onClick={() => onCancel()}
              >
                x
              </button>
            </div>

            <section className="w-full h-[40px] flex flex-row justify-center text-[18px] text-red-600 font-semibold px-[32px]">
              Are you sure you want to delete?
            </section>

            <section className="w-full h-[70px] text-[16px] text-white px-[32px] font-normal">
              Once you delete we will not be able to undo it. Delete only if you
              are sure about it.
            </section>
            {/*footer*/}
            <div className="flex flex-col items-center justify-end p-4">
              <button
                className="w-full h-[40px] mb-[5px] border rounded-[20px] text-black bg-white font-bold ease-linear transition-all duration-150"
                type="button"
                onClick={() => onDelete()}
              >
                Delete
              </button>
              <button
                className="w-full h-[40px] mt-[8px] border rounded-[20px] text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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

export default DeleteModal;
