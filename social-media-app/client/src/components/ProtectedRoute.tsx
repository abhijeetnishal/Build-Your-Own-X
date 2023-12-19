"use client";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const IsAuthenticated = (Component: any) => {
    const WrappedComponent = (props: any) => {
      const router = useRouter();
      const token = getCookie("token") as string;

      const checkAuthentication = async () => {
        const response = await fetch(
          "http://localhost:8080/api/v1/user/details",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-auth-token": token,
            },
            body: JSON.stringify({
              token: token,
            }),
          }
        );

        const isAuth = response.ok;
        return isAuth;
      };

      useEffect(() => {
        const fetchData = async () => {
          const isAuth = await checkAuthentication();
          if (!isAuth) {
            router.push("/login");
          }
        };

        fetchData();
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
