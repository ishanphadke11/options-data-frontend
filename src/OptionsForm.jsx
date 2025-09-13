// src/components/OptionsForm.jsx
import { useState } from "react";

const OptionsForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    symbol: "",
    upperBound: "",
    expiry: "",
    minCommission: "",
    maxSpread: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-wrap items-center justify-center gap-6 mb-6"
    >
      {/* Ticker Symbol */}
      <div className="flex flex-col w-40">
        <label className="mb-1 text-sm font-medium text-white">Ticker Symbol</label>
        <input
          type="text"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          placeholder="e.g. AAPL"
          required
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-500 text-black"
        />
      </div>

      {/* Upper Bound Strike % */}
      <div className="flex flex-col w-40">
        <label className="mb-1 text-sm font-medium text-white">Upper Bound %</label>
        <input
          type="number"
          step="1"
          name="upperBound"
          value={formData.upperBound}
          onChange={handleChange}
          placeholder="Upper Bound %"
          required
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-500 text-black"
        />
      </div>

      {/* Expiry */}
      <div className="flex flex-col w-40">
        <label className="mb-1 text-sm font-medium text-white">Expiry (days)</label>
        <input
          type="number"
          name="expiry"
          value={formData.expiry}
          onChange={handleChange}
          placeholder="Expiry in days"
          required
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-500 text-black"
        />
      </div>

      {/* Min Commission */}
      <div className="flex flex-col w-40">
        <label className="mb-1 text-sm font-medium text-white">Min Commission</label>
        <input
          type="number"
          step="0.01"
          name="minCommission"
          value={formData.minCommission}
          onChange={handleChange}
          placeholder="Min Commission"
          required
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-500 text-black"
        />
      </div>

      {/* Max Spread */}
      <div className="flex flex-col w-40">
        <label className="mb-1 text-sm font-medium text-white">Max Spread</label>
        <input
          type="number"
          step="0.01"
          name="maxSpread"
          value={formData.maxSpread}
          onChange={handleChange}
          placeholder="Max Spread"
          required
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-500 text-black"
        />
      </div>

      {/* Submit Button */}
      <div className="flex flex-col justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-2 px-4 rounded-md"
        >
          Retrieve Options
        </button>
      </div>
    </form>
  );
};

export default OptionsForm;
