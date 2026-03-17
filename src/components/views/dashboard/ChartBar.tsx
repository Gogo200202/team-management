import { Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import type { FunctionComponent } from "react";

type dataChartProps = {
  type: string;
  value: number;
};

interface ChartBarProps {
  userTaskChart: dataChartProps[];
  title: string;
  label: string;
}
export const ChartBar: FunctionComponent<ChartBarProps> = ({
  userTaskChart,
  title,
  label,
}) => {
  return (
    <>
      <Typography sx={{ textAlign: "center", fontSize: 30 }}>
        {title}
      </Typography>
      <BarChart
        dataset={userTaskChart}
        yAxis={[
          {
            disableTicks: true,
            scaleType: "band",
            width: 120,
            disableLine: true,
            dataKey: "type",
          },
        ]}
        xAxis={[
          {
            disableTicks: true,
            tickMinStep: 1,
          },
        ]}
        series={[{ dataKey: "value", label }]}
        layout="horizontal"
        height={250}
      />
    </>
  );
};
