import React from 'react'

type Props = {}

const SidePanel = (props: Props) => {
  return (
    <aside className='w-[350px] h-[100dvh] flex flex-col bg-black border-l border-gray-700 '>
        <section className='p-[16px]'>
            <section className='w-full h-[40px] flex flex-row items-center px-[16px] border border-transparent rounded-[20px] bg-zinc-900'>
                <svg className='w-[25px] h-[25px] fill-gray-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="search"><g data-name="Layer 2"><path d="m20.71 19.29-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z" data-name="search"></path></g></svg>
                <section  className='pl-[20px] text-gray-500'>
                    Search
                </section>
            </section>
        </section>

        <section className='w-full h-[240px] p-[16px]'>
            <section className='w-full h-full p-[16px] flex flex-col justify-around text-white border border-transparent rounded-xl bg-zinc-900'>
                <h2 className='font-bold text-[20px]'>
                    Subscribe to Premium
                </h2>
                <p className='font-semibold'>
                    Subscribe to unlock new features and if eligible, receive a share of ads revenue.
                </p>
                <button className='w-[100px] h-[30px] border border-blue-500 rounded-[20px] bg-blue-500 outline-none'>
                    <section className='text-[15px] font-semibold text-white'>
                        Subscribe
                    </section>
                </button>
            </section>
        </section>
    </aside>
  )
}

export default SidePanel