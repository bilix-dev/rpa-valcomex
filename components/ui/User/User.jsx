"use client";
import { Icon } from "@iconify/react";
import React, { Fragment } from "react";
import SkeletionTable from "@/components/skeleton/Table";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import { Tab } from "@headlessui/react";

import useSWRGetMultiple from "@/hooks/useSWRGetMultiple";
import UserCreationTable from "./UserCreationTable";
import UserTable from "./UserTable";

const User = () => {
  const { operatorId } = useAuth();

  const {
    data: response,
    isLoading,
    isValidating,
    mutate,
  } = useSWRGetMultiple([
    `/users/operator/${operatorId}`,
    `/users/verification/operator/${operatorId}`,
  ]);

  if (isLoading) {
    return <SkeletionTable count={10} />;
  }

  const buttons = [
    {
      title: "Usuarios",
      icon: "heroicons-outline:user",
    },
    {
      title: "Invitaciones",
      icon: "heroicons-outline:envelope",
    },
  ];

  return (
    <Card>
      <Tab.Group>
        <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse">
          {buttons.map((item, i) => (
            <Tab as={Fragment} key={i}>
              {({ selected }) => (
                <button
                  className={` inline-flex items-start text-sm font-medium mb-7 capitalize bg-white dark:bg-slate-800 ring-0 foucs:ring-0 focus:outline-none px-2 transition duration-150 before:transition-all before:duration-150 relative before:absolute
                     before:left-1/2 before:bottom-[-6px] before:h-[1.5px]
                      before:bg-primary-500 before:-translate-x-1/2
              
              ${
                selected
                  ? "text-primary-500 before:w-full"
                  : "text-slate-500 before:w-0 dark:text-slate-300"
              }
              `}
                >
                  <span className="text-base relative top-[1px] ltr:mr-1 rtl:ml-1">
                    <Icon icon={item.icon} />
                  </span>
                  {item.title}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
              <UserTable
                data={response[0]?.data}
                bodyClass=""
                noClass={true}
                mutate={mutate}
                isValidating={isValidating}
              />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
              <UserCreationTable
                data={response[1]?.data}
                bodyClass=""
                noClass={true}
                mutate={mutate}
                isValidating={isValidating}
              />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Card>
  );
};

export default User;
