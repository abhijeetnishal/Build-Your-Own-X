"use client";
import getProfileDetails from "@/httpService/auth";
import { authAtom } from "@/state/authAtom";
import { profileAtom } from "@/state/profileAtom";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";

const IsAuthenticated = (Component: any) => {
  const WrappedComponent = (props: any) => {
    const router = useRouter();
    const token = getCookie("token") as string;
    const setProfile = useSetRecoilState(profileAtom);
    const setAuth = useSetRecoilState(authAtom);

    useEffect(() => {
      if (!token) {
        router.replace("/login");
      } else {
        const fetch = async () => {
          const response = await getProfileDetails(token);

          if (!response.ok) {
            router.replace("/login");
          }
          else{
            const data = await response.json();
            setAuth(token);
            setProfile(data)
          }
        };
        fetch();
      }
    }, [token]);

    if (!Component) {
      return null;
    } else {
      return <Component {...props} />;
    }
  };
  return WrappedComponent;
};

export default IsAuthenticated;