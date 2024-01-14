"use client";
import getProfileDetails from "@/httpService/auth";
import useAuthStore from "@/store/authStore";
import useProfileStore from "@/store/profileStore";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const IsAuthenticated = (Component: any) => {
  const WrappedComponent = (props: any) => {
    const router = useRouter();
    const token = getCookie("token") as string;

    const setAuthToken = useAuthStore((state: any) => state.setAuthToken);
    const setProfileDetails = useProfileStore(
      (state: any) => state.setProfileDetails
    );

    useEffect(() => {
      if (!token) {
        router.replace("/login");
      } else {
        const fetch = async () => {
          const response = await getProfileDetails(token);

          if (!response.ok) {
            router.replace("/login");
          } else {
            const data = await response.json();
            setAuthToken(token);
            setProfileDetails(data);
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
