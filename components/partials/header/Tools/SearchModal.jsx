import React, { Fragment, useMemo, useRef, useState } from "react";
import { Dialog, Transition, Combobox } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import Fuse from "fuse.js";
import useSWRGet from "@/hooks/useSWRGet";
import useDarkmode from "@/hooks/useDarkMode";
import { useSystemData } from "@/context/AuthProvider";
import { CONTAINER_STATUS, toFormatContainer } from "@/helpers/helper";
import { useRouter } from "next/navigation";
import CellStatus from "@/components/ui/CellStatus";

const initialParams = {
  pageSize: 50,
  search: "",
};

const SearchModal = () => {
  const router = useRouter();
  const { operator } = useSystemData();
  let [isOpen, setIsOpen] = useState(false);
  const [isDark] = useDarkmode();

  const [selected, setSelected] = useState(null);
  const [params, setParams] = useState(initialParams);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const { data: response, mutate } = useSWRGet(
    [`/search/operator/${operator.id}`, params],
    {
      compare: (a, b) =>
        JSON.stringify({ ...a?.data }) == JSON.stringify({ ...b?.data }),
      onSuccess: (response) => {
        const update = response?.data?.find((x) => x.id == selected?.id);
        if (update) {
          setSelected(update);
        }
      },
    }
  );

  let filteredsearchList = useMemo(
    () =>
      new Fuse(response?.data ?? [], {
        threshold: 0.2,
        includeScore: true,
        keys: ["serviceOrder.code", "name"],
      })
        .search(params.search)
        .map((item) => item.item),
    [response?.data, params]
  );

  return (
    <>
      <div>
        <button
          className="flex items-center xl:text-sm text-lg xl:text-slate-400 text-slate-800 dark:text-slate-300 px-1 space-x-3 rtl:space-x-reverse"
          onClick={openModal}
        >
          <>
            <Icon icon="heroicons-outline:search" />
            <span className="xl:inline-block hidden">Buscar...</span>
          </>
        </button>
      </div>

      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={`${
            isDark ? "dark" : "light"
          } fixed inset-0 z-[9999] overflow-y-auto p-4 md:pt-[25vh] pt-20`}
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-filter backdrop-blur-sm backdrop-brightness-10" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel>
              <Combobox onChange={setSelected}>
                <div className="relative">
                  <div className="relative mx-auto max-w-xl rounded-md bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-gray-500-500 dark:ring-light divide-y divide-gray-500-300 dark:divide-light">
                    <div className="flex bg-white dark:bg-slate-800  px-3 rounded-md py-3 items-center">
                      <div className="flex-0 mr-2 text-slate-700 dark:text-slate-300 ltr:pr-2 rtl:pl-2 text-lg">
                        <Icon icon="heroicons-outline:search" />
                      </div>
                      <Combobox.Input
                        className="bg-transparent outline-none focus:outline-none border-none w-full flex-1 dark:placeholder:text-slate-300 dark:text-slate-200"
                        placeholder="Buscar..."
                        onChange={(event) =>
                          setParams((state) => ({
                            ...state,
                            search: event.target.value?.replace("-", ""),
                          }))
                        }
                      />
                    </div>
                    <Transition
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Combobox.Options className="max-h-80 overflow-y-auto text-sm py-2">
                        {filteredsearchList.length === 0 &&
                          params.search !== "" && (
                            <div>
                              <div className=" text-base py-2 px-4">
                                <p className="text-slate-500 text-base dark:text-white">
                                  No hay coincidencias
                                </p>
                              </div>
                            </div>
                          )}
                        {filteredsearchList.map((item, i) => (
                          <Combobox.Option key={i} value={item}>
                            {({ active }) => {
                              let status = item.status;
                              const isAnyError = item.containerEndpoints.some(
                                (x) => x.error
                              );
                              if (isAnyError) status = CONTAINER_STATUS.ERROR;

                              return (
                                <div
                                  className={`px-4 text-[15px] font-normal capitalize py-2 ${
                                    active
                                      ? "bg-slate-900 dark:bg-slate-600 dark:bg-opacity-60 text-white"
                                      : "text-slate-900 dark:text-white"
                                  }`}
                                  onClick={() => {
                                    closeModal();
                                    router.push(
                                      `/os/${item.serviceOrderId}/containers`
                                    );
                                  }}
                                >
                                  <div className="flex flex-row items-center gap-5 justify-between">
                                    <div className="flex flex-col flex-1 gap-1">
                                      <div className="flex justify-between">
                                        <div className="text-slate-500 font-semibold">
                                          OS:
                                        </div>
                                        <div>{item.serviceOrder.code}</div>
                                      </div>

                                      <div className="flex justify-between">
                                        <div className="text-slate-500 font-semibold">
                                          Contenedor:
                                        </div>
                                        <div>
                                          {toFormatContainer(item.name)}
                                        </div>
                                      </div>
                                      <div className="flex justify-between">
                                        <div className="text-slate-500 font-semibold">
                                          Estado:
                                        </div>
                                        <div>
                                          <CellStatus text={status} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    </Transition>
                  </div>
                </div>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default SearchModal;
