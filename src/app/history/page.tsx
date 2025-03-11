"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Define History Type
type StockHistory = {
  id: number;
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
        const parsedHistory = JSON.parse(storedHistory);
        setHistory(parsedHistory);
        console.log("Loaded history from localStorage:", parsedHistory);
      } catch (error) {
        console.error("Error parsing history from localStorage", error);
      }
    }
  }, []);

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
          {history.map((entry) => (
            <li key={entry.id} className="p-4 border border-gray-700 rounded-lg bg-gray-800">
              <p>
                <strong className={`text-${entry.action === "import" ? "green" : "red"}-400`}>
                  {entry.quantity} {entry.type} ({entry.action})
                </strong>
                {entry.note && ` - ${entry.note}`}
              </p>
              <p className="text-sm text-gray-500">{entry.timestamp}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}