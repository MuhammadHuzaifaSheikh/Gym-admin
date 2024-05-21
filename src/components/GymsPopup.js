import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { App_host } from '../Data';
import { Link, useRouter } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const GymsPopup = ({ showPackages, handleShowpackage, gymid, selectedGym }) => {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [packagesData, SetPackagesData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
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
                console.log("userId", userId)
                try {
                    const userResponse = await axios.get(`${App_host}/getOne/${userId}`, {
                        headers: {
                            token,
                        },
                    });

                    console.log("userResponse", userResponse.data)
                    return userResponse.data.data; // Adjust based on the actual response structure
                } catch (error) {
                    console.error(`Error fetching user data for user ID ${userId}:`, error);
                    return null;
                }
            };

            // Iterate over results to fetch user data for custom packages
            const updatedResults = await Promise.all(
                results.map(async (pkg) => {
                    if (pkg?.type !== 'custom') {
                        // Non-custom package, include it
                        return pkg;
                    } else if (pkg?.customPackageUsers?.includes(user._id)) {
                        // Custom package with current user's ID, include it
                        const userData = await fetchUserData(user._id);
                        return { ...pkg, userData };
                    } else {
                        // Custom package without current user's ID, exclude it
                        return null;
                    }
                })
            );

            // Filter out null values (custom packages without current user's ID)
            const filteredResults = updatedResults.filter(pkg => pkg !== null);

            SetPackagesData(filteredResults);
            setTotalPages(otherPages.totalPages);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    useEffect(() => {
        getPackagesList()
    }, [])


    console.log("packagesData", packagesData)
    let handleSubitform = async (packageId) => {
        try {

            let { BusinessLocation, _id, isJimAdmin, isAdmin, created_at, updated_at, __v, ...userData } = user
            let formData = {
                ...userData,
                BusinessLocation: gymid,
                package: packageId,
            }


            console.log("formData", formData)

            const response = await axios.post(`${App_host}/user/addUser`, formData, {
                headers: {
                },
            });


            /// I want to store data on local storage and re-rencer



            if (response?.data?.success) {

                console.log("response?.data", response?.data?.data)

                localStorage.removeItem("user")
                let updatedUser = { ...response?.data?.data }

                updatedUser.BusinessLocation = [...user.BusinessLocation, { Gym: selectedGym, package: packageId }]


                console.log("updatedUser", updatedUser)


                localStorage.setItem("user", JSON.stringify(updatedUser))
                localStorage.setItem("gymDetail", JSON.stringify(selectedGym))
                localStorage.setItem("activegym", gymid)
               alert('Your request is sent to gym wait until they approve');

                navigate("/")
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
                                <h2 className="text-center mb-2">Select Package</h2>
                                <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 pt-3 mb-4">
                                    <div className="row gx-3">
                                        {packagesData.length > 0 ? (
                                            packagesData.map((item) => (


                                                <div className="col-sm mb-md-0 mb-4" key={item._id}>
                                                    <div className="card border-primary border shadow-none">
                                                        <div className="card-body position-relative">
                                                            {/* Rest of your card content... */}
                                                            <h3 className="card-title text-center text-capitalize mb-1">{item.name}</h3>
                                                            <p className="text-center">{item?.type === 'custom' ? "For Custom User" : "For Gym users"}</p>
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
