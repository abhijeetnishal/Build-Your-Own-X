"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import eye from "@/../public/eye-image.png";
import cutEye from "@/../public/cut-eye-image.png";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/Loaders/ProcessingLoader";
import { validatePassword } from "@/utils";
import useApi from "@/hooks/useApi";
import { AuthService } from "@/httpService";
import AuthSubmitButton from "@/components/AuthSubmitButton";
import XIcon from "@/icons/X";
import ProcessingLoader from "@/components/Loaders/ProcessingLoader";

const SignUp = () => {
  const router = useRouter();

  const [{ data, isLoading, isError }, authApi] = useApi(null);

  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState<string>("");

  const [isPasswordEyeBtnClicked, setIsPasswordEyeBtnClicked] = useState(false);
  const [isConfirmPasswordEyeBtnClicked, setIsConfirmPasswordEyeBtnClicked] =
    useState(false);

  const onPasswordEyeBtnClickFunc = () => {
    setIsPasswordEyeBtnClicked(!isPasswordEyeBtnClicked);
  };

  const onConfirmPasswordEyeBtnClickFunc = () => {
    setIsConfirmPasswordEyeBtnClicked(!isConfirmPasswordEyeBtnClicked);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!userName || !password || !confirmPassword) {
      setMessage("Enter required input fields");
    } else if (!validatePassword(password)) {
      setMessage(
        "Weak password! Ensure it has 8 or more characters with 1 uppercase, 1 lowercase, 1 digit and 1 special character"
      );
    } else if (password !== confirmPassword) {
      setMessage("Password and confirm password fields should match");
    } else {
      const data = {
        userName: userName,
        password: password,
        confirmPassword: confirmPassword,
      };

      authApi(() => () => AuthService.signUp(data));
    }
  };

  useEffect(() => {
    if (data && data.code) {
      const { code, message } = data;

      if (code === 200) {
        router.push("/login");
      }
      setMessage(message);
    }
  }, [data, isError]);

  useEffect(() => {
    if (message) {
      toast.error(message, {
        position: toast.POSITION.TOP_CENTER,
      });
      //reset the message to an empty string
      setMessage("");
    }
  }, [message]);
  //useEffect executed when message changes their value.

  return (
    <main className="w-full md:h-[calc(100dvh-30px)] sm:h-full xs:h-full flex flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-col xs:flex-col">
      <ToastContainer autoClose={3000} />

      <section className="w-1/2 xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-full xs:w-full flex justify-center items-center bg-black">
        <figure className="w-1/2">
          <XIcon />
        </figure>
      </section>

      <section className="w-1/2 xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-full xs:w-full h-full flex flex-col pl-[100px] xl:pl-[100px] lg:pl-[100px] md:pl-[100px] sm:pl-[0px] xs:pl-[0px] justify-center items-center bg-black text-white">
        <section className="text-[50px] xl:text-[50px] lg:text-[50px] md:text-[35px] sm:text-[50px] xs:text-[32px] font-bold">
          Happening now
        </section>
        <section className="w-full flex flex-col xs:items-center pt-[30px]">
          <section className="text-[26px] font-bold pb-[15px]">
            Join today.
          </section>
          <section className="w-full h-[160px] flex flex-col justify-around xs:items-center">
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
            <section className="flex flex-row justify-center items-center w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[40px] outline-none bg-black border-[2px] border-gray-600 rounded-[4px]">
              <input
                placeholder="Password"
                type={isPasswordEyeBtnClicked ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                className="w-[320px] xl:w-[310px] lg:w-[310px] md:w-[210px] sm:w-[350px] xs:w-[210px] bg-black pl-2 outline-none"
              />
              <button className="pr-[5px]" onClick={onPasswordEyeBtnClickFunc}>
                {isPasswordEyeBtnClicked ? (
                  <Image src={cutEye} alt="" className="min-w-0 relative w-6" />
                ) : (
                  <Image src={eye} alt="" className="min-w-0 relative w-6" />
                )}
              </button>
            </section>
            <section className="flex flex-row justify-center items-center w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[40px] outline-none bg-black border-[2px] border-gray-600 rounded-[4px]">
              <input
                placeholder="Confirm password"
                type={isConfirmPasswordEyeBtnClicked ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
                className="w-[320px] xl:w-[310px] lg:w-[310px] md:w-[210px] sm:w-[310px] xs:w-[210px] bg-black pl-2 outline-none"
              />
              <button
                className="pr-[5px]"
                onClick={onConfirmPasswordEyeBtnClickFunc}
              >
                {isConfirmPasswordEyeBtnClicked ? (
                  <Image src={cutEye} alt="" className="min-w-0 relative w-6" />
                ) : (
                  <Image src={eye} alt="" className="min-w-0 relative w-6" />
                )}
              </button>
            </section>
          </section>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[35px] mt-[20px] border border-blue-500 rounded-[20px] bg-blue-500 outline-none"
          >
            <section className="text-[15px] font-semibold text-white">
              create account
            </section>
          </button>
        </section>
        <section className="flex w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[65px] pt-[32px] justify-center">
          {isLoading ? <ProcessingLoader /> : <div></div>}
        </section>
        <section className="flex flex-col pt-[40px] pb-[10px]">
          <section className="flex justify-center text-[15px] font-bold pb-[20px]">
            Already have an account?
          </section>

          <AuthSubmitButton redirectTo={"/login"} actionButtonName="Login" />
        </section>
      </section>
    </main>
  );
};

export default SignUp;
