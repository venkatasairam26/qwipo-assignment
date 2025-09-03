import './index.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const CustomerListItem = (props) => {
    const { id, first_name, last_name, phone_number, onReload } = props;
    const history = useHistory();
    const [error, setError] = useState('');
    const handleViewDetails = () => {
        history.push(`/customer-detail/${id}`);
    };
    const handleDelete = async () => {
        const url = `https://qwipo-assignment-1-gwj7.onrender.com/api/customers/${id}`;
        try {
            const response = await axios.delete(url);
            onReload();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data.error);
            }
        }
    };
    return <li className="customer-list-item">
        <div><h1>{first_name} {last_name}</h1>
        <p>{phone_number}</p>
        <button onClick={() => handleViewDetails()}>View Details</button>
        </div>
        <button onClick={() => handleDelete()}>Delete</button>
        {error && <p className="error">{error}</p>}
        </li>;
};
export default CustomerListItem;
