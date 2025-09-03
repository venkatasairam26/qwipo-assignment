import './index.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerListItem from '../../components/CustomerListItem';
import { useHistory } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";


const apiStatusConstants = {
    initial: 'initial',
    loading: 'loading',
    success: 'success',
    failure: 'failure',
};

const CustomerListPage = () => {
    const [apiResponse, setApiResponse] = useState({ apiStatus: apiStatusConstants.initial, apiData: null, Error: null });
    const history = useHistory();
    // const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);
    const fetchCustomers = async (e) => {
        setApiResponse(prevState => ({ ...prevState, apiStatus: apiStatusConstants.loading }));
        try {
            const response = await axios.get(`https://qwipo-assignment-1-gwj7.onrender.com/api/customers?search=${e}`);
            setApiResponse(prevState => ({ ...prevState, apiStatus: apiStatusConstants.success, apiData: response.data }));
        } catch (error) {
            setApiResponse(prevState => ({ ...prevState, apiStatus: apiStatusConstants.failure, Error: error }));
        }
    };

    const renderCustomers = () => {
        switch (apiResponse.apiStatus) {
            case apiStatusConstants.success:
                return <>{apiResponse.apiData.length > 0 ?
                    <ul>{apiResponse.apiData.map(customer => <CustomerListItem key={customer.id} {...customer} onReload={() => fetchCustomers()} />)}</ul> :
                    <div className="no-customers-found">
                        <h1>No customers found</h1>
                        <button className="add-customer-button" onClick={() => history.push('/customer-form')}>Add New Customer</button>
                    </div>}</>;

            case apiStatusConstants.failure:
                return <h1>{apiResponse.Error.message}</h1>;

            case apiStatusConstants.loading:
                return <h1>Loading...</h1>;

            default:
                return null;
        }
    };

    const handleSearch = (e) => {
        fetchCustomers(e.target.value);
    };

    return <div className="customer-list-page">
        <header>
            <h1>Customer collection</h1>
            <div className="customer-list-header">
                <div className="search-container">
                    <input type="text" placeholder="Search customers" onChange={ handleSearch}/>
                    <IoSearchSharp  className="search-icon" />
                </div>
                <Link to="/customer-form" className="add-customer-link">Add New Customer</Link>
            </div>
        </header>

        {renderCustomers()}
    </div>;
};
export default CustomerListPage;