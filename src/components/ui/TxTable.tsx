import { T } from "@/lib/theme";
import { Transaction } from "@/lib/data";
import Badge from "./Badge";

export default function TxTable({ data }: { data: Transaction[] }) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ background: `${T.bg}88` }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wider cinzel"
            style={{ borderBottom: `1px solid ${T.border}`, color: T.mutedDk }}>
            {["Member","Type","Amount","Date","Status"].map(h => (
              <th key={h} className="text-left py-3 px-4 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(tx => (
            <tr key={tx.id} style={{ borderBottom: `1px solid ${T.border2}` }}>
              <td className="py-3 px-4 font-medium" style={{ color: T.cream }}>{tx.user}</td>
              <td className="py-3 px-4">
                <span className="text-xs px-2 py-1 rounded-lg font-medium cinzel"
                  style={{ background: `${T.gold}18`, color: T.gold }}>{tx.type}</span>
              </td>
              <td className="py-3 px-4 font-bold" style={{ color: T.goldLt }}>{tx.amount}</td>
              <td className="py-3 px-4" style={{ color: T.mutedDk }}>{tx.date}</td>
              <td className="py-3 px-4"><Badge status={tx.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}