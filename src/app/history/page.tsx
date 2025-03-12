"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Define Product Data
const products = [
  { id: 1, name: "Product 1", image: "/product1.jpg" },
  { id: 2, name: "Product 2", image: "/product2.jpeg" },
  { id: 3, name: "Product 3", image: "/product3.png" },
  { id: 4, name: "Product 4", image: "/product4.jpeg" },
  { id: 5, name: "Product 5", image: "/product5.webp" },
];

// Define History Type
type StockHistory = {
  id: number;
  productId: number;
  quantity: number;
  type: "bags" | "packets" | "cartons";
  note: string;
  action: "import" | "export";
  timestamp: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<StockHistory[]>([]);

  // Load history from localStorage when the component mounts
  useEffect(() => {
    const storedHistory = localStorage.getItem("history");
    if (storedHistory) {
      try {
        const parsedHistory: StockHistory[] = JSON.parse(storedHistory);
        setHistory(parsedHistory);
      } catch (error) {
        console.error("Error parsing history from localStorage", error);
      }
    }
  }, []);

  // Function to delete a history entry
  const deleteHistoryItem = (id: number) => {
    const updatedHistory = history.filter((entry) => entry.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Stock History</h1>
      <Link href="/" className="text-blue-400 hover:underline mb-4 block">
        &larr; Back to Products
      </Link>
      {history.length === 0 ? (
        <p className="text-gray-500">No history recorded yet.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((entry) => {
            const product = products.find((p) => p.id === entry.productId);
            return (
              <li
                key={entry.id}
                className="p-4 border border-gray-700 rounded-lg bg-gray-800 flex items-center justify-between gap-4"
              >
                {/* Product Image */}
                <div className="flex items-center gap-4">
                  <Image
                    src={product?.image || "/placeholder.png"}
                    alt={product?.name || "Unknown Product"}
                    width={50}
                    height={50}
                    className="rounded-md"
                    priority
                  />
                  {/* Product Details */}
                  <div>
                    <p>
                      <strong className="text-gray-300">{product?.name || "Unknown Product"}:</strong>{" "}
                      <strong
                        className={`${
                          entry.action === "import" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {entry.quantity} {entry.type} ({entry.action})
                      </strong>
                      {entry.note && ` - ${entry.note}`}
                    </p>
                    <p className="text-sm text-gray-500">{entry.timestamp}</p>
                  </div>
                </div>
                {/* Delete Button */}
                <button
                  onClick={() => deleteHistoryItem(entry.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
