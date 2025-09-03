import './index.css';

import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const CustomerForm = () => {
    const history = useHistory();
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [phone_number, setPhone_number] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { first_name, last_name, phone_number };
        try {
          await axios.post("http://localhost:5000/api/customers", formData);
          setError("Customer added successfully!");
          setTimeout(() => {
            history.push('/customer-list');
            setError('');
          }, 3000);
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setError(error.response.data.error); 
          } else {
            setError("Something went wrong. Please try again.");
          }
        }
        setFirst_name('');
        setLast_name('');
        setPhone_number('');
      };
      
    

  return <div className="customer-form">
    <h1>Add New Customer</h1>
    <form onSubmit={handleSubmit}>
      <label htmlFor="first_name">First Name</label>
      <input type="text" id="first_name" name="first_name" onChange={(e) => setFirst_name(e.target.value)} required/>
      <label htmlFor="last_name">Last Name</label>
      <input type="text" id="last_name" name="last_name" onChange={(e) => setLast_name(e.target.value)} required/>
      <label htmlFor="phone_number">Phone Number</label>
      <input type="text" id="phone_number" name="phone_number" onChange={(e) => setPhone_number(e.target.value)} required/>
      <button type="submit">Add Customer</button>
    </form>
    {error && <p className="error">{error}</p>}
  </div>;
};
export default CustomerForm;
