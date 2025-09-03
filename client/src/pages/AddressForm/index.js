import { useState } from "react";
import axios from "axios";
import { useHistory , useParams} from "react-router-dom";

import "./index.css";

const AddressForm = () => {
    const { id } = useParams();
    console.log(id, "id");
    const history = useHistory();
    const [address, setAddress] = useState();
    const [city, setCity] = useState();
    const [state, setState] = useState();
    const [pin_code, setPin_code] = useState();
    const [error, setError] = useState();
    
    


    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `https://qwipo-assignment-1-gwj7.onrender.com/api/customers/${id}/addresses`;
        const formData = { id,address, city, state, pin_code };
        
        try {
            const response = await axios.post(url, formData);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data.error);
            }
        }
        setTimeout(() => {
            history.push(`/customer-detail/${id}`);
        }, 1000);
    setAddress("");
    setCity("");
    setState("");
    setPin_code("");
        
    };

    return (
        <div className="address-form">
            <h2>Add New Address</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="address_details">Address Details</label>
                <textarea
                    id="address_details"
                    name="address_details"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, Building, etc."
                    required
                />

                <label htmlFor="city">City</label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter City"
                    required
                />

                <label htmlFor="state">State</label>
                <input
                    type="text"
                    id="state"
                    name="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Enter State"
                    required
                />

                <label htmlFor="pin_code">PIN Code</label>
                <input
                    type="text"
                    id="pin_code"
                    name="pin_code"
                    value={pin_code}
                    onChange={(e) => setPin_code(e.target.value)}
                    placeholder="Enter Postal/ZIP Code"
                    required
                />

                <button type="submit">Save Address</button>
            </form>
        </div>
    );
};

export default AddressForm;
