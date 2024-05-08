"use client";

import React from "react";
//import dynamic from "next/dynamic";
// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import useDarkMode from "@/hooks/useDarkMode";
import useWidth from "@/hooks/useWidth";
import ReactApexChart from "react-apexcharts";

const RadialsChart = ({ data }) => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();

  const anuladas = data.find((x) => x.status == "Anulada")?.count ?? 0;
  const borrador = data.find((x) => x.status == "Borrador")?.count ?? 0;
  const confirmadas = data.find((x) => x.status == "Confirmada")?.count ?? 0;

  const total = data.map((x) => x.count).reduce((a, b) => a + b, 0);

  const series = [
    (confirmadas * 100) / total,
    (borrador * 100) / total,
    (anuladas * 100) / total,
  ];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
            color: isDark ? "#CBD5E1" : "#475569",
          },
          value: {
            fontSize: "16px",
            color: isDark ? "#CBD5E1" : "#475569",
            formatter: (e) => {
              return `${(e * total) / 100} (${parseFloat(e).toFixed(2)}%)`;
            },
          },
          total: {
            show: true,
            label: "Total",
            color: isDark ? "#CBD5E1" : "#475569",
            formatter: () => total,
          },
        },
        track: {
          background: "#E2E8F0",
          strokeWidth: "97%",
        },
      },
    },
    labels: ["Confirmadas", "Borradores", "Anuladas"],
    colors: ["#22BB33", "#F0AD4E", "#BB2124"],
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={width > breakpoints.md ? 360 : 250}
      />
    </div>
  );
};

export default RadialsChart;
