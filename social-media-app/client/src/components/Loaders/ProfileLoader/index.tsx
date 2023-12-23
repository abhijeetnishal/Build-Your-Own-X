import ProfileIcon from "@/icons/Profile";

const ProfileLoader = () => {
  return (
    <div className="w-full h-[40px] pl-2 mb-2 animate-pulse flex flex-row items-center">
      <ProfileIcon />
      <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700"></div>
    </div>
  );
};

export default ProfileLoader;
