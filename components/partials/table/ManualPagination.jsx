import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";

const ManualPagination = ({
  pageSize,
  serverPageIndex,
  setServerPageIndex,
  totalRows,
}) => {
  // Calculating max number of pages
  const pageIndex = parseInt(serverPageIndex);
  const rowsPerPage = parseInt(pageSize);
  const noOfPages = Math.ceil(totalRows / rowsPerPage);
  const regRange = `${Math.min(
    pageIndex * rowsPerPage + 1,
    totalRows
  )} - ${Math.min((pageIndex + 1) * rowsPerPage, totalRows)}`;

  // State variable to hold the current page. This value is
  // passed to the callback provided by the parent
  const [currentPage, setCurrentPage] = useState(pageIndex);

  // Navigation arrows enable/disable state
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);

  // Onclick handlers for the butons
  const onNextPage = () => setCurrentPage(currentPage + 1);
  const onPrevPage = () => setCurrentPage(currentPage - 1);
  const onPageSelect = (pageNo) => setCurrentPage(pageNo);

  useEffect(() => {
    if (pageIndex >= noOfPages) {
      setCurrentPage(0);
    }

    if (noOfPages == 0 || noOfPages === currentPage + 1) {
      setCanGoNext(false);
    } else {
      setCanGoNext(true);
    }
    if (noOfPages == 0 || currentPage === 0) {
      setCanGoBack(false);
    } else {
      setCanGoBack(true);
    }
  }, [noOfPages, currentPage]);

  useEffect(() => setServerPageIndex(currentPage), [currentPage]);

  return (
    <ul className="flex items-center space-x-3 rtl:space-x-reverse flex-wrap">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        <span>{regRange}</span>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {` de ${totalRows}`}
        </span>
      </span>
      <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
        <button
          className={` ${!canGoBack ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => onPageSelect(0)}
          disabled={!canGoBack}
        >
          <Icon icon="heroicons:chevron-double-left-solid" />
        </button>
      </li>
      <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
        <button
          className={` ${!canGoBack ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={onPrevPage}
          disabled={!canGoBack}
        >
          <Icon icon="heroicons:chevron-left-solid" />
        </button>
      </li>

      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        <span>
          {Math.min(pageIndex + 1, noOfPages)} de {noOfPages}
        </span>
      </span>
      <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
        <button
          className={` ${!canGoNext ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={onNextPage}
          disabled={!canGoNext}
        >
          <Icon icon="heroicons:chevron-right-solid" />
        </button>
      </li>
      <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
        <button
          onClick={() => onPageSelect(noOfPages - 1)}
          disabled={!canGoNext}
          className={` ${!canGoNext ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Icon icon="heroicons:chevron-double-right-solid" />
        </button>
      </li>
    </ul>
  );
};
export default ManualPagination;
