"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Define Stock Type
type StockType = {
  bags: number;
  packets: number;
  cartons: number;
};

type StockOption = keyof StockType;

// Define History Type
type StockHistory = {
  id: number;
  quantity: number;
  type: StockOption;
  note: string;
  action: "import" | "export";
  timestamp: string;
};

export default function Product() {
  const [stock, setStock] = useState<StockType>({
    bags: 0,
    packets: 0,
    cartons: 0,
  });
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<StockOption>("bags");
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [note, setNote] = useState("");

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const storedStock = localStorage.getItem("stock");
    const storedHistory = localStorage.getItem("history");
    if (storedStock) {
      setStock(JSON.parse(storedStock));
      console.log("Loaded stock from localStorage:", JSON.parse(storedStock));
    }
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
      console.log("Loaded history from localStorage:", JSON.parse(storedHistory));
    }
  }, []);

  // Save stock and history to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("stock", JSON.stringify(stock));
    localStorage.setItem("history", JSON.stringify(history));
    console.log("Saved stock to localStorage:", stock);
    console.log("Saved history to localStorage:", history);
  }, [stock, history]);

  // Function to import stock (add goods)
  const handleImportStock = () => {
    const quantity = Number(inputValue);
    if (quantity > 0) {
      const newEntry: StockHistory = {
        id: history.length + 1,
        quantity,
        type: selectedOption,
        note,
        action: "import",
        timestamp: new Date().toLocaleString(),
      };

      setStock((prevStock) => ({
        ...prevStock,
        [selectedOption]: prevStock[selectedOption] + quantity,
      }));

      setHistory([newEntry, ...history]);
      setInputValue("");
      setNote("");
    }
  };

  // Function to export stock (remove goods)
  const handleExportStock = () => {
    const quantity = Number(inputValue);
    if (quantity > 0 && stock[selectedOption] >= quantity) {
      const newEntry: StockHistory = {
        id: history.length + 1,
        quantity,
        type: selectedOption,
        note,
        action: "export",
        timestamp: new Date().toLocaleString(),
      };

      setStock((prevStock) => ({
        ...prevStock,
        [selectedOption]: prevStock[selectedOption] - quantity,
      }));

      setHistory([newEntry, ...history]);
      setInputValue("");
      setNote("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-around items-center p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-white transition-all duration-300">
      {/* Image Section */}
      <div className="p-6">
        <Image src="/vercel.svg" width={100} height={100} alt="Product Image" />
      </div>

      {/* Product Details Section */}
      <div className="p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-white">Product</h1>

        {/* Input and Selection UI */}
        <div className="flex flex-col gap-2">
          <input
            type="number"
            min="1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter quantity..."
          />
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value as StockOption)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md transition-all duration-200"
          >
            <option value="bags">Bags</option>
            <option value="packets">Packets</option>
            <option value="cartons">Cartons</option>
          </select>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter notes (optional)..."
          />
          <div className="flex gap-4">
            <button
              onClick={handleImportStock}
              disabled={!inputValue || Number(inputValue) <= 0}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Import Goods
            </button>
            <button
              onClick={handleExportStock}
              disabled={!inputValue || Number(inputValue) <= 0 || stock[selectedOption] < Number(inputValue)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Export Goods
            </button>
          </div>
        </div>

        {/* Stock Display */}
        <div className="text-xl font-semibold">
          <h2 className="text-gray-300">Stock:</h2>
          <ul className="list-disc pl-5">
            {Object.entries(stock).map(([key, value]) =>
              value > 0 ? (
                <li key={key} className="capitalize text-white">
                  {key}: {value}
                </li>
              ) : null
            )}
          </ul>
        </div>

        {/* History Link */}
        <div className="mt-4">
          <Link href="/history" className="text-blue-400 hover:underline">
            View Stock History
          </Link>
        </div>
      </div>
    </div>
  );
}