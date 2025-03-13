import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { menuItems } from "@/constant/data";
import Icon from "@/components/ui/Icon";

const Breadcrumbs = () => {
  const location = usePathname();

  const [isHide, setIsHide] = useState(null);
  const [groupTitle, setGroupTitle] = useState("");
  const [prevTitle, setPrevTitle] = useState({ title: null, link: null });
  const [title, setTitle] = useState("");

  useEffect(() => {
    //CASO ESPECIAL
    const found = location?.match("os/[^/]+/containers");
    if (found) {
      setGroupTitle("Documentos");
      setPrevTitle({ title: "Órdenes de Servicio", link: "/os" });
      setTitle("Contenedores");
      return;
    }

    const currentMenuItem = menuItems.find((item) => item.link === location);

    const currentChild = menuItems.find((item) =>
      item.child?.find((child) => child.childlink === location)
    );

    if (currentMenuItem) {
      setIsHide(currentMenuItem.isHide);
      setTitle(currentMenuItem?.title);
    } else if (currentChild) {
      setIsHide(currentChild?.isHide || false);
      setGroupTitle(currentChild?.title);
      setTitle(
        currentChild.child?.find((child) => child.childlink === location)
          ?.childtitle
      );
    }
  }, [location, location]);

  return (
    <>
      {!isHide ? (
        <div className="md:mb-6 mb-4 flex space-x-3 rtl:space-x-reverse">
          <ul className="breadcrumbs">
            <li className="text-primary-500">
              <Link href="/dashboard" className="text-lg">
                <Icon icon="heroicons-outline:home" />
              </Link>
              <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
                <Icon icon="heroicons:chevron-right" />
              </span>
            </li>
            {groupTitle && (
              <li className="text-slate-500">
                <button type="button" className="capitalize">
                  {groupTitle}
                </button>
                <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
                  <Icon icon="heroicons:chevron-right" />
                </span>
              </li>
            )}

            {prevTitle.title && (
              <li className="text-primary-500">
                <Link href={prevTitle.link}>{prevTitle.title}</Link>
                <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
                  <Icon icon="heroicons:chevron-right" />
                </span>
              </li>
            )}

            <li className="capitalize text-slate-500 dark:text-slate-400">
              {title}
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
};

export default Breadcrumbs;
