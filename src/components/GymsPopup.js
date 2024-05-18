import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { App_host } from '../Data';
import { Link } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';

const GymsPopup = ({ showPackages, handleShowpackage, gymid }) => {
    const [showModal, setShowModal] = useState(false);
    const [packagesData, SetPackagesData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const activegym = localStorage.getItem("activegym")
    let user = JSON.parse(localStorage.getItem('user'))
    let token = localStorage.getItem('token')

    const [filterPackages, setFilterPackages] = useState(user.isJimAdmin ? "mypackages" : null);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };
    const handlePageChange = (page) => {
        setPage(page);
    };
    let params = {
        page,
        limit,
        search: search.trim(),
        BusinessLocation: gymid,
        is_jim_package: true
    }

    console.log("000000000000000000000", packagesData)

    const getPackagesList = async () => {
        try {
            const response = await axios.get(`${App_host}/packages/getPackages`, {
                params: params,
                headers: {
                    token,
                },
            });
            console.log("rrrrrrrrrrrrrrrr", response);
    
            let { results, ...otherPages } = response.data.data;
    
            // Fetch user data for custom packages
            const fetchUserData = async (userId) => {
                console.log("userId",userId)
                try {
                    const userResponse = await axios.get(`${App_host}/getOne/${userId}`, {
                        headers: {
                            token,
                        },
                    });

                    console.log("userResponse",userResponse.data)
                    return userResponse.data.data; // Adjust based on the actual response structure
                } catch (error) {
                    console.error(`Error fetching user data for user ID ${userId}:`, error);
                    return null;
                }
            };
    
            // Iterate over results to fetch user data for custom packages
            const updatedResults = await Promise.all(
                results.map(async (pkg) => {
                    if (pkg?.type === 'custom' && pkg?.customPackageUsers?.length > 0) {
                        const userId = pkg.customPackageUsers[0]; // Extract the user ID
                        const userData = await fetchUserData(userId);
                        return { ...pkg, userData };
                    }
                    return pkg;
                })
            );
    
            SetPackagesData(updatedResults);
            setTotalPages(otherPages.totalPages);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    useEffect(() => {
        getPackagesList()
    }, [])


    console.log("packagesData",packagesData)
    let handleSubitform = async (packageId) => {
        try {

            let { BusinessLocation, _id, isJimAdmin, isAdmin, created_at, updated_at, __v, ...userData } = user
            let formData = {
                ...userData,
                BusinessLocation: gymid,
                package: packageId
            }


            const response = await axios.post(`${App_host}/user/addUser`, formData, {
                headers: {
                },
            });
            console.log("response",response)


            if (response?.data?.success) {
                toast.success('User registered successfully!', {
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
            handleShowpackage()
        } catch (error) {
            console.log("error.response.data.message", error)
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
    }
    return (
        <>
            <div className={`modal fade ${showPackages ? "show" : ""}`} id="pricingModal" style={{ display: showPackages ? "block" : "none" }} role="dialog" tabIndex="-1">
                <div className="modal-dialog modal-xl modal-simple modal-pricing">
                    <div className="modal-content p-2 p-md-5">
                        <div className="modal-body">
                            <button type="button" className="btn-close" onClick={handleShowpackage}></button>
                            {/* Pricing Plans */}
                            <div className="py-0 rounded-top">
                                <h2 className="text-center mb-2">Select package</h2>
                                <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 pt-3 mb-4">
                                    <div className="row gx-3">
                                        {packagesData.length > 0 ? (
                                            packagesData.map((item) => (
                                                <div className="col-xl mb-md-0 mb-4" key={item._id}>
                                                    <div className="card border-primary border shadow-none">
                                                        <div className="card-body position-relative">
                                                            {/* Rest of your card content... */}

                                                            
                                                            <h3 className="card-title text-center text-capitalize mb-1">{item.name}</h3>
                                                            <p className="text-center">  {item?.type==="custom"?"For Custom User":" For Gym users"}</p>
                                                            <div className="text-center h-px-100 mb-2">
                                                                <div className="d-flex justify-content-center">
                                                                    <sup className="h6 pricing-currency mt-3 mb-0 me-1 text-primary"><FontAwesomeIcon icon={faIndianRupeeSign} /></sup>
                                                                    <h1 className="price-toggle price-yearly display-4 text-primary mb-0">{item.price}</h1>
                                                                    <sub className="h6 text-muted pricing-duration mt-auto mb-2 fw-normal">/month</sub>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {item.description}
                                                            </div>

                                                            {!user.isAdmin && (
                                                                <button className="btn btn-primary" onClick={() => handleSubitform(item._id.toString())}>Register Now</button>
                                                            )}
                                                            {/* {!user.isJimAdmin && (
                                                <Link to={activePackage?._id === item?._id ? "#" : `/checkoutPackage?id=${item._id.toString()}`}>
                                                    <button disabled={activePackage?._id === item?._id} type="button" className="btn  btn-primary d-grid w-100 mt-3" data-bs-dismiss="modal"> {activePackage?._id === item?._id ? "Current Plan" : "Upgrade"} </button>
                                                </Link>
                                            )} */}
                                                            {/* Edit button */}

                                                            {/* <button  className="btn btn-sm btn-outline-primary position-absolute top-0 end-0 m-2" onClick={() => handleEditPackage(item._id)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-12">
                                                <div className="alert alert-primary" role="alert">
                                                    No available packages.
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </>
    )
}

export default GymsPopup
