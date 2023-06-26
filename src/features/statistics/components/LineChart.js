import PropTypes from "prop-types";
import Chart from "react-apexcharts";

function LineChart({ data }) {
  const options = {
    chart: {
      id: "mychart"
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm"
        }
      }
    },
    yaxis: {
      title: {
        text: "Total"
      }
    }
  };

  const series = [
    {
      name: "Total",
      data: data?.map((item) => [new Date(item.time).getTime(), parseInt(item.total, 10)])
    }
  ];

  return <Chart options={options} series={series} type="line" height="100%" />;
}

LineChart.propTypes = {
  data: PropTypes.array.isRequired
};

export default LineChart;
