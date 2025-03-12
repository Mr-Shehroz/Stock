"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Define Stock Type
const initialStock = {
  bags: 0,
  packets: 0,
  cartons: 0,
};

const products = [
  { id: 1, name: "Product 1", image: "/product1.jpg" },
  { id: 2, name: "Product 2", image: "/product2.jpeg" },
  { id: 3, name: "Product 3", image: "/product3.png" },
  { id: 4, name: "Product 4", image: "/product4.jpeg" },
  { id: 5, name: "Product 5", image: "/product5.webp" },
];

export default function ProductPage() {
  const [stocks, setStocks] = useState(
    () => JSON.parse(localStorage.getItem("stocks") || "{}") || {}
  );
  const [history, setHistory] = useState(
    () => JSON.parse(localStorage.getItem("history") || "[]") || []
  );
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});
  const [notes, setNotes] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    localStorage.setItem("stocks", JSON.stringify(stocks));
    localStorage.setItem("history", JSON.stringify(history));
  }, [stocks, history]);

  const handleStockChange = (productId: number, action: string) => {
    const quantity = Number(inputValues[productId]) || 0;
    if (quantity <= 0) return;
    const type = selectedOptions[productId] || "bags";

    setStocks((prevStocks) => {
      const newStocks = { ...prevStocks };
      if (!newStocks[productId]) newStocks[productId] = { ...initialStock };

      if (action === "import") {
        newStocks[productId][type] += quantity;
        setError((prev) => ({ ...prev, [productId]: "" }));
      } else if (action === "export") {
        if (newStocks[productId][type] < quantity) {
          setError((prev) => ({ ...prev, [productId]: "Not enough stock!" }));
          return prevStocks;
        } else {
          newStocks[productId][type] -= quantity;
          setError((prev) => ({ ...prev, [productId]: "" }));
        }
      }

      return newStocks;
    });

    setHistory((prevHistory: { id: number; productId: number; quantity: number; type: string; note: string; action: string; timestamp: string }[]) => [
      { id: prevHistory.length + 1, productId, quantity, type, note: notes[productId] || "", action, timestamp: new Date().toLocaleString() },
      ...prevHistory,
    ]);

    setInputValues((prev) => ({ ...prev, [productId]: "" }));
    setNotes((prev) => ({ ...prev, [productId]: "" }));
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(({ id, name, image }) => (
          <div key={id} className="p-6 border border-gray-700 rounded-lg bg-gray-800">
            <Image src={image} width={100} height={100} alt={name} className="mx-auto" />
            <h2 className="text-xl font-bold mt-4 text-center">{name}</h2>
            <div className="mt-4">
              <input
                type="number"
                min="1"
                value={inputValues[id] || ""}
                onChange={(e) => setInputValues({ ...inputValues, [id]: e.target.value })}
                className="w-full p-2 bg-gray-700 text-white rounded-md"
                placeholder="Enter quantity..."
              />
              <select
                value={selectedOptions[id] || "bags"}
                onChange={(e) => setSelectedOptions({ ...selectedOptions, [id]: e.target.value })}
                className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
              >
                <option value="bags">Bags</option>
                <option value="packets">Packets</option>
                <option value="cartons">Cartons</option>
              </select>
              <input
                type="text"
                value={notes[id] || ""}
                onChange={(e) => setNotes({ ...notes, [id]: e.target.value })}
                className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                placeholder="Enter note (optional)..."
              />
              {error[id] && <p className="text-red-500 text-sm mt-2">{error[id]}</p>}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleStockChange(id, "import")}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  Import
                </button>
                <button
                  onClick={() => handleStockChange(id, "export")}
                  className={`px-4 py-2 text-white rounded-md ${
                    stocks[id]?.[selectedOptions[id] || "bags"] > 0
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                  disabled={stocks[id]?.[selectedOptions[id] || "bags"] <= 0}
                >
                  Export
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Stock:</h3>
              <ul>
                {stocks[id] ? (
                  Object.entries(stocks[id]).map(([type, qty]) => (
                    <li key={type}>{type}: {qty}</li>
                  ))
                ) : (
                  <p className="text-gray-400">No stock available</p>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link href="/history" className="text-blue-400 hover:underline">
          View Stock History
        </Link>
      </div>
    </div>
  );
}
