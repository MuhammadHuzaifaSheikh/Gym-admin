import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { faCoins, faFaceFrown, faIndianRupeeSign, faLandmark, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { App_host } from '../Data';
import GymsPopup from '../components/GymsPopup';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import EarningPopup from '../components/EarningPopup';

const Earning = () => {
    let [expenseData, setExpenseData] = useState({})

    const [jim, setJim] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [nearby, setNearby] = useState(false);
    const [gymId, setGymId] = useState("");
    const [showDetails, setShowDetails] = useState(false);

    const itemsPerPage = 12;

    const [showPackages, setShowPackages] = useState(false)
    let token = localStorage.getItem("token")
    let user = JSON.parse(localStorage.getItem("user"))
    const getPackagesList = async () => {
        try {
            const response = await axios.get(`${App_host}/earning/getEarninDetail`, {
                headers: {
                    token,
                },
            });
            setExpenseData(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    useEffect(() => {
        getPackagesList()
    }, [])

    useEffect(() => {
        const fetchJim = async () => {
            try {
                const response = await axios.get(`${App_host}/Jim/getAllBusinessLocation?page=${currentPage}&limit=${itemsPerPage}`);
                setJim(response.data.data.businessLocations.results);
                setTotalPages(response.data.data.businessLocations.totalPages);
            } catch (error) {
                console.error("Error fetching gym data:", error);
            }
        };

        fetchJim();
    }, [currentPage]); // Reload when currentPage changes

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    let handleShowDeatils = (id) => {
        setShowDetails(!showDetails)
        setGymId(id)
    }
    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">

                <div className="col-lg-12 mb-4 order-md-0 order-lg-0">
                    <div className="card h-100">
                        <div className="card-header pb-0 d-flex justify-content-between mb-lg-n4">
                            <div className="card-title mb-5">
                                <h5 className="mb-0">Earning Reports</h5>
                                <small className="text-muted">Monthly Earnings Overview</small>
                            </div>

                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 col-md-4 d-flex flex-column align-self-end">
                                    <div className="d-flex gap-2 align-items-center mb-2 pb-1 flex-wrap">
                                        <h1 className="mb-0"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData.totalEarning}</h1>
                                    </div>
                                    <small className="text-muted">this Month compared to last Month</small>
                                </div>
                            </div>

                            <div className="border rounded p-3 mt-2">
                                <div className="row gap-4 gap-sm-0">
                                    <div className="col-12 col-sm-4">
                                        <div className="d-flex gap-2 align-items-center">
                                            <div className="badge rounded bg-label-primary p-1">
                                                <FontAwesomeIcon icon={faCoins} />
                                            </div>
                                            <h6 className="mb-0">Total Earnings</h6>

                                        </div>
                                        <h4 className="my-2 pt-1"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData.totalEarning}</h4>
                                        <div className="progress w-75" style={{ height: "4px" }}>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="d-flex gap-2 align-items-center">
                                            <div className="badge rounded bg-label-info p-1">
                                                <FontAwesomeIcon icon={faProductHunt} />
                                            </div>
                                            <h6 className="mb-0">Total Profit</h6>
                                        </div>
                                        <h4 className="my-2 pt-1"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData.totalProfit}</h4>
                                        <div className="progress w-75" style={{ height: "4px" }}>
                                        </div>
                                    </div>
                                    {!user.isAdmin && (

                                        <div className="col-12 col-sm-4">
                                            <div className="d-flex gap-2 align-items-center">
                                                <div className="badge rounded bg-label-danger p-1">
                                                    <FontAwesomeIcon icon={faLandmark} />
                                                </div>
                                                <h6 className="mb-0">Total Expense</h6>
                                            </div>
                                            <h4 className="my-2 pt-1"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData.totalExpense}</h4>
                                            <div className="progress w-75" style={{ height: "4px" }}>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                            <div className="border rounded p-3 mt-2">
                                <div className="row gap-4 gap-sm-0">
                                    <div className="col-12 col-sm-4">
                                        <div className="d-flex gap-2 align-items-center">
                                            <div className="badge rounded bg-label-primary p-1">
                                                <FontAwesomeIcon icon={faCoins} />

                                            </div>
                                            <h6 className="mb-0">Monthly Earnings</h6>
                                        </div>
                                        <h4 className="my-2 pt-1"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData.monthlyEarning}</h4>
                                        <div className="progress w-75" style={{ height: "4px" }}>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="d-flex gap-2 align-items-center">
                                            <div className="badge rounded bg-label-info p-1">
                                                <FontAwesomeIcon icon={faProductHunt} />
                                            </div>
                                            <h6 className="mb-0">Monthly Profit</h6>
                                        </div>
                                        <h4 className="my-2 pt-1"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData.monthlyProfit}</h4>
                                        <div className="progress w-75" style={{ height: "4px" }}>
                                        </div>
                                    </div>
                                    {!user.isAdmin && (
                                        <div className="col-12 col-sm-4">
                                            <div className="d-flex gap-2 align-items-center">
                                                <div className="badge rounded bg-label-danger p-1">
                                                    <FontAwesomeIcon icon={faLandmark} />
                                                </div>
                                                <h6 className="mb-0">Monthly Expense</h6>
                                            </div>
                                            <h4 className="my-2 pt-1"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData.monthlyExpense}</h4>
                                            <div className="progress w-75" style={{ height: "4px" }}>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {user.isAdmin && (
                <div className="container-xxl flex-grow-1 container-p-y">
                    <div className="col-lg-12 mb-4 order-md-0 order-lg-0">
                        <section className="choseus-section spad mt-3">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="section-title">
                                            <h4><strong>Gym Packages</strong></h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {jim.map((data, index) => (
                                        <>
                                            <div key={index} className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                                <div className="card h-100">
                                                    {data.images.length > 0 ? (
                                                        <img
                                                            src={data.images[0]}
                                                            className="card-img-top"
                                                            alt="Gym"
                                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src="https://www.staticwhich.co.uk/static/images/products/no-image/no-image-available.png"
                                                            className="card-img-top"
                                                            alt="Gym"
                                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                        />
                                                    )}
                                                    <div className="card-body">
                                                        <h5 className="card-title">{data.name}</h5>
                                                        <p className="card-text">
                                                            <i><FontAwesomeIcon icon={faMapMarker} /></i> {data.adress}
                                                        </p>
                                                        <button className="btn btn-primary" onClick={() => handleShowDeatils(data._id.toString())}>Show Earning</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ))}
                                    {jim.length === 0 && (
                                        <div className="col-12 d-flex justify-content-center">
                                            <div className="card text-center">
                                                <div className="card-body">
                                                    <FontAwesomeIcon icon={faFaceFrown} style={{ color: "white", fontSize: "50px" }} />
                                                    <h5 className="card-title">No available Gyms to Show</h5>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <EarningPopup showDetails={showDetails} handleShowDeatils={handleShowDeatils} data={gymId} />
                                {totalPages > 1 && (
                                    <div className="row mt-4">
                                        <div className="col-lg-12 d-flex justify-content-center">
                                            <nav aria-label="Page navigation example">
                                                <ul className="pagination">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                            <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </>
    )
}

export default Earning
