import React from "react";
import Link from "next/link";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center py-20 dark:bg-slate-900">
      <img src="/assets/images/all-img/404-2.svg" alt="" />
      <div className="max-w-[546px] mx-auto w-full mt-12">
        <h4 className="text-slate-900 mb-4">Página no encontrada</h4>
        <div className="dark:text-white text-base font-normal mb-10">
          La página que está buscando no existe, cambió de nombre o no se
          encuentra disponible.
        </div>
      </div>
      <div className="max-w-[300px] mx-auto w-full">
        <Link
          href="/dashboard"
          className="btn bg-white hover:bg-opacity-75 transition-all duration-150 block text-center"
        >
          Volver a Inicio
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
