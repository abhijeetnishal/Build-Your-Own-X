'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import userIcon from '@/../public/user-icon.png'

type Props = {}

interface profile{
    userName: string
}

const SideNavbar = (props: Props) => {
    const router = useRouter();

    const [profileDetails, setProfileDetails] = useState<profile>({userName: ''});

    useEffect(()=>{
        async function getProfileDetails(){
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/profile/details`,{
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type':'application/json'
              }
            });
      
            const profileData = await response.json();
            setProfileDetails(profileData.data);
          }
          getProfileDetails();
    }, []);

    const handleClick = async()=>{
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        })

        if(response.ok){
            router.push('/login');
        }
    }

  return (
    <aside className='w-[250px] h-[100dvh] flex flex-col justify-between bg-black pl-[25px] pt-[25px] border-r border-gray-700'>
        <section className='w-full flex flex-col'>
            <figure className='w-full h-[40px] flex items-center'>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[30px] h-[30px] fill-white"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
            </figure>
            <section className='w-full h-[230px] flex flex-col justify-around pt-[45px]'>
                <Link href='/home' className='w-[120px] flex flex-row justify-around hover:bg-gray-800 rounded-[15px]'>
                    <figure className='pl-[8px] w-[40px] h-full flex items-center'>
                        <svg className="w-[25px] h-[25px] fill-white"><g><path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"></path></g></svg>
                    </figure>
                    <section className='pl-[10px] w-full text-white text-[20px] font-bold'>
                        Home
                    </section>
                </Link>
                <Link href='/home/profile' className='w-[120px] flex flex-row justify-around hover:bg-gray-800 rounded-[15px]'>
                    <figure className='pl-[8px] w-[40px] h-full flex items-center'>
                    <svg className="w-[25px] h-[25px] fill-white"><g><path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path></g></svg>
                    </figure>
                    <section className='pl-[10px] w-full text-white text-[20px] font-bold'>
                        Profile
                    </section>
                </Link>
                <button onClick={handleClick} className='w-[120px] flex flex-row justify-around hover:bg-gray-800 rounded-[15px]'>
                    <figure className='pl-[8px] w-[40px] h-full flex items-center'>
                        <svg className='w-[20px] h-[20px] fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>
                    </figure>
                    <section className='pl-[10px] w-full text-white text-[20px] font-bold'>
                        Logout
                    </section>
                </button>
            </section>
        </section>
        
        <section className='w-full h-[40px] flex flex-row items-center pl-[8px]'>
            <figure className='pr-[10px]'>
                <img className='w-[25px] h-[25px]' src={userIcon.src} alt="" />
            </figure>
            <section className='text-white font-semibold text-[20px]'>
                {
                    profileDetails.userName
                }
            </section>
        </section>
    </aside>
  )
}

export default SideNavbar