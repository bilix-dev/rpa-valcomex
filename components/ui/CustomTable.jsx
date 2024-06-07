import React from "react";

export const CustomTable = ({ headers, data }) => (
  <div className="overflow-x-auto ">
    <div className="inline-block min-w-full align-middle">
      <div className="overflow-hidden ">
        <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
          <thead className="bg-slate-200 dark:bg-slate-700">
            <tr>
              {headers?.map((row, i) => (
                <th key={i} scope="col" className=" table-th ">
                  {row}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
            {data?.map((row, i) => (
              <tr key={i} className=" even:bg-slate-200 dark:even:bg-slate-700">
                {row.map((r, i) => {
                  let cell = undefined;
                  if (r instanceof Date) {
                    cell = toFormatDateTime(r);
                  } else if (React.isValidElement(r)) {
                    cell = r;
                  } else if (r instanceof Date) cell = undefined;
                  else {
                    cell = r;
                  }
                  return (
                    <td key={i} className="table-td normal-case">
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default CustomTable;
