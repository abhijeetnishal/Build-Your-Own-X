"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import eye from "@/../public/eye-image.png";
import cutEye from "@/../public/cut-eye-image.png";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/Loading";
import useApi from "@/hooks/useApi";
import { AuthService } from "@/httpService";
import { setCookie } from "cookies-next";
import { useSetRecoilState } from "recoil";
import { profileAtom } from "@/state/profileAtom";
import { authAtom } from "@/state/authAtom";
import X from "@/icons/X";
import AuthSubmitButton from "@/components/AuthSubmitButton";

export default function Page() {
  const router = useRouter();

  const [{ data, isLoading, isError }, authApi] = useApi(null);

  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [message, setMessage] = useState<string>("");

  const setProfile = useSetRecoilState(profileAtom);
  const isAuth = useSetRecoilState(authAtom);

  const [isPasswordEyeBtnClicked, setIsPasswordEyeBtnClicked] = useState(false);

  const onPasswordEyeBtnClickFunc = () => {
    setIsPasswordEyeBtnClicked(!isPasswordEyeBtnClicked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !password) {
      setMessage("Enter required input fields");
    } else {
      const data = {
        userName: userName,
        password: password,
      };

      authApi(() => () => AuthService.login(data));
    }
  };

  useEffect(() => {
    if (data && data.code) {
      const { code, data: result, message } = data;

      if (code === 200) {
        const token = result.authToken;

        setCookie("token", token);

        isAuth(token);
        setProfile(result);

        router.replace("/home");
      } else {
        setMessage(message);
      }
    }
  }, [data, isError]);

  useEffect(() => {
    if (data.code === 200) {
      toast.success(message, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (message) {
      toast.error(message, {
        position: toast.POSITION.TOP_CENTER,
      });
      //reset the message to an empty string
      setMessage("");
    }
  }, [message]);
  //useEffect executed when message changes their value.

  return (
    <main className="w-full h-[calc(100dvh-30px)] flex flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-col xs:flex-col">
      <ToastContainer autoClose={3000} />
      <figure className="w-1/2 xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-full xs:w-full bg-black h-full flex justify-center items-center">
        <X />
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
              <input
                type="text"
                placeholder="User name"
                value={userName}
                onChange={(event) => {
                  setUserName(event.target.value);
                }}
                className="w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[40px] pl-[10px] bg-black border-[2px] rounded-[4px] border-gray-600 outline-none"
              />
            </section>
            <section className="flex flex-row justify-center items-center mt-[13px] w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[40px] outline-none bg-black border-[2px] border-gray-600 rounded-[4px]">
              <input
                placeholder="Password"
                type={isPasswordEyeBtnClicked ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                className="w-[320px] xl:w-[310px] lg:w-[310px] md:w-[210px] sm:w-[310px] xs:w-[210px] bg-black pl-2 outline-none"
              />
              <button className="pr-[5px]" onClick={onPasswordEyeBtnClickFunc}>
                {isPasswordEyeBtnClicked ? (
                  <Image src={cutEye} alt="" className="min-w-0 relative w-6" />
                ) : (
                  <Image src={eye} alt="" className="min-w-0 relative w-6" />
                )}
              </button>
            </section>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[35px] mt-[20px] border border-blue-500 rounded-[20px] bg-blue-500 outline-none"
            >
              <section className="text-[15px] font-semibold text-white">
                Sign in
              </section>
            </button>
            <section className="flex w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[65px] pt-[20px] justify-center">
              {isLoading ? <Loading /> : <div></div>}
            </section>
          </section>
        </section>
        <section className="flex flex-col pt-[40px] pb-[10px]">
          <section className="text-[15px] font-bold pb-[20px]">
            Don&apos;t have an account?
          </section>

          <AuthSubmitButton redirectTo={"/"} actionButtonName="Login" />
        </section>
      </section>
    </main>
  );
}
