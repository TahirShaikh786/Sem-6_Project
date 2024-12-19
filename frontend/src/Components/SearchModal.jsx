import React, { useState } from "react";
import "../assets/CSS/components.css";
import { toast } from "react-toastify";
import { useAuth } from "../Service/auth";

const SearchModal = ({ closeModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { backendURL, user, authorizationToken } = useAuth();

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await fetch(`${backendURL}/auth/${user._id}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authorizationToken}`,
      },
      body: JSON.stringify({ query: searchQuery }),
    });
    const data = await response.json();
    console.log("data", data);
    
    
    if (response.ok) {
      toast.success("Search Found");
      setSearchQuery("");
      closeModal();
    } else {
      toast.error("No search results found.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modalBox">
        <input
          type="text"
          name="search"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Enter search term..."
        />
        <button onClick={handleSearch}>
          <i className="bi bi-search"></i>
        </button>
      </div>
    </div>
  );
};

export default SearchModal;
