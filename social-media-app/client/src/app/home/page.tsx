"use client";
import React, { useState, useEffect } from "react";
import userIcon from "@/../public/user-icon.png";
import EditModal from "@/components/Modals/EditModal";
import DeleteModal from "@/components/Modals/DeleteModal";
import useApi from "@/hooks/useApi";
import PostService from "@/httpService/PostService";
import Image from "next/image";
import PostLoader from "@/components/Loaders/PostLoader";
import ImageIcon from "@/icons/Image";
import VideoIcon from "@/icons/Video";
import ShareIcon from "@/icons/Share";
import LikeIcon from "@/icons/Like";
import RetweetIcon from "@/icons/Retweet";
import ReplyTweetIcon from "@/icons/Reply";
import DeleteIcon from "@/icons/Delete";
import EditIcon from "@/icons/Edit";
import { PostDetails } from "@/types/post";
import TimerIcon from "@/icons/Timer";
import SchedulePostModal from "@/components/Modals/SchedulePostModal";
import useAuthStore from "@/store/authStore";
import useProfileStore from "@/store/profileStore";

function Page() {
  const token = useAuthStore((state: any) => state.authToken);
  const profile = useProfileStore((state: any) => state.profileDetails);

  const [btnName, setBtnName] = useState<string>("for-you");
  const [postContent, setPostContent] = useState<string>("");

  const [showModal, setShowModal] = useState({
    type: "",
    status: false,
    postDetails: {
      _id: "",
      content: "",
      time: "",
    },
  });

  const [userPosts, setUserPosts] = useState<Array<Object>>([]);
  const [followingUsersPosts, setFollowingUsersPosts] = useState<Array<Object>>(
    []
  );
  const [posts, setPosts] = useState<Array<Object>>([]);

  // Custom hooks for APIs
  const [{}, deletePostApi] = useApi(null);
  const [{}, updatedPostApi] = useApi(null);

  const [
    {
      data: createPostData,
      isLoading: isCreatePostLoading,
      isError: isCreatePostError,
    },
    createPostApi,
  ] = useApi(null);

  const [{}, schedulePost] = useApi(null);

  const [
    {
      data: userPostsData,
      isLoading: isUserPostsLoading,
      isError: isUserPostsError,
    },
    getUserPostsApi,
  ] = useApi(null);

  const [
    {
      data: followingUsersPostsData,
      isLoading: isFollowingUsersPostsLoading,
      isError: isFollowingUsersPostsError,
    },
    getFollowingUsersPostsApi,
  ] = useApi(null);

  useEffect(() => {
    if (profile && profile.userId) {
      getUserPostsApi(
        () => () => PostService.getUserPosts(profile.userId, token)
      );
    }
  }, [token]);

  useEffect(() => {
    if (userPostsData && userPostsData.code) {
      const { code, data: result } = userPostsData;

      if (code === 200) {
        setUserPosts(result);
        setPosts(result);
      }
    }
  }, [userPostsData, isUserPostsError]);

  useEffect(() => {
    if (profile && profile.userId) {
      getFollowingUsersPostsApi(
        () => () => PostService.getFollowingUsersPosts(profile.userId, token)
      );
    }
  }, [token]);

  useEffect(() => {
    if (followingUsersPostsData && followingUsersPostsData.code) {
      const { code, data: result } = followingUsersPostsData;

      if (code === 200) {
        setFollowingUsersPosts(result);
      }
    }
  }, [followingUsersPostsData, isFollowingUsersPostsError]);

  const handleSubmit = (type: string, postDetails: PostDetails) => {
    setPostContent("");

    if (type === "scheduled") {
      const scheduledPost = {
        content: postDetails.content,
        time: postDetails.time,
        author: {
          _id: profile.userId,
          name: profile.userName,
        },
      };
      setShowModal({ ...showModal, status: false });

      schedulePost(
        () => () =>
          PostService.schedulePost(
            profile.userId,
            { postDetails: scheduledPost },
            token
          )
      );
    } else {
      const newPost = {
        content: postContent,
        author: {
          _id: profile.userId,
          name: profile.userName,
        },
      };

      createPostApi(
        () => () =>
          PostService.createPost(
            profile.userId,
            { postDetails: newPost },
            token
          )
      );
    }
  };

  useEffect(() => {
    if (createPostData && createPostData.code) {
      const { code } = createPostData;
      if (code === 200) {
        window.location.reload();
      }
    }
  }, [createPostData, isCreatePostError]);

  const onSubmit = (postDetails: PostDetails, postContent: string) => {
    setShowModal({ ...showModal, status: false });

    if (showModal.type && showModal.type === "delete") {
      const updatedPosts = userPosts.filter(
        (post: any) => post._id !== postDetails._id
      );
      setUserPosts(updatedPosts);
      setPosts(updatedPosts);

      deletePostApi(() => () => PostService.deletePost(postDetails._id, token));
    } else {
      const updatedPosts = userPosts.map((post: any) => {
        if (post._id === postDetails._id) {
          return {
            ...post,
            content: postContent,
          };
        }
        return post;
      });
      setUserPosts(updatedPosts);
      setPosts(updatedPosts);

      updatedPostApi(
        () => () =>
          PostService.updatePost(
            postDetails._id,
            { content: postContent },
            token
          )
      );
    }
  };

  const onOptionSelect = (type: string) => {
    if (type === "for-you") {
      setBtnName("for-you");
      setPosts(userPosts);
    } else {
      setBtnName("following");
      setPosts(followingUsersPosts);
    }
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
              onOptionSelect("for-you");
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
              onOptionSelect("following");
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

        {btnName === "following" ? null : (
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
                <ImageIcon />
              </button>
              <button className="px-[10px]">
                <VideoIcon />
              </button>
              <button
                className="pr-[50px]"
                onClick={() =>
                  setShowModal({
                    ...showModal,
                    type: "post",
                    status: true,
                  })
                }
              >
                <TimerIcon />
              </button>
              <button
                disabled={!postContent?.length}
                onClick={() => handleSubmit("normal", {} as PostDetails)}
                className="w-[80px] h-[30px] border rounded-[20px] bg-blue-500 disabled:bg-gray-600 outline-none"
              >
                <section className="text-[15px] font-semibold text-white">
                  Post
                </section>
              </button>
            </section>
          </section>
        )}

        <section className="w-full h-[430px] flex flex-col overflow-x-auto">
          <section className="w-full h-full flex flex-col px-[16px]">
            {isUserPostsLoading || isFollowingUsersPostsLoading ? (
              <section className="w-full h-full">
                <PostLoader loaderLength={5} />
              </section>
            ) : (
              posts &&
              posts.length &&
              posts.map((post: any, index) => (
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
                        {post.author.name}
                      </section>
                    </section>

                    {btnName === "following" ? null : (
                      <section className="flex flex-row">
                        <button
                          className="w-full h-[30px] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() =>
                            setShowModal({
                              ...showModal,
                              type: "update",
                              status: true,
                              postDetails: post,
                            })
                          }
                        >
                          <EditIcon />
                        </button>

                        <button
                          className="w-full h-[30px] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() =>
                            setShowModal({
                              ...showModal,
                              type: "delete",
                              status: true,
                              postDetails: post,
                            })
                          }
                        >
                          <DeleteIcon />
                        </button>
                      </section>
                    )}
                  </section>

                  <section className="w-full flex flex-col pl-[35px]">
                    <section className="text-white font-normal text-[16px]">
                      {post.content}
                    </section>
                    <section>
                      {post.media ? (
                        <Image
                          width={40}
                          height={40}
                          className="w-full h-[40px]"
                          src={post.media}
                          alt=""
                        />
                      ) : null}
                    </section>

                    <section className="w-full flex flex-row justify-between py-2">
                      <ReplyTweetIcon />
                      <RetweetIcon />
                      <LikeIcon />
                      <ShareIcon />
                    </section>
                  </section>
                </section>
              ))
            )}
          </section>

          {showModal.type === "post" && showModal.status && (
            <SchedulePostModal
              onCancel={() =>
                setShowModal({
                  ...showModal,
                  status: false,
                })
              }
              onSubmit={handleSubmit}
            />
          )}

          {showModal.type === "delete" && showModal.status && (
            <DeleteModal
              onCancel={() =>
                setShowModal({
                  ...showModal,
                  status: false,
                })
              }
              onDelete={() => onSubmit(showModal.postDetails, "")}
            />
          )}

          {showModal.type === "update" && showModal.status && (
            <EditModal
              post={showModal.postDetails}
              onCancel={() =>
                setShowModal({
                  ...showModal,
                  status: false,
                })
              }
              onUpdate={onSubmit}
            />
          )}
        </section>
      </article>
    </main>
  );
}

export default Page;
