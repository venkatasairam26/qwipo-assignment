import './index.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import AddressItem from '../../components/addressItems';

const apiStatusConstants = {
    initial: 'initial',
    loading: 'loading',
    success: 'success',
    failure: 'failure',
}

const CustomerDetailPage = () => {
    const { id } = useParams();
    const history = useHistory();
    const [apiResponse, setApiResponse] = useState({ apiStatus: apiStatusConstants.initial, apiData: null, Error: null });
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [updateStatus, setUpdateStatus] = useState(false);


    useEffect(() => {
        fetchCustomerDetails();
    }, []);

    const fetchCustomerDetails = async () => {
        setApiResponse(prevState => ({ ...prevState, apiStatus: apiStatusConstants.loading }));
        try {
            const response = await axios.get(`https://qwipo-assignment-1-gwj7.onrender.com/api/customers/${id}`);
            setApiResponse(prevState => ({ ...prevState, apiStatus: apiStatusConstants.success, apiData: response.data }));
            setFirstName(response.data.first_name);
            setLastName(response.data.last_name);
            setPhoneNumber(response.data.phone_number);
        } catch (error) {
            setApiResponse(prevState => ({ ...prevState, apiStatus: apiStatusConstants.failure, Error: error }));
        }
    }

    const handleAddAddress = () => {
        history.push(`/customers/${id}/address`);
    }
    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        console.log(firstName, lastName, phoneNumber);
        const url = `https://qwipo-assignment-1-gwj7.onrender.com/api/customers/${id}`;
        const formData = { first_name: firstName, last_name: lastName, phone_number: phoneNumber };
        try {
            await axios.put(url, formData);
            setUpdateStatus(false);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data.error);
            }
        }
        setTimeout(() => {
            fetchCustomerDetails();
        }, 1000);

    }



    const renderCustomerDetails = () => {
        switch (apiResponse.apiStatus) {
            case apiStatusConstants.success:
                return <div className="customer-detail-page-container">
                    {updateStatus ? <div>
                        <h1 className="update-title">Update Customer Details</h1>
                        <form className="update-form" onSubmit={handleUpdateCustomer}>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                            />
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                            />
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Phone Number"
                            />
                            <button type="submit">Update</button>
                        </form>
                    </div> : <div className='customer-detail'>
                        <div>
                            <h1>{firstName} {lastName}</h1>
                            <p>{phoneNumber}</p>
                        </div>
                        <button onClick={() => { setUpdateStatus(true) }}>Edit Details</button>
                    </div>}
                    <div className="addresses"><ul>
                        {apiResponse.apiData.addresses.length > 0 ? apiResponse.apiData.addresses.map(address => <AddressItem key={address.id} address={address} onReload={() => { fetchCustomerDetails() }} />) : <li className="no-addresses">No addresses available</li>}
                    </ul>
                        <button className="add-address-button" onClick={() => { handleAddAddress() }}>Add New Address</button>
                    </div>
                </div>;


            case apiStatusConstants.failure:
                return <h1>{apiResponse.Error.message}</h1>;

            case apiStatusConstants.loading:
                return <h1>Loading...</h1>;

            default:
                return null;
        }
    }
    return <div className="customer-detail-page">
        <header>
            <h1>Customer Details</h1>
            <Link to="/customer-list" className="back-to-customer-list-link">Back to Customer List</Link>
        </header>
        {renderCustomerDetails()}
    </div>;
};
export default CustomerDetailPage;