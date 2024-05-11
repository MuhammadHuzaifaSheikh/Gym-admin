import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { App_host } from '../../Data';

const PeakHoursBars = () => {
  const [peakHoursData, setPeakHoursData] = useState({
    '12:00-15:59': 15,
    '16:00-19:59': 20,
    '20:00-23:59': 18,
    '00:00-03:59': 8,
    '04:00-07:59': 12,
    '08:00-11:59': 10,
  });
  const [maxActiveUsers, setMaxActiveUsers] = useState(0);
  const token = localStorage.getItem('token');
  const activegym = localStorage.getItem('activegym');

  useEffect(() => {
    const fetchPeakHoursData = async () => {
      try {
        const response = await axios.get(`${App_host}/attendence/getPeakHoursData`, {
          params: {
            jimId: activegym
          },
          headers: {
            token: token
          }
        });
        const data = response.data.data;
        console.log("const data = response.data.data;",response.data.data)
        // setPeakHoursData(data);
        // console.log(peakHoursData)

        const values = Object.values(peakHoursData);
        const maxQuantity = Math.max(...values);
        setMaxActiveUsers(maxQuantity);
      } catch (error) {
        console.error('Error fetching peak hours data:', error);
      }
    };

    fetchPeakHoursData();
  }, [activegym, token]);

  return (
    <div className="text-white p-3" style={{ width: "100%", backgroundColor: "rgb(237 237 237)", borderRadius: "1rem", height: "100%" }}>
      <h5 style={{ fontSize: "14px" }}>Max Active Users: <span style={{ color: "#5951FF" }}>{maxActiveUsers}</span></h5>
      <div className="row p-2">
        <div className="col-2 d-flex align-items-end flex-column justify-content-between" style={{ fontSize: "10px", marginBottom: "1rem",color:'black' }}>
          <label>{maxActiveUsers}</label>
          <label>{Math.round((3 / 4) * maxActiveUsers)}</label>
          <label>{Math.round((2 / 4) * maxActiveUsers)}</label>
          <label>{Math.round((1 / 4) * maxActiveUsers)}</label>
          <label>0</label>
        </div>
        <div className='col-10'>
          <div className="row col-12">
            {Object.entries(peakHoursData).map(([label, activeUsers], index) => (
              <div key={index} className="col-2 mb-3">
                <div className="d-flex flex-column align-items-center">
                  <div className="progress" style={{ height: '26vh', width: "5px", backgroundColor: "#5951FF" }}>
                    <div className="progress-bar" role="progressbar" style={{ width: "100%", height: `${(1 - activeUsers / maxActiveUsers) * 100}%`, backgroundColor: "#161C27" }}></div>
                  </div>
                  <div style={{ fontSize: "8px" , color:'black'}}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeakHoursBars;
