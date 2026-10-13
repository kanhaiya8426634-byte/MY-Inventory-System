
"use client";

import { useState } from "react";

const initialItems = [
  {
    id: 1,
    code: "MAT-001",
    name: "Bearing",
    unit: "Nos",
    stock: 25,
    min: 20,
    max: 50,
  },
  {
    id: 2,
    code: "MAT-002",
    name: "Steel Bar",
    unit: "Kg",
    stock: 12,
    min: 20,
    max: 100,
  },
];

export default function Home() {
  const [items, setItems] = useState(initialItems);
  const [tab, setTab] = useState("Dashboard");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState("Nos");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [selected, setSelected] = useState("1");
  const [movement, setMovement] = useState("IN");
  const [message, setMessage] = useState("");

  const totalStock = items.reduce((sum, i) => sum + i.stock, 0);
  const lowStock = items.filter((i) => i.stock < i.min).length;

  function addItem(e) {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    if (items.some((i) => i.code === code.trim())) {
      setMessage("यह Item Code पहले से मौजूद है।");
      return;
    }
    setItems([
      ...items,
      {
        id: Date.now(),
        code: code.trim(),
        name: name.trim(),
        unit,
        stock: 0,
        min: Number(min),
        max: Number(max),
      },
    ]);
    setName("");
    setCode("");
    setMin(0);
    setMax(0);
    setMessage("Item जोड़ा गया।");
  }

  function saveMovement(e) {
    e.preventDefault();
    const amount = Number(qty);
    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Quantity शून्य से अधिक होनी चाहिए।");
      return;
    }

    const item = items.find((i) => String(i.id) === selected);
    if (!item) return;

    if (movement === "OUT" && amount > item.stock) {
      setMessage("पर्याप्त Stock उपलब्ध नहीं है।");
      return;
    }

    setItems(items.map((i) => {
      if (i.id !== item.id) return i;
      return {
        ...i,
        stock: i.stock + (movement === "IN" ? amount : -amount),
      };
    }));
    setMessage("Stock Entry दर्ज हुई।");
    setQty(1);
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f3f6fb",
      color: "#172033",
      fontFamily: "Arial, sans-serif",
      padding: 24
    }}>
      <header style={{
        background: "#12345a",
        color: "white",
        padding: 24,
        borderRadius: 14,
        marginBottom: 20
      }}>
        <h1 style={{ margin: 0 }}>MY Inventory System</h1>
        <p style={{ marginBottom: 0 }}>
          Stock Management · Purchase · Reports
        </p>
      </header>

      <nav style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        marginBottom: 20
      }}>
        {["Dashboard", "Item Master", "Stock In/Out", "Purchase", "Reports"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "12px 16px",
            border: 0,
            borderRadius: 8,
            cursor: "pointer",
            background: tab === t ? "#1769aa" : "white",
            color: tab === t ? "white" : "#172033"
          }}>{t}</button>
        ))}
      </nav>

      {message && (
        <p role="status" style={{
          background: "#e0f2e8",
          padding: 12,
          borderRadius: 8
        }}>{message}</p>
      )}

      {tab === "Dashboard" && (
        <>
          <h2>Dashboard</h2>
          <section style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 16
          }}>
            {[
              ["Total Items", items.length],
              ["Total Stock Qty", totalStock],
              ["Low Stock Items", lowStock],
              ["Max Stock Alerts", items.filter((i) => i.stock > i.max && i.max > 0).length]
            ].map(([label, value]) => (
              <article key={label} style={{
                background: "white",
                padding: 22,
                borderRadius: 12,
                boxShadow: "0 2px 8px #0000000a"
              }}>
                <p>{label}</p>
                <h2>{value}</h2>
              </article>
            ))}
          </section>
          <h3>Stock Summary</h3>
          <StockTable items={items} />
        </>
      )}

      {tab === "Item Master" && (
        <>
          <h2>Add New Item</h2>
          <form onSubmit={addItem} style={formStyle}>
            <label>Item Code
              <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="MAT-003" style={inputStyle}/>
            </label>
            <label>Item Name
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" style={inputStyle}/>
            </label>
            <label>Unit
              <select value={unit} onChange={(e) => setUnit(e.target.value)} style={inputStyle}>
                <option>Nos</option><option>Kg</option><option>Meter</option><option>Liter</option>
              </select>
            </label>
            <label>Minimum Stock
              <input type="number" min="0" value={min} onChange={(e) => setMin(e.target.value)} style={inputStyle}/>
            </label>
            <label>Maximum Stock
              <input type="number" min="0" value={max} onChange={(e) => setMax(e.target.value)} style={inputStyle}/>
            </label>
            <button style={primaryButton}>Add Item</button>
          </form>
          <StockTable items={items} />
        </>
      )}

      {tab === "Stock In/Out" && (
        <>
          <h2>Stock Movement</h2>
          <form onSubmit={saveMovement} style={formStyle}>
            <label>Item
              <select value={selected} onChange={(e) => setSelected(e.target.value)} style={inputStyle}>
                {items.map((i) => <option key={i.id} value={i.id}>{i.code} — {i.name}</option>)}
              </select>
            </label>
            <label>Movement
              <select value={movement} onChange={(e) => setMovement(e.target.value)} style={inputStyle}>
                <option value="IN">Stock In</option>
                <option value="OUT">Stock Out</option>
              </select>
            </label>
            <label>Quantity
              <input type="number" min="0.01" step="0.01" required value={qty} onChange={(e) => setQty(e.target.value)} style={inputStyle}/>
            </label>
            <button style={primaryButton}>Save Entry</button>
          </form>
          <StockTable items={items} />
        </>
      )}

      {tab === "Purchase" && (
        <>
          <h2>Purchase Entry</h2>
          <p>यह शुरुआती स्क्रीन है। अगली फाइलों में Supplier, Invoice, Rate और Purchase को Database से जोड़ा जाएगा।</p>
          <StockTable items={items} />
        </>
      )}

      {tab === "Reports" && (
        <>
          <h2>Inventory Reports</h2>
          <p>Low Stock Items: {lowStock}</p>
          <StockTable items={items.filter((i) => i.stock < i.min)} />
          <button style={primaryButton} onClick={() => {
            const csv = [
              ["Item Code", "Item Name", "Unit", "Stock", "Min", "Max"],
              ...items.map((i) => [i.code, i.name, i.unit, i.stock, i.min, i.max])
            ].map((r) => r.join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "inventory-report.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}>Export Stock CSV</button>
        </>
      )}

      <p style={{ color: "#667085", marginTop: 28 }}>
        Demo version: Entries अभी browser memory में हैं, Database में Save नहीं होतीं।
      </p>
    </main>
  );
}

function StockTable({ items }) {
  return (
    <div style={{ overflowX: "auto", marginTop: 16, background: "white", borderRadius: 10 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr>
            {["Item Code", "Item Name", "Unit", "Current Stock", "Min Stock", "Max Stock", "Status"].map((h) => (
              <th key={h} style={{ padding: 12, borderBottom: "1px solid #ddd" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td style={cellStyle}>{i.code}</td>
              <td style={cellStyle}>{i.name}</td>
              <td style={cellStyle}>{i.unit}</td>
              <td style={cellStyle}>{i.stock}</td>
              <td style={cellStyle}>{i.min}</td>
              <td style={cellStyle}>{i.max}</td>
              <td style={cellStyle}>
                {i.stock < i.min ? "LOW STOCK" : i.max > 0 && i.stock > i.max ? "OVERSTOCK" : "OK"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const formStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  alignItems: "end",
  background: "white",
  padding: 20,
  borderRadius: 12
};

const inputStyle = {
  display: "block",
  marginTop: 6,
  padding: 10,
  minWidth: 160,
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #ccd3dd",
  borderRadius: 6
};

const primaryButton = {
  background: "#1769aa",
  color: "white",
  border: 0,
  padding: "12px 18px",
  borderRadius: 7,
  cursor: "pointer"
};

const cellStyle = {
  padding: 12,
  borderBottom: "1px solid #eee"
};
