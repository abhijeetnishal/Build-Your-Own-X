import React from 'react'

type Props = {}

function Footer({}: Props) {
  return (
    <footer className='w-full h-[30px] flex justify-center items-center bg-black text-[12px] text-gray-300 border-t border-gray-800'>
        © 2023 X Corp.
    </footer>
  )
}

export default Footer