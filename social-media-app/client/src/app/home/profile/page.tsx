"use client";
import React, { useEffect, useState } from "react";
import userIcon from "@/../public/user-icon.png";
import { useRecoilValue } from "recoil";
import { profileAtom } from "@/state/profileAtom";
import PostLoader from "@/components/Loaders/PostLoader";
import useApi from "@/hooks/useApi";
import { authAtom } from "@/state/authAtom";
import ProfileService from "@/httpService/ProfileService";
import Image from "next/image";
import UnfollowModal from "@/components/Modals/UnfollowModal";

function Page() {
  const profile = useRecoilValue(profileAtom);
  const token = useRecoilValue(authAtom);

  const [btnName, setBtnName] = useState<string>("followers");

  const [userFollowers, setUserFollowers] = useState<Array<Object>>([]);
  const [userFollowings, setUserFollowings] = useState<Array<Object>>([]);
  const [isFollowBtnClicked, setIsFollowBtnClicked] = useState<boolean>(false);
  const [btnIndex, setBtnIndex] = useState<string>("");

  const [showModal, setShowModal] = useState(false);

  const [
    {
      data: followersData,
      isLoading: isFollowersDataLoading,
      isError: isFollowersDataError,
    },
    getFollowersApi,
  ] = useApi(null);

  const [
    {
      data: followingsData,
      isLoading: isFollowingsDataLoading,
      isError: isFollowingsDataError,
    },
    getFollowingsApi,
  ] = useApi(null);

  const [
    {
      data: unfollowUserData,
      isLoading: isUnfollowDataLoading,
      isError: isUnfollowDataError,
    },
    getUnfollowApi,
  ] = useApi(null);

  useEffect(() => {
    if (profile && profile.userId) {
      getFollowersApi(
        () => () => ProfileService.getFollowers(profile.userId, token)
      );
    }
  }, [token]);

  useEffect(() => {
    if (followersData && followersData.code) {
      const { code, data: result } = followersData;

      if (code === 200) {
        setUserFollowers(result);
      }
    }
  }, [followersData, isFollowersDataError]);

  useEffect(() => {
    if (profile && profile.userId) {
      getFollowingsApi(
        () => () => ProfileService.getFollowings(profile.userId, token)
      );
    }
  }, [token]);

  useEffect(() => {
    if (followingsData && followingsData.code) {
      const { code, data: result } = followingsData;

      if (code === 200) {
        setUserFollowings(result);
      }
    }
  }, [followingsData, isFollowingsDataError]);

  const onSubmit = (followerId: string) => {
    setShowModal(false);

    getUnfollowApi(
      () => () =>
        ProfileService.unfollowUser(
          profile.userId,
          { followerId: followerId },
          token
        )
    );
  };

  // useEffect(() => {
  //   if (unfollowUserData && unfollowUserData.code) {
  //     const { code, data: result } = unfollowUserData;

  //     if (code === 200) {
  //       window.location.reload()
  //     }
  //   }
  // }, [unfollowUserData, isUnfollowDataError]);

  return (
    <main className="w-full h-[100dvh] bg-black text-white flex flex-col">
      <section className="w-full text-white text-[20px] font-bold pt-[25px] pl-[16px]">
        Profile
      </section>
      <article className="w-full h-full flex flex-col">
        <section className="w-full h-[70px] flex flex-row justify-center items-center pl-[8px]">
          <figure className="pr-[8px]">
            <Image width={40} height={40} src={userIcon.src} alt="" />
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
            {!isFollowersDataLoading ? (
              userFollowers &&
              userFollowers.map((follower: any, index) => (
                <section
                  key={follower._id}
                  className="w-full h-[40px] flex flex-row items-center px-[32px] my-[10px]"
                >
                  <section className="w-full flex flex-row">
                    <figure className="pr-[8px]">
                      <Image width={35} height={35} src={userIcon.src} alt="" />
                    </figure>
                    <section className="text-white font-semibold text-[20px]">
                      {follower.userName}
                    </section>
                  </section>
                  <button
                    onClick={() => {
                      // followBtnClickFunc(
                      //   follower.userDetails._id,
                      //   follower.userId
                      // );
                      // setBtnIndex(follower.userDetails._id);
                    }}
                    className="w-[200px] h-[30px] border rounded-[20px]"
                  >
                    <section className="font-semibold text-[18px]">
                      {isFollowBtnClicked && btnIndex === follower._id
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
            {!isFollowingsDataLoading ? (
              userFollowings &&
              userFollowings?.map((following: any, index) => (
                <section
                  key={following._id}
                  className="w-full h-[40px] flex flex-row items-center px-[32px] my-[10px]"
                >
                  <section className="w-full flex flex-row">
                    <figure className="pr-[8px]">
                      <Image width={35} height={35} src={userIcon.src} alt="" />
                    </figure>
                    <section className="text-white font-semibold text-[20px]">
                      {following.userName}
                    </section>
                  </section>
                  <button
                    className="w-[200px] h-[30px] border rounded-[20px]"
                    onClick={() => setShowModal(true)}
                  >
                    <section className="font-semibold text-[18px]">
                      Unfollow
                    </section>
                  </button>
                  {showModal && (
                    <UnfollowModal
                      heading={following.userName}
                      followerId={following._id}
                      onClose={() => setShowModal(false)}
                      onSubmit={onSubmit}
                    />
                  )}
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
