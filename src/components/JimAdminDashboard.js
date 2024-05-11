import axios from "axios";
import React, { useEffect, useState } from "react";
import { App_host } from "../Data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faCoins,
  faCubes,
  faHourglassHalf,
  faIndianRupeeSign,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import PeakHoursChart from "./shared/PeakHoursChart";

const JimAdminDashboard = () => {
  const [activeUser, setActiveUser] = useState(0);
  const [totalUser, settotalUser] = useState(0);
  const [dashBoardData, setDashboardData] = useState();

  const token = localStorage.getItem("token");
  const activegym = localStorage.getItem("activegym");

  let user = JSON.parse(localStorage.getItem("user"));
  let getActiveUser = async () => {
    const activeuser = await axios.get(`${App_host}/attendence/getActiveUser`, {
      params: {
        jimId: activegym,
      },
      headers: {
        token: token,
      },
    });
    if (activeuser) {
      console.log();
      settotalUser(activeuser.data.data.total_users);
      setActiveUser(activeuser.data.data.active_users);
    }
  };

  const getPackagesList = async () => {
    try {
      const response = await axios.get(
        `${App_host}/earning/getDashboardDetails`,
        {
          headers: {
            token,
          },
        }
      );
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getActiveUser();
    getPackagesList();
  }, []);

  return (
    <>
      <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="row">
            <div className="col-xl-6 mb-4 col-lg-6 col-12">
              <div className="card">
                <div className="d-flex align-items-end row">
                  <div className="col-7">
                    <div className="card-body text-nowrap">
                      <h5 className="card-title mb-0 px-3">
                        Welcome {user.full_name}! 💪
                      </h5>
                      <p>{user?.BusinessLocation[0]?.name} </p>
                    </div>
                  </div>
                  <div className="col-5 text-center text-sm-left">
                    <div className="card-body pb-0 px-0 px-md-4">
                      <img
                        src="../assets/img/illustrations/card-advance-sale.png"
                        height="140"
                        alt="view sales"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 mb-4 col-lg-6 col-12">
              <div className="card h-100">
                <div className="card-header">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="card-title mb-0">Statistics</h5>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row gy-3">
                    <div className="col-md-6 col-6">
                      <div className="d-flex align-items-center">
                        <div className="badge rounded-pill bg-label-primary me-3 p-2">
                          <FontAwesomeIcon icon={faClockRotateLeft} />
                        </div>
                        <div className="card-info">
                          <h5 className="mb-0">{activeUser}</h5>
                          <small>Active Users</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-6">
                      <div className="d-flex align-items-center">
                        <div className="badge rounded-pill bg-label-info me-3 p-2">
                          <i className="ti ti-users ti-sm"></i>
                        </div>
                        <div className="card-info">
                          <h5 className="mb-0">{totalUser}</h5>
                          <small>Total Users</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-lg-3 mb-4">
                <div className="card card-border-shadow-primary">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2 pb-1">
                      <div className="avatar me-2">
                        <span className="avatar-initial rounded bg-label-primary">
                          <FontAwesomeIcon icon={faUserClock} />{" "}
                        </span>
                      </div>
                      <h4 className="ms-1 mb-0">{dashBoardData?.newRequest}</h4>
                    </div>
                    <p className="mb-1">New Requests</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3 mb-4">
                <div className="card card-border-shadow-warning">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2 pb-1">
                      <div className="avatar me-2">
                        <span className="avatar-initial rounded bg-label-warning">
                          <FontAwesomeIcon icon={faCoins} />
                        </span>
                      </div>
                      <h4 className="ms-1 mb-0">
                        {" "}
                        <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                        {dashBoardData?.monthlyEarning}
                      </h4>
                    </div>
                    <p className="mb-1">Monthly Earnings</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3 mb-4">
                <div className="card card-border-shadow-danger">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2 pb-1">
                      <div className="avatar me-2">
                        <span className="avatar-initial rounded bg-label-danger">
                          <FontAwesomeIcon icon={faHourglassHalf} />
                        </span>
                      </div>
                      <h4 className="ms-1 mb-0">
                        <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                        {dashBoardData?.monthlyPending}
                      </h4>
                    </div>
                    <p className="mb-1">Pending Payments</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3 mb-4">
                <div className="card card-border-shadow-info">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2 pb-1">
                      <div className="avatar me-2">
                        <span className="avatar-initial rounded bg-label-info">
                          <FontAwesomeIcon icon={faCubes} />
                        </span>
                      </div>

                      <h4 className="ms-1 mb-0">
                        {dashBoardData?.TotalPackages}
                      </h4>
                    </div>
                    <p className="mb-1">Total Packages</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-xl-12 mb-4">
              <div className="row">
                {/* <div className="card-body p-0">
                                    <div className="row row-bordered g-0">
                                        <div className="col-md-12 position-relative p-4"> */}
                <div className="col-12 ">
                  <h5 className="m-0 card-title">Peak Hours</h5>
                </div>
                <div
                  id="col-12"
                  className="mt-n1 col-12 col-md-6 mx-auto"
                  style={{
                    // width: "100%",
                    margin: "auto",
                    marginTop: "100px",
                  }}
                >
                  <PeakHoursChart />
                </div>
                {/* </div>

                                    </div>
                                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="content-backdrop fade"></div>
      </div>
    </>
  );
};

export default JimAdminDashboard;
