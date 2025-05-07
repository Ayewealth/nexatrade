// components/AreaChart.js
"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AreaChart = () => {
  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#007bff"], // Blue line
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        shadeIntensity: 1,
        gradientToColors: ["#007bff"],
        opacityFrom: 0.5,
        opacityTo: 0,
      },
    },
    xaxis: {
      categories: ["Feb", "Apr", "Jun", "Aug", "Oct", "Dec"],
      labels: {
        show: true,
        style: { colors: "#fff" },
      },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      enabled: true,
    },
    theme: {
      mode: "dark",
    },
  };

  const series = [
    {
      name: "Total Assets",
      data: [0, 10, 50, 10, 0, 0],
    },
  ];

  return <Chart options={options} series={series} type="area" height={100} />;
};

export default AreaChart;
