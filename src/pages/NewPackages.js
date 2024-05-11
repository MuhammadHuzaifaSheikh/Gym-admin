import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import PackagesPlaneModel from '../components/PackagesPlaneModel';
import axios from 'axios';
import { App_host } from '../Data';
import PackagesModel from '../components/PackagesModel';

const NewPackages = () => {
    const [showPackages, setShowPackages] = useState(false)
    const [packageDays, setPackagesDays] = useState(0)
    const [toDay, setToDays] = useState(0)
    const [remainingDays, SetRemainingDays] = useState(0)
    const [showUpdatePackage, showUpdatePackages] = useState(false);
    const [activePackage, setActivePackage] = useState({});
    const [lastDate, setLastDate] = useState(0);
    const [isCustom, setIscustom] = useState(false)

    const [packagesData, SetPackagesData] = useState([]);




    let user = JSON.parse(localStorage.getItem('user'))
    let token = localStorage.getItem('token')
    let activegym = localStorage.getItem('activegym')

    let handleShowpackageModel = () => {
        console.log("here")
        setShowPackages(!showPackages)
    }

    function getDateAfter30Days(inputDate) {
        // Get the current date

      
        var currentDate = new Date();
    
        // Add 30 days to the input date
        var dateAfter30Days = new Date(inputDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    
        // Check if the date is valid
        var isValid = dateAfter30Days > currentDate;
        console.log('inputDate', isValid ? dateAfter30Days : inputDate)

        
        // Return the result
        return {
            dateAfter30Days: isValid ? dateAfter30Days : inputDate,
            daysRemaining : daysRemainingToDate(new Date( isValid ? dateAfter30Days : inputDate)),
            valid: isValid
        };
    }

    function daysRemainingToDate(limitDate) {
        // Get the current date
        var currentDate = new Date();
    
        // Calculate the difference in milliseconds between the current date and the limit date
        var timeDifference = limitDate.getTime() - currentDate.getTime();
    
        // Convert the time difference from milliseconds to days
        var daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
        // Return the number of days remaining
        return daysRemaining;
    }

    function getLastDayOfMonth() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const lastDay = new Date(year, month + 1, 0);
        const monthName = lastDay.toLocaleString('default', { month: 'short' });
        const dayOfMonth = lastDay.getDate();
        const formattedDate = `${monthName} ${dayOfMonth}, ${year}`; // e.g., "Dec 30, 2024"
        setLastDate(formattedDate)
    }
    let filterDates = () => {
        const today = new Date();
        const currentDayOfMonth = today.getDate();
        setToDays(currentDayOfMonth)
        const totalDaysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        SetRemainingDays(totalDaysInMonth - currentDayOfMonth)
        const percentDaysPassed = (currentDayOfMonth / totalDaysInMonth) * 100;
        setPackagesDays(percentDaysPassed);
    }

    useEffect(() => {
        filterDates()
        getLastDayOfMonth()
    }, []);

    const HandleSHowUpdatePackageModel = () => {
        setIscustom(false)
        showUpdatePackages(!showUpdatePackage)
    }
    const HandleSHowUpdatePackageModelCustom = () => {
        setIscustom(true)
        showUpdatePackages(!showUpdatePackage)
    }

    const getActivePackage = async () => {
        try {
            const response = await axios.get(`${App_host}/packages/getActivePackage`, {
                params: {
                    activegym: activegym
                },
                headers: {
                    token,
                },
            });
            console.log("Active vvvvvvvvvvvvvvvvvvvvvvvv", response)
            
            setActivePackage(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    useEffect(() => {
        getActivePackage()
    }, [])



    const [previousData ,setPreviousData] = useState()
    const handleShowUpdatePackageModelEdit = (data) => {
        console.log("data",data)
        setPreviousData(data);
        showUpdatePackages(!showUpdatePackage)
    };

    console.log("packagesData===",packagesData)


    const lastDateMemo = useMemo(()=>{
        let inputDate = new Date(user?.active_date)
      return  getDateAfter30Days(inputDate)
    },[user])


    const daysPrgress = ()=>{
       const currentDAys= lastDateMemo?.daysRemaining-29;
       const totalDays = 30
       const percent = (currentDAys/totalDays)*100;
       return  Math.round(percent) ;
    }
    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y p-0">

                <div className="container">
                    {user.isJimAdmin && (<>
                        <div className='d-flex justify-content-end mb-3'>
                        <button className="btn btn-primary me-2 mt-2 pointer" onClick={handleShowpackageModel}>All Packages</button>
                            <button className="btn btn-primary me-2 mt-2 pointer" onClick={HandleSHowUpdatePackageModel}>Add Package</button>
                            <button className="btn btn-primary me-2 mt-2 pointer" onClick={HandleSHowUpdatePackageModelCustom}>Add Custom Package</button>
                        </div>
                        <PackagesModel SetPackagesData={SetPackagesData} previousData={previousData} HandleSHowUpdatePackageModel={HandleSHowUpdatePackageModel} showUpdatePackage={showUpdatePackage} type={isCustom ? "custom" : null} />
                    </>)}
                    <div class="row">
                        <div class="col-md-12">
                            <div className="card mb-4">
                                <h4 className="card-header"><strong>Current Plan</strong></h4>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-1">
                                            <div className="mb-3">
                                                <h6 className="mb-1">Your Current Plan is <strong>{activePackage.name}</strong></h6>
                                                <p>A simple start for everyone</p>
                                            </div>
                                            {user?.status ==='active' &&      <div className="mb-3">
                                                <h6 className="mb-1">Active until { new Date( lastDateMemo?.dateAfter30Days).toLocaleDateString() }</h6>
                                                <p>We will send you a notification upon Subscription expiration</p>
                                            </div>}
                                       
                                            <div className="mb-3">
                                                <h6 className="mb-1">
                                                    <span className="me-2"><FontAwesomeIcon icon={faIndianRupeeSign} /> {activePackage.price} Per Month</span>
                                                </h6>
                                                <p>Standard plan for Gyms</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-1">
                                            {user?.status ==='inactive' ? <div className="alert alert-warning mb-3" role="alert">
                                                <h5 className="alert-heading mb-1">We need your attention!</h5>
                                                <span><FontAwesomeIcon icon={faExclamationTriangle} />  You are inactive since { new Date( user?.inActive_date).toLocaleDateString()}</span>
                                            </div>: lastDateMemo?.daysRemaining ===5 && <div className="alert alert-warning mb-3" role="alert">
                                                <h5 className="alert-heading mb-1">We need your attention!</h5>
                                                <span><FontAwesomeIcon icon={faExclamationTriangle} />  Your plan requires update</span>
                                            </div>}
                                           
                                            <div className="plan-statistics">
                                                <div className="d-flex justify-content-between">
                                                    <h6 className="mb-2">Days</h6>
                                                    <h6 className="mb-2">{ lastDateMemo?.daysRemaining -29} of 30 Days</h6>
                                                </div>
                                                <div className="progress">
                                                    <div className="progress-bar" style={{ width: `${daysPrgress().toFixed()}%` }} role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <p className="mt-1 mb-0">{lastDateMemo?.daysRemaining  -( lastDateMemo?.daysRemaining -29)} days remaining until your plan requires update</p>
                                            </div>
                                        </div>
                                        {!user.isJimAdmin && <div className="col-12">
                                            <button className="btn btn-primary me-2 mt-2 pointer" onClick={handleShowpackageModel}>{user.isJimAdmin ? "All Packages " : "Upgrade Plan"}</button>
                                            {/* <button className="btn btn-label-danger cancel-subscription mt-2">Cancel Subscription</button> */}
                                        </div>}
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PackagesPlaneModel SetPackagesData={SetPackagesData} packagesData={packagesData} handleShowUpdatePackageModelEdit={handleShowUpdatePackageModelEdit} showPackages={showPackages} activePackage={activePackage} handleShowpackage={handleShowpackageModel} />
        </>
    );
}

export default NewPackages;
