import React, { useMemo } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import useAuth from "@/hooks/useAuth";
import useSWRGet from "@/hooks/useSWRGet";
import Image from "next/image";
import { bufferToFile } from "@/helpers/helper";
import { useSystemData } from "@/context/AuthProvider";

const ProfileLabel = ({
  name,
  image,
  fallBack = "/assets/images/all-img/user-default.png",
}) => {
  return (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
          <Image
            src={image?.preview ?? fallBack}
            alt="Avatar"
            width={500}
            height={500}
            className="block w-full h-full object-cover rounded-full"
            priority
          />
        </div>
      </div>
      <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap  block">
          {name}
        </span>
        <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down"></Icon>
        </span>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, image } = useSystemData();

  const router = useRouter();

  const ProfileMenu = [
    {
      label: "Perfil",
      icon: "heroicons-outline:user",

      action: () => {
        router.push("/profile");
      },
    },
    {
      label: "Salir",
      icon: "heroicons-outline:login",
      action: async () => await signOut({ redirect: false }),
    },
  ];

  // if (isLoading)
  //   return (
  //     <div className="animate-pulse">
  //       <div className="flex items-center grid grid-cols-2 ">
  //         <div className="h-6 w-6 bg-[#C4C4C4] dark:bg-slate-500 rounded-full"></div>
  //         <span className="h-[18px] bg-[#C4C4C4] dark:bg-slate-500 w-[50px] inline-block rounded-full"></span>
  //       </div>
  //     </div>
  //   );

  return (
    <Dropdown
      label={<ProfileLabel name={user.name} image={image} />}
      classMenuItems="w-[180px] top-[58px]"
    >
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${
                active
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                  : "text-slate-600 dark:text-slate-300"
              } block     ${
                item.hasDivider
                  ? "border-t border-slate-100 dark:border-slate-700"
                  : ""
              }`}
            >
              <div className={`block cursor-pointer px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
