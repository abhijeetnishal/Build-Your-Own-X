import Link from "next/link";
import React from "react";

type Props = {
    redirectTo: string;
    actionButtonName: string;
};

const AuthSubmitButton = (props: Props) => {
  const {redirectTo, actionButtonName} = props;

  return (
    <Link
      href={redirectTo}
      className="w-[350px] xl:w-[350px] lg:w-[350px] md:w-[250px] sm:w-[350px] xs:w-[250px] h-[35px] flex justify-center items-center border-[2px] border-gray-600 rounded-[20px]"
    >
      <section className="text-[15px] font-semibold text-blue-400">
        {actionButtonName}
      </section>
    </Link>
  );
};

export default AuthSubmitButton;
