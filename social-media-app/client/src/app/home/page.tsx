"use client";
import React, { useState, useEffect } from "react";
import userIcon from "@/../public/user-icon.png";
import EditModal from "@/components/EditModal";
import DeleteModal from "@/components/DeleteModal";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useRecoilValue } from "recoil";
import { profileAtom } from "@/state/profileAtom";
import useApi from "@/hooks/useApi";
import PostService from "@/httpService/PostService";
import { authAtom } from "@/state/authAtom";
import Image from "next/image";

function Page() {
  const token = useRecoilValue(authAtom);
  const profile = useRecoilValue(profileAtom);

  const [{}, createPostAPI] = useApi(null);
  const [{ data, isLoading, isError }, getPostsAPI] = useApi(null);

  const [btnName, setBtnName] = useState<string>("for-you");
  const [postContent, setPostContent] = useState<string>("");

  const [userPosts, setUserPosts] = useState<Array<Object>>([]);
  const [followingUsersPosts, setFollowingUsersPosts] = useState<Array<Object>>(
    []
  );
  const [isFollowingPostLoading, setIsFollowingPostLoading] =
    useState<boolean>(false);

  useEffect(() => {
    getPostsAPI(() => () => PostService.getOwnPosts(profile.userId, token));
  }, [token]);

  useEffect(() => {
    if (data && data.code) {
      const { code, data: result } = data;

      if (code === 200) {
        setUserPosts(result);
      }
    }
  }, [data, isError]);

  const handleSubmit = async () => {
    const newPost = {
      postContent: postContent,
    };

    setUserPosts([newPost, ...userPosts]);

    createPostAPI(
      () => () =>
        PostService.createPost(profile.userId, { content: postContent }, token)
    );
  };

  return (
    <main className="w-full h-[100dvh] bg-black flex flex-col">
      <section className="w-full text-white text-[20px] font-bold pt-[25px] pl-[16px]">
        Home
      </section>
      <article className="w-full h-full flex flex-col">
        <section className="w-full h-[60px] flex flex-row justify-around border-b border-gray-700">
          <button
            onClick={() => {
              setBtnName("for-you");
            }}
            className="w-1/2 h-full flex justify-center items-end hover:bg-gray-800"
          >
            <section
              className={`${
                btnName === "for-you"
                  ? "border-b-[4px] border-blue-400 text-white"
                  : "text-gray-500"
              } w-[80px] text-[18px] font-semibold`}
            >
              For you
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
              } w-[80px] text-[18px] font-semibold`}
            >
              Following
            </section>
          </button>
        </section>

        <section className="w-full h-[180px] flex flex-col pt-[15px]">
          <section className="w-full h-[40px] flex flex-row">
            <figure className="w-[70px] h-full pl-[16px] pr-[8px]">
              <Image width={35} height={35} src={userIcon.src} alt="" />
            </figure>

            <section className="w-full h-full pl-[10px]">
              <input
                type="text"
                placeholder="What is happening?!"
                value={postContent}
                onChange={(event) => {
                  setPostContent(event.target.value);
                }}
                className="h-full text-[20px] outline-none bg-black text-white"
              />
            </section>
          </section>

          <section className="ml-[60px] mr-[50px] border-b border-gray-700 pt-[40px]"></section>
          <section className="w-full flex flex-row pl-[60px] pt-[10px] pb-[20px] border-b border-gray-700">
            <button className="pr-[10px]">
              <svg
                className="w-[25px] h-[25px] fill-blue-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                id="image"
              >
                <path d="M19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a2.81,2.81,0,0,0,.49-.05l.3-.07.07,0h0l.05,0,.37-.14.13-.07c.1-.06.21-.11.31-.18a3.79,3.79,0,0,0,.38-.32l.07-.09a2.69,2.69,0,0,0,.27-.32l.09-.13a2.31,2.31,0,0,0,.18-.35,1,1,0,0,0,.07-.15c.05-.12.08-.25.12-.38l0-.15A2.6,2.6,0,0,0,22,19V5A3,3,0,0,0,19,2ZM5,20a1,1,0,0,1-1-1V14.69l3.29-3.3h0a1,1,0,0,1,1.42,0L17.31,20Zm15-1a1,1,0,0,1-.07.36,1,1,0,0,1-.08.14.94.94,0,0,1-.09.12l-5.35-5.35.88-.88a1,1,0,0,1,1.42,0h0L20,16.69Zm0-5.14L18.12,12a3.08,3.08,0,0,0-4.24,0l-.88.88L10.12,10a3.08,3.08,0,0,0-4.24,0L4,11.86V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1ZM13.5,6A1.5,1.5,0,1,0,15,7.5,1.5,1.5,0,0,0,13.5,6Z"></path>
              </svg>
            </button>
            <button className="pl-[10px] pr-[50px]">
              <svg
                className="w-[35px] h-[35px] fill-blue-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                id="video-camera"
              >
                <path d="M21.53,7.15a1,1,0,0,0-1,0L17,8.89A3,3,0,0,0,14,6H5A3,3,0,0,0,2,9v6a3,3,0,0,0,3,3h9a3,3,0,0,0,3-2.89l3.56,1.78A1,1,0,0,0,21,17a1,1,0,0,0,.53-.15A1,1,0,0,0,22,16V8A1,1,0,0,0,21.53,7.15ZM15,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V9A1,1,0,0,1,5,8h9a1,1,0,0,1,1,1Zm5-.62-3-1.5V11.12l3-1.5Z"></path>
              </svg>
            </button>
            <button
              onClick={handleSubmit}
              className="w-[80px] h-[30px] border border-blue-500 rounded-[20px] bg-blue-500 outline-none"
            >
              <section className="text-[15px] font-semibold text-white">
                Post
              </section>
            </button>
          </section>
        </section>

        {btnName === "for-you" ? (
          <section className="w-full h-[430px] flex flex-col overflow-x-auto">
            <section className="w-full h-full flex flex-col px-[16px]">
              {isLoading ? (
                <section className="w-full h-full">
                  <LoadingSkeleton />
                </section>
              ) : (
                userPosts?.map((post: any, index) => (
                  <section
                    key={post._id}
                    className="border-b border-gray-500 pt-[10px]"
                  >
                    <section className="w-full h-[40px] flex flex-row items-center">
                      <section className="w-full h-full flex flex-row">
                        <figure className="pr-[8px]">
                          <Image
                            width={25}
                            height={25}
                            src={userIcon.src}
                            alt=""
                          />
                        </figure>
                        <section className="text-white font-semibold text-[16px]">
                          {profile.userName}
                        </section>
                      </section>
                      <button className="">
                        {
                          <EditModal
                            heading={post.postContent}
                            postId={post._id}
                          />
                        }
                      </button>
                      <button>{<DeleteModal postId={post._id} />}</button>
                    </section>

                    <section className="w-full flex flex-col pl-[35px]">
                      <section className="text-white font-normal text-[16px]">
                        {post.postContent}
                      </section>
                      <section>
                        {post.postImage ? (
                          <Image
                            width={40}
                            height={40}
                            className="w-full h-[40px]"
                            src={post.postImage}
                            alt=""
                          />
                        ) : null}
                      </section>

                      <section className="w-full flex flex-row justify-between pt-[16px]">
                        <svg className="w-[25px] h-[25px] fill-gray-500">
                          <g>
                            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
                          </g>
                        </svg>
                        <svg className="w-[25px] h-[25px] fill-gray-500">
                          <g>
                            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
                          </g>
                        </svg>
                        <svg className="w-[25px] h-[25px] fill-gray-500">
                          <g>
                            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                          </g>
                        </svg>
                        <svg className="w-[25px] h-[25px] fill-gray-500">
                          <g>
                            <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path>
                          </g>
                        </svg>
                      </section>
                    </section>
                  </section>
                ))
              )}
            </section>
          </section>
        ) : (
          <section className="w-full h-[430px] flex flex-col overflow-x-auto">
            <section className="w-full flex flex-col px-[16px]">
              {!isFollowingPostLoading ? (
                followingUsersPosts?.map((post: any, index) => (
                  <section
                    key={index}
                    className="border-b border-gray-500 pt-[10px]"
                  >
                    <section className="w-full h-[40px] flex flex-row items-center">
                      <section className="w-full h-full flex flex-row">
                        <figure className="pr-[8px]">
                          <Image
                            width={25}
                            height={25}
                            src={userIcon.src}
                            alt=""
                          />
                        </figure>
                        <section className="text-white font-semibold text-[16px]">
                          {post.userId.userName}
                        </section>
                      </section>
                    </section>
                    <section className="w-full flex flex-col pl-[35px]">
                      <section className="text-white font-normal text-[16px]">
                        {post.postContent}
                      </section>
                      <section>
                        {post.postImage ? (
                          <Image
                            width={40}
                            height={40}
                            className="w-full h-[40px]"
                            src={post.postImage}
                            alt=""
                          />
                        ) : null}
                      </section>
                      <section className="w-full flex flex-row justify-between pt-[16px]">
                        <svg className="w-[25px] h-[25px] fill-gray-500">
                          <g>
                            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
                          </g>
                        </svg>
                        <svg className="w-[25px] h-[25px] fill-gray-500">
                          <g>
                            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
                          </g>
                        </svg>
                        <svg className="w-[25px] h-[25px] fill-gray-500">
                          <g>
                            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                          </g>
                        </svg>
                        <svg className="w-[25px] h-[25px] fill-gray-500">
                          <g>
                            <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path>
                          </g>
                        </svg>
                      </section>
                    </section>
                  </section>
                ))
              ) : (
                <section className="w-full h-full">
                  <LoadingSkeleton />
                </section>
              )}
            </section>
          </section>
        )}
      </article>
    </main>
  );
}

export default Page;
