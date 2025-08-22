// frontend/src/components/FoodList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import FoodCard from "./FoodCard";

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/food/request")
      .then((res) => {
        // Make sure we always get an array
        setFoods(res.data.foods || []); 
      })
      .catch((err) => console.error("Error fetching foods:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleRequest = (foodId) => {
    console.log("Request food:", foodId);
    // 🔜 Later will call POST /acceptfood here
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading food donations...</p>;
  }

  if (!foods || foods.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No food donations available right now.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {foods.map((food) => (
        <FoodCard key={food._id || food.id} food={food} onRequest={handleRequest} />
      ))}
    </div>
  );
}
