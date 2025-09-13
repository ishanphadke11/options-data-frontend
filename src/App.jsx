import { useState } from "react";
import Header from "./Header";
import OptionsForm from "./OptionsForm";
import LoadingScreen from "./LoadingScreen";
import Table from "./Table";

function App() {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [stockPrice, setStockPrice] = useState(null);
  const [filters, setFilters] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setFilters(formData);

    try {
      const query = new URLSearchParams({
        upper_bound: formData.upperBound,
        expiry: formData.expiry,
        min_commission: formData.minCommission,
        max_spread: formData.maxSpread,
      }).toString();

      const response = await fetch(
        `https://options-data-backend.onrender.com/options/${formData.symbol}?${query}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setStockPrice(data.stock_price); // <- backend gives current price
      setTableData(data.options);
    } catch (err) {
      console.error(err);
      alert("Error fetching options data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 text-white flex flex-col items-center justify-start p-10 space-y-8">
      <Header />
      <OptionsForm onSubmit={handleFormSubmit} />
      {loading && <LoadingScreen />}

      {tableData.length > 0 && filters && (
        <div className="w-full">
          {stockPrice !== null && (
            <h2 className="text-xl font-semibold mb-4 text-center">
              Current Stock Price: ${stockPrice}
            </h2>
          )}
          <Table
            data={tableData}
            stockPrice={parseFloat(stockPrice)}
            minCommission={parseFloat(filters.minCommission)}
            upperBound={parseFloat(filters.upperBound)}
            maxSpread={parseFloat(filters.maxSpread)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
