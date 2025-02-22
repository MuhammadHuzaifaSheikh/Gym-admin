import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { App_host } from "../Data";
import UserDetails from "./UserDetail";
import { string } from "yup";







const Table = ({ data, pagination, onPageChange, reloadUsers, type, all, }) => {
  const { page, totalPages } = pagination;
  let token = localStorage.getItem("token");
  const [showDetails, setShowDetails] = useState(false);
  const [detailsData, setDetailsData] = useState(null);


  const activegym = localStorage.getItem("activegym");



  const handleUpdate = async (type, status, id, field) => {
    try {
      console.log("id:", id);
      const changeStatus = status === "active" ? "inactive" : "active";
      const changePaymentStatus = status === "paid" ? "unpaid" : "paid";
      console.log("inside the app");

      const endpoint = "/user/updateUserStatus";

      const response = await axios.put(
        `${App_host}${endpoint}`,
        {
          [field]: field === 'status' ? changeStatus : changePaymentStatus,
          gymId: activegym,
          id: id,
        },
        {
          headers: {
            token,
          },
        }
      );

      console.log("response:", response);

      if (response?.data?.success) {
        toast.success(` updated successfully!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        reloadUsers();
      } else {
        toast.error("An Error Occurred", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "An Error Occurred", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };
  let HandleDeleteUser = async (id) => {

    console.log("ssdsdsdsd", id)
    try {
      const response = await axios.put(
        `${App_host}/user/deleteUser`,
        {
          id: id,
        },
        {
          headers: {
            token,
          },
        }
      );
      console.log("also got the response ", response);

      if (response?.data?.success) {
        toast.success("User Deleted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        reloadUsers();
      } else {
        toast.error("An Error Occured ", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log("error.response.data.message", error);
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  let handleShowDeatils = (data = null) => {
    setDetailsData(data);
    setShowDetails(!showDetails);
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );


  console.log("page", page)

  return (
    <div>


      <CustomTable />
      <UserDetails
        showDetails={showDetails}
        handleShowDeatils={handleShowDeatils}
        Data={detailsData}
        type={type == "jim" ? "jim" : "user"}
      />
      <nav className="px-4">
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </button>
          </li>
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${page === number ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(number)}
              >
                {number}
              </button>
            </li>
          ))}
          <li className={`page-item ${page < totalPages ? "" : "disabled"}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      <ToastContainer />
    </div>
  );

  function CustomTable() {



    return <table
      className="dt-multilingual table dataTable no-footer dtr-column"
      id="DataTables_Table_3"
      aria-describedby="DataTables_Table_3_info"
      style={{ width: "1045px" }}
    >
      <thead>
        <tr>
          <th
            className="control sorting_disabled sorting_asc dtr-hidden"
            rowSpan="1"
            colSpan="1"
            style={{ width: "0px", display: "none" }}
            aria-label=""
          ></th>
          {type === "jim" ? (
            <th
              className="sorting"
              tabIndex="0"
              aria-controls="DataTables_Table_3"
              rowSpan="1"
              colSpan="1"
              style={{ width: "79px" }}
              aria-label="Name: aktivieren, um Spalte aufsteigend zu sortieren"
            >
              Gym Name
            </th>
          ) : (
            <th
              className="sorting"
              tabIndex="0"
              aria-controls="DataTables_Table_3"
              rowSpan="1"
              colSpan="1"
              style={{ width: "79px" }}
              aria-label="Name: aktivieren, um Spalte aufsteigend zu sortieren"
            >
              Name
            </th>
          )}
          <th
            className="sorting"
            tabIndex="0"
            aria-controls="DataTables_Table_3"
            rowSpan="1"
            colSpan="1"
            style={{ width: "122px" }}
            aria-label="Contact: aktivieren, um Spalte aufsteigend zu sortieren"
          >
            Contact
          </th>

          {type === "jim" && (
            <th
              className="sorting"
              tabIndex="0"
              aria-controls="DataTables_Table_3"
              rowSpan="1"
              colSpan="1"
              style={{ width: "229px" }}
              aria-label="Email: aktivieren, um Spalte aufsteigend zu sortieren"
            >
              City
            </th>
          )}

          <th
            className="sorting"
            tabIndex="0"
            aria-controls="DataTables_Table_3"
            rowSpan="1"
            colSpan="1"
            style={{ width: "229px" }}
            aria-label="Email: aktivieren, um Spalte aufsteigend zu sortieren"
          >
            Email
          </th>
          <th
            className="sorting"
            tabIndex="0"
            aria-controls="DataTables_Table_3"
            rowSpan="1"
            colSpan="1"
            style={{ width: "75px" }}
            aria-label="Date: aktivieren, um Spalte aufsteigend zu sortieren"
          >
            Date
          </th>

          {type !== 'admin' && <>

            <th
              className="sorting"
              tabIndex="0"
              aria-controls="DataTables_Table_3"
              rowSpan="1"
              colSpan="1"
              style={{ width: "90px" }}
              aria-label="Status: aktivieren, um Spalte aufsteigend zu sortieren"
            >
              Status
            </th>
            <th
              className="sorting"
              tabIndex="0"
              aria-controls="DataTables_Table_3"
              rowSpan="1"
              colSpan="1"
              style={{ width: "90px" }}
              aria-label="Status: aktivieren, um Spalte aufsteigend zu sortieren"
            >
              Payment
            </th>


          </>}


          {type === 'admin' && <th
            className="sorting"
            tabIndex="0"
            aria-controls="DataTables_Table_3"
            rowSpan="1"
            colSpan="1"
            style={{ width: "90px" }}
            aria-label="Status: aktivieren, um Spalte aufsteigend zu sortieren"
          >
            Gyms
          </th>
          }




          {type !== "admin" ? (
            <th
              className="sorting_disabled"
              rowSpan="1"
              colSpan="1"
              style={{ width: "65px" }}
              aria-label="Actions"
            >
              Actions
            </th>
          ) : (
            ""
          )}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          <>
            {data.map((user, index) => {


              const gymId = localStorage.getItem("activegym");
              const status = user?.BusinessLocation?.find((v) => v?.Gym === gymId)?.status
              const payment_status = user?.BusinessLocation?.find((v) => v?.Gym === gymId)?.payment_status


              return (
                <>


                  <tr className="odd">
                    <td
                      className="control sorting_1 dtr-hidden"
                      tabIndex="0"
                      style={{ display: "none" }}
                    ></td>
                    {type === "jim" ? (
                      <td>{user.name}</td>
                    ) : (
                      <td>{user.full_name}</td>
                    )}
                    <td>{user.phone}</td>
                    {type === "jim" && (
                      <td>{user.city}</td>
                    )}

                    <td>{user?.email}</td>
                    <td className="" style={{}}>
                      {new Date(user.createdAt).toDateString()}
                    </td>


                    {type !== 'admin' && <>
                      <td className="" style={{}}>
                        <span
                          className="badge text-uppercase bg"
                          style={{
                            backgroundColor: type === 'jim' ? user?.status == "active" ? "green" : "red" : status == "active" ? "green" : "red",
                          }}
                        >
                          {type === 'jim' ? user?.status : status}
                        </span>
                      </td>
                      <td className="" style={{}}>
                        <span
                          className="badge  text-uppercase"
                          style={{
                            backgroundColor: type === 'jim' ? user?.payment_status == "active" ? "green" : "red" : payment_status == "active" ? "green" : "red",
                          }}
                        >
                          {type === 'jim' ? user?.payment_status : payment_status}
                        </span>
                      </td>

                    </>}


                    {type === 'admin' && <td
                      className="sorting"
                      tabIndex="0"
                      aria-controls="DataTables_Table_3"
                      rowSpan="1"
                      colSpan="1"
                      style={{ width: "90px" }}
                      aria-label="Status: aktivieren, um Spalte aufsteigend zu sortieren"
                    >
                      {user?.BusinessLocation.map((item,index)=> <div key={index} ><p > {item?.gymDetails?.name},   </p></div> )}
                    </td>
                    }

                    {type !== "admin" && <td className="" style={{}}>

                      <div className="d-inline-block">
                        <a
                          href="javascript:;"
                          className="btn btn-sm btn-icon dropdown-toggle hide-arrow"
                          data-bs-toggle="dropdown"
                        >
                          <i className="text-primary ti ti-dots-vertical"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end m-0">
                          <a
                            className="dropdown-item cursor-pointer"
                            onClick={() => handleUpdate(
                              type,
                              status,
                              type === "jim"
                                ? user.Owner.toString()
                                : user._id.toString(),
                              'status'
                            )}
                          >
                            {status == "active" ? "inactive" : all ? "Active" : "Approve"}
                          </a>
                          <div className="dropdown-divider"></div>

                          <a
                            className="dropdown-item cursor-pointer"
                            onClick={() => handleUpdate(
                              type,
                              payment_status,
                              type === "jim"
                                ? user.Owner.toString()
                                : user._id.toString(),
                              'payment_status'
                            )}
                          >
                            {payment_status == "paid" ? "unpaid" : "paid"}
                          </a>
                          <div className="dropdown-divider"></div>
                          <a
                            className="dropdown-item cursor-pointer"
                            onClick={() => handleShowDeatils(user)}
                          >
                            Details
                          </a>
                          <div className="dropdown-divider"></div>
                          <a
                            className="dropdown-item text-danger delete-record cursor-pointer"
                            onClick={() => HandleDeleteUser(
                              type === "jim"
                                ? user.Owner.toString()
                                : user._id.toString()
                            )}
                          >
                            Delete
                          </a>
                        </div>
                      </div>

                    </td>}



                  </tr>

                </>


              );
            })}
          </>
        ) : (
          <>
            <div className="odd d-flex justify-cntent-center">
              No data Found
            </div>
          </>
        )}
      </tbody>
    </table>;
  }
};




export default Table;
