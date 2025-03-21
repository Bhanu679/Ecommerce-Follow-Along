import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    addresses: [],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("🔹 User Data Loaded:", parsedUser);  // ✅ Debug Log
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          avatar: parsedUser.avatar || '',
          addresses: parsedUser.addresses || [],  // ✅ Ensure this is an array
        });
      }
    };
    fetchUserData();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
  
      if (!token) {
        console.error("❌ No token found, user is not authenticated");
        alert("Unauthorized: Please log in again.");
        return;
      }
  
      const response = await axios.put("http://localhost:8000/user/update-profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setUser(response.data);
      setIsEditing(false);
      localStorage.setItem("user", JSON.stringify(response.data));
      alert("Profile successfully updated");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };  

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12 px-4">
      <Navbar />
      {user ? (
        <div className="w-full max-w-4xl">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg mb-6">
            <h2 className="text-3xl font-semibold text-center text-gray-100 mb-6">Profile</h2>
            <div className="flex flex-col items-center justify-center">
              <img
                src={formData.avatar || 'default-avatar.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-indigo-500"
              />
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-3 bg-gray-700 text-white border border-gray-600 rounded"
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-3 bg-gray-700 text-white border border-gray-600 rounded"
                    placeholder="Email Address"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-3 bg-gray-700 text-white border border-gray-600 rounded"
                    placeholder="Phone Number"
                  />
                  <button
                    onClick={handleSave}
                    className="mt-4 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-100">{user.name}</h3>
                  <p className="text-lg text-gray-400">{user.email}</p>
                  <p className="text-lg text-gray-400">{user.phone}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-100 mb-4">Addresses</h2>
            {formData.addresses.length > 0 ? (
              formData.addresses.map((address, index) => (
                <div key={index} className="mb-4">
                  <p className="text-lg text-gray-400">{address.address1}, {address.city}, {address.country}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No address found</p>
            )}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => navigate('/add-address')}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Add Address
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white">Loading...</p>
      )}
    </div>
  );
};

export default Profile;