import React from "react";
import useFooterType from "@/hooks/useFooterType";
import { useSystemData } from "@/context/AuthProvider";
import { dateDiff, dayMessage, toFormatDateTime } from "@/helpers/helper";

const Validity = ({ data }) => {
  if (data.expiration == null)
    return (
      <span className="text-success-500 italic">
        Licencia permanente desde {toFormatDateTime(data.createdAt, false)}.
      </span>
    );

  const dayDiff = dateDiff(new Date(), new Date(data.expiration));

  if (new Date(data.expiration) > new Date())
    return (
      <span
        className={`text-${
          dayDiff <= process.env.NEXT_PUBLIC_EXPIRATION_DAYS_LIMIT
            ? "warning"
            : "success"
        }-500 italic`}
      >
        {`Licencia válida desde ${toFormatDateTime(
          data.createdAt,
          false
        )} hasta el 
        ${toFormatDateTime(data.expiration, false)}. ${dayMessage(dayDiff)}`}
      </span>
    );
};

const Footer = ({ className = "custom-class" }) => {
  const { operator } = useSystemData();

  const [footerType] = useFooterType();
  const footerclassName = () => {
    switch (footerType) {
      case "sticky":
        return "sticky bottom-0 z-[999]";
      case "static":
        return "static";
      case "hidden":
        return "hidden";
    }
  };

  return (
    <footer className={className + " " + footerclassName()}>
      <div className="site-footer px-6 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 py-4">
        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-5">
          <div className="text-center ltr:md:text-start rtl:md:text-right text-sm">
            {/* <Validity data={operator} /> */}
          </div>
          <div className="ltr:md:text-right rtl:md:text-end text-center text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://www.bilix.cl"
              target="_blank"
              className="text-primary-500 font-semibold"
            >
              Bilix Ingeniería
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
