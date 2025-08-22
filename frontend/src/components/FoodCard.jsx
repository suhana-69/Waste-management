// frontend/src/components/FoodCard.jsx
import React from "react";

export default function FoodCard({ food, onRequest }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img
        src={food.Url || "https://via.placeholder.com/300"}
        alt={food.name}
        className="w-full h-40 object-cover rounded-md"
      />
      <h3 className="text-lg font-bold mt-2">{food.name}</h3>
      <p className="text-gray-600">{food.description}</p>
      <p className="text-sm text-gray-500">Quantity: {food.quantity}</p>
      <p className="text-sm text-gray-500">City: {food.city}</p>
      <button
        onClick={() => onRequest(food._id)}
        className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Request Food
      </button>
    </div>
  );
}
