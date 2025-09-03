import './index.css';
import { useState } from 'react';
import axios from 'axios';
const AddressItem = (props) => {
    const {address,onReload} = props;
    const {id,address_details, city, state, pin_code} = address;
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState();
    const [updateAddress, setUpdateAddress] = useState(address_details);
    const [updateCity, setUpdateCity] = useState(city);
    const [updateState, setUpdateState] = useState(state);
    const [updatePin_code, setUpdatePin_code] = useState(pin_code);
    
    const handleEdit = () => {
        setEditMode(prev => !prev);
    };
    const handleUpdate = async () => {
        const url = `https://qwipo-assignment-1-gwj7.onrender.com/api/addresses/${id}`;
        const formData = { address_details: updateAddress, city: updateCity, state: updateState, pin_code: updatePin_code };
        try {
            const response = await axios.put(url, formData);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data.error);
            }
        }
        setEditMode(false);
        onReload();
    };
    const handleDelete = async () => {
        console.log(id, "id");
        const url = `https://qwipo-assignment-1-gwj7.onrender.com/api/addresses/${id}`;
        try {
            const response = await axios.delete(url);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data.error);
            }
        }
            onReload();
    };
    return <li className="address-item">
        <div className="address-item-header">
            <div className="address-item-actions">
                {!editMode && <button onClick={() => handleEdit()}>Edit</button>}   
                <button onClick={() => handleDelete()}>Delete</button>
            </div>
        </div>
        {editMode ? <form onSubmit={() => handleUpdate()} className="address-item-form">
            <input type="text" value={updateAddress} onChange={(e) => setUpdateAddress(e.target.value)} />
            <br />
            <input type="text" value={updateCity} onChange={(e) => setUpdateCity(e.target.value)} />
            <br />
            <input type="text" value={updateState} onChange={(e) => setUpdateState(e.target.value)} />
            <br />
            <input type="text" value={updatePin_code} onChange={(e) => setUpdatePin_code(e.target.value)} />
            {error && <p>{error}</p>}
            {editMode && <button type="submit" className="address-item-update-button">Update</button>}
        </form> : <div className="address-item-details"><p>{address_details}</p>
        <p>{city}</p>
        <p>{state}</p>
        <p>{pin_code}</p>
        </div>}
    </li>
};
export default AddressItem;
