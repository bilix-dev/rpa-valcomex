import Link from "next/link";

const LeftSide = ({ isDark }) => (
  <>
    <div className="max-w-[520px] pt-10 ltr:pl-20 rtl:pr-20">
      <Link href="/">
        <img
          src={
            isDark
              ? "/assets/images/logo-full-white.png"
              : "/assets/images/logo-full-black.png"
          }
          alt=""
          className="mb-10"
          width={200}
        />
      </Link>
    </div>
    <div className="absolute left-0 2xl:bottom-[-50px] bottom-[-130px] h-full w-full z-[-1]">
      <img
        src="/assets/images/auth/container.png"
        alt=""
        className="h-full w-full object-contain"
      />
    </div>
  </>
);

export default LeftSide;
