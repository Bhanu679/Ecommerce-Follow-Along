import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AddressForm = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    country: '',
    city: '',
    address1: '',
    address2: '',
    zipCode: '',
    addressType: 'Home',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("❌ No token found, user is not authenticated");
      alert("Unauthorized: Please log in again.");
      return;
    }
  
    console.log("🔹 Sending Token:", token);
    console.log("🔹 Address Data Being Sent:", address);
  
    try {
      const response = await axios.post("http://localhost:8000/user/add-address", 
        {
          country: address.country,
          city: address.city,
          address1: address.address1,
          address2: address.address2,
          zipCode: address.zipCode,
          addressType: address.addressType
        },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ Headers should be in the third argument
      );
  
      console.log("✅ Address Added:", response.data);
      alert("Address saved successfully!");
    } catch (error) {
      console.error("❌ Error adding address:", error.response?.data || error.message);
      alert("Failed to add address.");
    }
  };
  
  
  

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Add New Address</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="country" value={address.country} onChange={handleChange} placeholder="Country" className="w-full p-3 bg-gray-700 border border-gray-600 rounded" required />
          <input type="text" name="city" value={address.city} onChange={handleChange} placeholder="City" className="w-full p-3 bg-gray-700 border border-gray-600 rounded" required />
          <input type="text" name="address1" value={address.address1} onChange={handleChange} placeholder="Address Line 1" className="w-full p-3 bg-gray-700 border border-gray-600 rounded" required />
          <input type="text" name="address2" value={address.address2} onChange={handleChange} placeholder="Address Line 2 (Optional)" className="w-full p-3 bg-gray-700 border border-gray-600 rounded" />
          <input type="text" name="zipCode" value={address.zipCode} onChange={handleChange} placeholder="Zip Code" className="w-full p-3 bg-gray-700 border border-gray-600 rounded" required />
          <select name="addressType" value={address.addressType} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded">
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700 transition">Save Address</button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;