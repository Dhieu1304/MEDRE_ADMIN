import { useAppConfigStore } from "../../store/AppConfigStore/hooks";
import "../../config/i18n";
import React, { useState } from "react";
import Chart from "react-apexcharts";
function HomePage() {
  const { mode, locale } = useAppConfigStore();
  const [state, setState] = useState({
    options: {
      colors: ["#E91E63", "#FF9800"],
      chart: {
        id: "staff",
      },
      xaxis: {
        categories: ["01/2023", "02/2023","03/2023","04/2023","05/2023"],
      },
    },
    series: [
      {
        name: "Staff Online",
        data: [40, 42, 41, 45, 45],
      },
      {
        name: "Staff Offline",
        data: [60, 55, 53, 58, 60],
      },
    ],
  });
  const [state2, setState2] = useState({
    series: [90, 70, 50, 60, 100, 120, 100],
        options: {
          chart: {
            width: 380,
                type: 'pie',
             },
              labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhạt'],
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            },
  });
  const [state3, setState3] = useState({
    series: [{
      name: 'KHÁM ONLINE',
      data: [44, 55, 41, 67, 22, 43]
    }, {
      name: 'KHÁM OFFLINE',
      data: [13, 23, 20, 8, 13, 27]
    }, {
      name: 'HỦY LỊCH',
      data: [11, 17, 15, 15, 21, 14]
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            }
          }
        },
      },
      xaxis: {
        // type: 'datetime',
        categories: ['01/2023', '02/2023', '03/2023', '04/2023',
          '05/2023', '06/2023'],
      },
      legend: {
        position: 'right',
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    },
   });
  return (
    <div className="row">
      <div>
        <h3>Số lượng nhân viên của phòng khám</h3>
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="450"
          />
        </div>
        <div>
        <h3>Số lượng nhân viên của phòng khám</h3>
          <Chart
            options={state.options}
            series={state.series}
            type="line"
            width="450"
          />
        </div>
        <div>
        <h3>Tỉ lệ khám bệnh theo ngày trong tuần</h3>
        <Chart
            options={state2.options}
            series={state2.series}
            type="pie"
            width="450"
          />
        </div>
        <div>
        <h3>Bảng thống kê số lượt đặt lịch</h3>
        <Chart
            options={state3.options}
            series={state3.series}
            type="bar"
            width="450"
          />
        </div>
        
    </div>
  );
}

export default HomePage;
