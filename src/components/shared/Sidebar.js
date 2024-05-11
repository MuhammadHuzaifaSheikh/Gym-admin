import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faChevronRight,
  faCircle,
  faCloud,
  faCoins,
  faCube,
  faCubes,
  faDumbbell,
  faEnvelope,
  faHome,
  faIndianRupeeSign,
  faPhoneVolume,
  faSquarePlus,
  faUserClock,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const Sidebar = ({ handleShowNav }) => {
  const [isActiveGymsOpen, setIsActiveGymsOpen] = useState(false);
  const [isActiveEarningsOpen, setIsActiveEarningsOpen] = useState(false);
  const [changeactiveGym, setChangeactiveGym] = useState(false);
  const role = localStorage.getItem("role");
  const location = useLocation();
  let user = JSON.parse(localStorage.getItem("user"));
  let activegym = localStorage.getItem("activegym");
  let JimsList = [];
  if (!user.isAdmin && !user.isJimAdmin) {
    user.BusinessLocation.forEach((Gym) => {
      JimsList.push({
        label: `${Gym.Gym.name}`,
        icon: faCircle,
        itemId: Gym.Gym._id.toString(),
        is_Active: activegym == Gym.Gym._id.toString() ? true : false,
      });
    });
  }
  // Define menu items based on user roles
  const menuItems = {
    admin: [
      { label: "Dashboard", link: "/", icon: faHome },
      {
        label: "Active Gyms",
        submenu: [
          { label: "Gyms", link: "/gyms" },
          { label: "Gym Users", link: "/gym-users" },
        ],
        icon: faDumbbell,
      },
      { label: "New Gym Request", link: "/new-gym-request", icon: faUserClock },
      { label: "Add New Gym", link: "/add-new-jim", icon: faSquarePlus },
      { label: "Packages", link: "/admin-packages", icon: faCubes },
      { label: "Earnings", link: "/earning", icon: faIndianRupeeSign },
      { label: "Contact Queries", link: "/admin-contact", icon: faPhoneVolume },
    ],
    jimAdmin: [
      { label: "Dashboard", link: "/", icon: faHome },
      { label: "All Members", link: "/all-member", icon: faUsers },
      { label: "New Requests", link: "/new-request", icon: faUserClock },
      { label: "Add new Members", link: "/add-new-member", icon: faUserPlus },
      { label: "Packages", link: "/newpackages", icon: faCubes },
      { label: "Earnings", link: "/earning", icon: faIndianRupeeSign },
      { label: "Contact Support", link: "/contact", icon: faPhoneVolume },
    ],
    user: [
      {
        label: "Switch Gym",
        submenu: JimsList,
        icon: faDumbbell,
      },
      { label: "Dashboard", link: "/", icon: faHome },
      { label: "Packages", link: "/newpackages", icon: faCubes },
      { label: "Other Gyms", link: "/Other-jims", icon: faCloud },
    ],
  };

  const toggleActiveGyms = () => {
    setIsActiveGymsOpen(!isActiveGymsOpen);
    setIsActiveEarningsOpen(!isActiveEarningsOpen);
  };
  console.log(
    "isActiveGymsOpenisActiveGymsOpenisActiveGymsOpen",
    isActiveGymsOpen
  );
  let handleActiveGym = (gymId) => {
    localStorage.removeItem("activegym");
    localStorage.setItem("activegym", gymId);
    let [gymdetail] = user.BusinessLocation.filter((location) => {
      return location.Gym._id.toString() == gymId;
    });
    if (gymdetail) {
      localStorage.setItem("gymDetail", JSON.stringify(gymdetail.Gym));
    }
    setChangeactiveGym(!changeactiveGym);
  };

  const renderMenuItems = (items) => {
    return items.map((item, index) => {
      const isActive = location.pathname === item.link;

      return (
        <li className={`menu-item ${isActive ? "active" : ""}`} key={index}>
          {item.submenu ? (
            <a
              className="menu-link menu-toggle"
              onClick={() => {
                toggleActiveGyms();
              }}
            >
              <FontAwesomeIcon icon={item.icon} className="menu-icon" />
              <div className="d-flex justify-content-between w-100">
                {item.label}{" "}
                {!isActiveGymsOpen ? (
                  <FontAwesomeIcon icon={faChevronRight} />
                ) : (
                  <FontAwesomeIcon icon={faAngleDown} />
                )}
              </div>
            </a>
          ) : (
            <Link to={item.link} onClick={handleShowNav} className="menu-link">
              <FontAwesomeIcon icon={item.icon} className="menu-icon" />
              <div>{item.label}</div>
            </Link>
          )}
          {isActiveGymsOpen && item.submenu && (
            <ul className="">
              {item.submenu.map((subItem, subIndex) => {
                const isSubActive = location.pathname === subItem.link;
                return (
                  <>
                    {!subItem.link ? (
                      <li
                        className={`menu-item ${
                          subItem.is_Active ? "active" : ""
                        }`}
                        key={subIndex}
                      >
                        <div
                          onClick={() => {
                            handleActiveGym(subItem.itemId);
                          }}
                          className="menu-link "
                        >
                          {" "}
                          {subItem.label}
                        </div>
                      </li>
                    ) : (
                      <>
                        <li
                          className={`menu-item ${isSubActive ? "active" : ""}`}
                          key={subIndex}
                        >
                          <Link
                            to={subItem.link}
                            onClick={handleShowNav}
                            className="menu-link"
                          >
                            {" "}
                            <div>{subItem.label}</div>
                          </Link>
                        </li>
                      </>
                    )}
                  </>
                );
              })}
            </ul>
          )}
          {/* {isActiveEarningsOpen && item.submenu && (
                        <ul className="">
                            {item.submenu.map((subItem, subIndex) => (
                                <li className="menu-item" key={subIndex}>
                                    <div onClick={() => handleActiveGym(subItem.itemId)} className='menu-link'>  {subItem.label}</div>
                                </li>
                            ))}
                        </ul>
                    )} */}
        </li>
      );
    });
  };

  return (
    <aside
      id="layout-menu"
      className={`layout-menu menu-vertical menu bg-menu-theme pt-4 show layout-menu-expanded`}
    >
      <div className="app-brand demo mb-4">
        <Link to="/" className="app-brand-link">
          <span className="app-brand-logo demo">
            <svg
              width="32"
              height="22"
              viewBox="0 0 32 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                fill="#7367F0"
              ></path>
              <path
                opacity="0.06"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                fill="#161616"
              ></path>
              <path
                opacity="0.06"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                fill="#161616"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                fill="#7367F0"
              ></path>
            </svg>
          </span>
          <span className="app-brand-text demo menu-text fw-bold">
            FlexFlow
          </span>
        </Link>
        {/* Menu toggle button (responsive) */}
        <a
          href="javascript:void(0);"
          className="layout-menu-toggle menu-link text-large ms-auto"
        >
          <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
          <i
            className="ti ti-x d-block d-xl-none ti-sm align-middle"
            onClick={handleShowNav}
          ></i>
        </a>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {menuItems[role] && renderMenuItems(menuItems[role])}
      </ul>
    </aside>
  );
};

export default Sidebar;
