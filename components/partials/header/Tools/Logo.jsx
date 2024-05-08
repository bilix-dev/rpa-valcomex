"use client";

import React, { Fragment, useMemo } from "react";
import useDarkMode from "@/hooks/useDarkMode";
import Link from "next/link";
import useWidth from "@/hooks/useWidth";
import { MainLogo } from "../../sidebar/Logo";

// const Logo = () => {
//   const [isDark] = useDarkMode();
//   const { width, breakpoints } = useWidth();

//   return (
//     <div>
//       <Link href="/">
//         <React.Fragment>
//           {width >= breakpoints.xl ? (
//             <img
//               src={
//                 isDark
//                   ? "/assets/images/logo/logo-white.svg"
//                   : "/assets/images/logo/logo.svg"
//               }
//               alt=""
//             />
//           ) : (
//             <img
//               src={
//                 isDark
//                   ? "/assets/images/logo/logo-c-white.svg"
//                   : "/assets/images/logo/logo-c.svg"
//               }
//               alt=""
//             />
//           )}
//         </React.Fragment>
//       </Link>
//     </div>
//   );
// };

const Logo = () => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();
  return (
    <div>
      <Link href="/">
        <MainLogo width={40} />
      </Link>
    </div>
  );
};

export default Logo;
