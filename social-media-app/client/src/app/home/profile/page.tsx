"use client";
import React, { useEffect, useState } from "react";
import userIcon from "@/../public/user-icon.png";
import DialogComponent from "@/components/DialogComponent";
import { useRecoilValue } from "recoil";
import { profileAtom } from "@/state/profileAtom";
import PostLoader from "@/components/Loaders/PostLoader";

function Page() {
  const profile = useRecoilValue(profileAtom);

  const [btnName, setBtnName] = useState<string>("followers");

  const [userFollowers, setUserFollowers] = useState<Array<Object>>([]);
  const [userFollowing, setUserFollowing] = useState<Array<Object>>([]);
  const [isFollowBtnClicked, setIsFollowBtnClicked] = useState<boolean>(false);
  const [btnIndex, setBtnIndex] = useState<string>("");
  const [isFollowersLoading, setIsFollowerLoading] = useState<boolean>(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);

  const followBtnClickFunc = async (
    followerId: string,
    followingId: string
  ) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/users/follower-following/add`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerId: followerId,
          followingId: followingId,
        }),
      }
    );
    setIsFollowBtnClicked(!isFollowBtnClicked);

    if (response.ok) {
    }
  };

  useEffect(() => {
    async function getuserFollowers() {
      setIsFollowerLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/users/profile/follower-list`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const followers = await response.json();
      setUserFollowers(followers.data);
      setIsFollowerLoading(false);
    }
    getuserFollowers();
  }, []);

  useEffect(() => {
    async function getuserFollowing() {
      setIsFollowingLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/users/profile/following-list`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const following = await response.json();
      setUserFollowing(following.data);
      setIsFollowingLoading(false);
    }
    getuserFollowing();
  }, []);

  return (
    <main className="w-full h-[100dvh] bg-black text-white flex flex-col">
      <section className="w-full text-white text-[20px] font-bold pt-[25px] pl-[16px]">
        Profile
      </section>
      <article className="w-full h-full flex flex-col">
        <section className="w-full h-[70px] flex flex-row justify-center items-center pl-[8px]">
          <figure className="pr-[8px]">
            <img className="w-[40px] h-[40px]" src={userIcon.src} alt="" />
          </figure>
          <section className="text-white font-bold text-[24px]">
            {profile.userName}
          </section>
        </section>
        <section className="w-full h-[60px] flex flex-row justify-around border-b border-gray-700">
          <button
            onClick={() => {
              setBtnName("followers");
            }}
            className="w-1/2 h-full flex justify-center items-end hover:bg-gray-800"
          >
            <section
              className={`${
                btnName === "followers"
                  ? "border-b-[4px] border-blue-400 text-white"
                  : "text-gray-500"
              } w-[90px] text-[18px] font-semibold`}
            >
              Followers
            </section>
          </button>
          <button
            onClick={() => {
              setBtnName("following");
            }}
            className="w-1/2 h-full flex justify-center items-end hover:bg-gray-800"
          >
            <section
              className={`${
                btnName === "following"
                  ? "border-b-[4px] border-blue-400 text-white"
                  : "text-gray-500"
              } w-[90px] text-[18px] font-semibold`}
            >
              Following
            </section>
          </button>
        </section>
        {btnName === "followers" ? (
          <section className="w-full h-[600px] flex flex-col overflow-x-auto">
            {!isFollowersLoading ? (
              userFollowers?.map((follower: any, index) => (
                <section
                  key={index}
                  className="w-full h-[40px] flex flex-row items-center px-[32px] my-[10px]"
                >
                  <section className="w-full flex flex-row">
                    <figure className="pr-[8px]">
                      <img
                        className="w-[35px] h-[35px]"
                        src={userIcon.src}
                        alt=""
                      />
                    </figure>
                    <section className="text-white font-semibold text-[20px]">
                      {follower.userDetails.userName}
                    </section>
                  </section>
                  <button
                    onClick={() => {
                      followBtnClickFunc(
                        follower.userDetails._id,
                        follower.userId
                      );
                      setBtnIndex(follower.userDetails._id);
                    }}
                    className="w-[200px] h-[30px] border rounded-[20px]"
                  >
                    <section className="font-semibold text-[18px]">
                      {isFollowBtnClicked &&
                      btnIndex === follower.userDetails._id
                        ? "Following"
                        : "Follow"}
                    </section>
                  </button>
                </section>
              ))
            ) : (
              <section className="w-full h-full">
                <PostLoader loaderLength={5} />
              </section>
            )}
          </section>
        ) : (
          <section className="w-full h-[600px] flex flex-col overflow-x-auto">
            {!isFollowingLoading ? (
              userFollowing?.map((following: any, index) => (
                <section
                  key={index}
                  className="w-full h-[40px] flex flex-row items-center px-[32px] my-[10px]"
                >
                  <section className="w-full flex flex-row">
                    <figure className="pr-[8px]">
                      <img
                        className="w-[35px] h-[35px]"
                        src={userIcon.src}
                        alt=""
                      />
                    </figure>
                    <section className="text-white font-semibold text-[20px]">
                      {following.userName}
                    </section>
                  </section>
                  <button className="w-[200px] h-[30px] border rounded-[20px]">
                    <section className="font-semibold text-[18px]">
                      {
                        <DialogComponent
                          btnName="Following"
                          heading={following.userName}
                          followerId={following._id}
                          followingId={profile.userId}
                        />
                      }
                    </section>
                  </button>
                </section>
              ))
            ) : (
              <section className="w-full h-full">
                <PostLoader loaderLength={5} />
              </section>
            )}
          </section>
        )}
        <section className="w-full "></section>
      </article>
    </main>
  );
}

export default Page;
