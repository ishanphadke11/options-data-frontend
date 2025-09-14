import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const Table = ({ data, minCommission, upperBound, maxSpread }) => {
  const [sorting, setSorting] = React.useState([]);

  const pairedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    const pairs = [];
    const now = new Date();
    const maxDiff = Math.min(upperBound, maxSpread);

    // Group by expiration date
    const grouped = data.reduce((acc, option) => {
      if (!acc[option.expiration_date]) acc[option.expiration_date] = [];
      acc[option.expiration_date].push(option);
      return acc;
    }, {});

    // Process each expiration group
    for (const exp in grouped) {
      const options = grouped[exp].sort(
        (a, b) => a.strike_price - b.strike_price
      );

      // Precompute expiry date + days diff once
      const expiryDate = new Date(exp);
      const diffDays = (expiryDate - now) / (1000 * 60 * 60 * 24);

      if (diffDays <= 0) continue; // expired, skip

      // Sliding window approach to avoid O(n²)
      for (let i = 0; i < options.length; i++) {
        for (
          let j = i + 1;
          j < options.length &&
          options[j].strike_price - options[i].strike_price <= maxDiff;
          j++
        ) {
          const lower = options[i];
          const upper = options[j];

          const strikeDiff = upper.strike_price - lower.strike_price;
          const premiumDiff = Math.abs(upper.premium - lower.premium);

          if (strikeDiff <= upperBound && premiumDiff >= minCommission) {
            const yearlyInterest =
              ((premiumDiff / strikeDiff) / diffDays) * 365 * 100;
            const monthlyInterest = yearlyInterest / 12;

            pairs.push({
              expiration_date: expiryDate, // raw date
              upper_strike: upper.strike_price,
              lower_strike: lower.strike_price,
              total_commission: premiumDiff,
              monthly_interest: monthlyInterest,
              yearly_interest: yearlyInterest,
            });
          }
        }
      }
    }
    return pairs;
  }, [data, minCommission, upperBound, maxSpread]);

  const columns = React.useMemo(
    () => [
      {
        header: "Expiration Date",
        accessorKey: "expiration_date",
        cell: (info) =>
          info.getValue().toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
      },
      {
        header: "Upper Bound Strike",
        accessorKey: "upper_strike",
      },
      {
        header: "Lower Bound Strike",
        accessorKey: "lower_strike",
      },
      {
        header: "Total Commission",
        accessorKey: "total_commission",
        cell: (info) => info.getValue().toFixed(2),
      },
      {
        header: "Monthly Interest (%)",
        accessorKey: "monthly_interest",
        cell: (info) => info.getValue().toFixed(2),
      },
      {
        header: "Yearly Interest (%)",
        accessorKey: "yearly_interest",
        cell: (info) => info.getValue().toFixed(2),
      },
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
