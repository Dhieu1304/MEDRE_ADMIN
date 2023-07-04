import PropTypes from "prop-types";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Box, Typography } from "@mui/material";

function ColumnChart({ title, series, categories, xLabel, yLabel, yaxisFormat }) {
  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: 16
        }}
      >
        {title}
      </Typography>
      <ReactApexChart
        options={{
          chart: {
            id: "mychart",
            type: "bar"
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            type: "category",
            categories,
            title: {
              text: xLabel,
              style: {
                fontSize: 16,
                fontWeight: 600
              }
            }
          },
          yaxis: {
            title: {
              text: yLabel,
              style: {
                fontSize: 16,
                fontWeight: 600
              }
            },
            labels: {
              formatter(value) {
                return yaxisFormat ? yaxisFormat(value) : value;
              }
            }
          }
        }}
        series={series}
        type="bar"
        height={350}
      />
    </Box>
  );
}

ColumnChart.defaultProps = {
  yaxisFormat: undefined
};

ColumnChart.propTypes = {
  title: PropTypes.string.isRequired,
  series: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  yaxisFormat: PropTypes.func
};

export default ColumnChart;
