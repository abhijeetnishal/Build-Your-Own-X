'use client'
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import eye from '@/../public/eye-image.png'
import cutEye from '@/../public/cut-eye-image.png'
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "@/components/Loading";

export default function Page() {
  const router = useRouter();

  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number>(0);

  const [isPasswordEyeBtnClicked, setIsPasswordEyeBtnClicked] = useState(false);
  
  const onPasswordEyeBtnClickFunc = ()=>{
      setIsPasswordEyeBtnClicked(!isPasswordEyeBtnClicked);
  }

  const handleSubmit = async(e: React.FormEvent)=>{
      e.preventDefault();
      setIsLoading(true);

      if(!userName || !password){
          setMessage('Enter required input fields');
      }
      else{
          const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/login`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                  'content-type': 'application/json'
              },
              body: JSON.stringify({
                  userName,
                  password
              })
          })
  
          const data = await response.json();
          setMessage(data.message);
          setIsLoading(false);
          
          if(response.ok){
              setStatusCode(200);
              router.push('/home');
          }
      }
      setIsLoading(false);
  }

  useEffect(() => {
      if(statusCode === 200){
          toast.success(message, {
              position: toast.POSITION.TOP_CENTER,
          });
      }
      else if(message) {
        toast.error(message, {
          position: toast.POSITION.TOP_CENTER,
        });
        //reset the message to an empty string
        setMessage('');
      }
  }, [message]);
  //useEffect executed when message changes their value.

  return (
  <main className="w-full h-[calc(100dvh-30px)] flex flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-col xs:flex-col">
    <ToastContainer autoClose={3000} />
    <figure className="w-1/2 xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-full xs:w-full bg-black h-full flex justify-center items-center">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-full xl:w-full lg:w-full md:w-[300px] sm:w-[200px] xs:w-[200px] h-1/2 fill-white r-1nao33i r-4qtqp9 r-yyyyoo r-rxcuwo r-1777fci r-m327ed r-dnmrzs r-494qqr r-bnwqim r-1plcrui r-lrvibr"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
    </figure>
    <section className="w-1/2 xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-full xs:w-full h-full flex flex-col pl-[100px] xl:pl-[100px] lg:pl-[100px] md:pl-[100px] sm:pl-[0px] xs:pl-[0px] justify-center items-center bg-black text-white">
      <section className="text-[50px] xl:text-[50px] lg:text-[50px] md:text-[35px] sm:text-[50px] xs:text-[32px] font-bold">
        Happening now
      </section>
      <section className="w-full flex flex-col xs:items-center pt-[30px]">
        <section className="flex text-[26px] font-bold pb-[15px]">
          Join today.
        </section>
        <section className="w-full h-[278px] flex flex-col xs:items-center pt-[8px]">
          <section className="w-full h-[40px] flex justify-center">
            <input type="text" placeholder="User name" value={userName} onChange={(event)=>{setUserName(event.target.value)}} className="w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[40px] pl-[10px] bg-black border-[2px] rounded-[4px] border-gray-600 outline-none"/>
          </section>
          <section className='flex flex-row justify-center items-center mt-[13px] w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[40px] outline-none bg-black border-[2px] border-gray-600 rounded-[4px]'>
              <input placeholder='Password' type={isPasswordEyeBtnClicked? 'text' : 'password'} value={password} onChange={(event)=>{setPassword(event.target.value)}} className='w-[320px] xl:w-[310px] lg:w-[310px] md:w-[210px] sm:w-[310px] xs:w-[210px] bg-black pl-2 outline-none' />
              <button className='pr-[5px]' onClick={onPasswordEyeBtnClickFunc}>
                  {
                      isPasswordEyeBtnClicked ? (<Image src={cutEye} alt='' className="min-w-0 relative w-6" /> )
                  : (<Image src={eye} alt='' className="min-w-0 relative w-6"/> )
                  }
              </button>
          </section>
          <button onClick={handleSubmit} disabled={isLoading} className="w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[35px] mt-[20px] border border-blue-500 rounded-[20px] bg-blue-500 outline-none">
            <section className="text-[15px] font-semibold text-white">
              Sign in
            </section>
        </button>
        <section className='flex w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[65px] pt-[20px] justify-center'>
          {
              isLoading ? 
              <Loading /> 
              : 
              <div>
              </div>
          }
      </section>
        </section>
      </section>
      <section className="flex flex-col pt-[40px] pb-[10px]">
        <section className="text-[15px] font-bold pb-[20px]">
          Don&apos;t have an account?
        </section>
        <Link href='/' className="w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[35px] flex justify-center items-center border-[2px] border-gray-600 rounded-[20px]">
          <section className="text-[15px] font-semibold text-blue-400">
            Sign up
          </section>
        </Link>
      </section>
    </section>
  </main>
  );
}