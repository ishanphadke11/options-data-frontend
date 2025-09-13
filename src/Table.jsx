import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const Table = ({ data, minCommission, upperBound, maxSpread }) => {
  const [sorting, setSorting] = React.useState([]);

  // Transform raw options into pairs
  const pairedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    const pairs = [];
    const now = new Date();

    // Group by expiration date
    const grouped = data.reduce((acc, option) => {
      const exp = option.expiration_date;
      if (!acc[exp]) acc[exp] = [];
      acc[exp].push(option);
      return acc;
    }, {});

    // Build pairs within each expiration group
    for (const exp in grouped) {
      const options = grouped[exp].sort(
        (a, b) => a.strike_price - b.strike_price
      );

      for (let i = 0; i < options.length; i++) {
        for (let j = i + 1; j < options.length; j++) {
          const lower = options[i];
          const upper = options[j];

          const strikeDiff = upper.strike_price - lower.strike_price;
          const premiumDiff = Math.abs(upper.premium - lower.premium);

          // Now also check against maxSpread
          if (
            strikeDiff <= upperBound &&
            premiumDiff >= minCommission &&
            strikeDiff <= maxSpread
          ) {
            // Calculate expiry difference in days
            const expiryDate = new Date(exp);
            const diffTime = expiryDate - now;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            let monthlyInterest = 0;
            let yearlyInterest = 0;

            if (diffDays > 0) {
              yearlyInterest =
                ((premiumDiff / strikeDiff) / diffDays) * 365 * 100;
              monthlyInterest = yearlyInterest / 12;
            }

            pairs.push({
              expiration_date: expiryDate.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              upper_strike: upper.strike_price,
              lower_strike: lower.strike_price,
              total_commission: premiumDiff.toFixed(2),
              monthly_interest: monthlyInterest.toFixed(2),
              yearly_interest: yearlyInterest.toFixed(2),
            });
          }
        }
      }
    }
    return pairs;
  }, [data, minCommission, upperBound, maxSpread]);

  const columns = React.useMemo(
    () => [
      { header: "Expiration Date", accessorKey: "expiration_date" },
      { header: "Upper Bound Strike", accessorKey: "upper_strike" },
      { header: "Lower Bound Strike", accessorKey: "lower_strike" },
      { header: "Total Commission", accessorKey: "total_commission" },
      { header: "Monthly Interest (%)", accessorKey: "monthly_interest" },
      { header: "Yearly Interest (%)", accessorKey: "yearly_interest" },
    ],
    []
  );

  const table = useReactTable({
    data: pairedData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full border-collapse border border-blue-600 text-sm">
        <thead className="bg-blue-600 text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 cursor-pointer select-none font-semibold text-left"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() ?? null]}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="even:bg-gray-100 odd:bg-white hover:bg-gray-200 text-black"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-3 border border-gray-300 text-center"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
