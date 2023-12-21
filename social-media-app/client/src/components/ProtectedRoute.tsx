"use client";
import getProfileDetails from "@/httpService/auth";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const IsAuthenticated = (Component: any) => {
  const WrappedComponent = async (props: any) => {
    const router = useRouter();
    const token = getCookie("token") as string;

    useEffect(() => {
      if (!token) {
        router.replace("/login");
      } else {
        const fetch = async () => {
          const response = await getProfileDetails(token);

          if (!response.ok) {
            router.replace("/login");
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
