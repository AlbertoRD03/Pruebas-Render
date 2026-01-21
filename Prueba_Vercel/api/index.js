import express from "express";

const app = express();
app.use(express.json());

let nextId = 3;
let items = [
  { id: 1, name: "alpha" },
  { id: 2, name: "beta" },
];

app.get("/time", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "express-api",
    time: new Date().toISOString(),
  });
});

app.get("/items", (_req, res) => {
  res.status(200).json({ ok: true, items });
});

app.post("/items", (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  if (!name) {
    return res.status(400).json({ ok: false, error: "name_required" });
  }

  const item = { id: nextId++, name };
  items.push(item);
  res.status(201).json({ ok: true, item });
});

app.put("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  if (!Number.isFinite(id)) {
    return res.status(400).json({ ok: false, error: "invalid_id" });
  }
  if (!name) {
    return res.status(400).json({ ok: false, error: "name_required" });
  }

  const item = items.find((entry) => entry.id === id);
  if (!item) {
    return res.status(404).json({ ok: false, error: "not_found" });
  }

  item.name = name;
  res.status(200).json({ ok: true, item });
});

app.delete("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ ok: false, error: "invalid_id" });
  }

  const before = items.length;
  items = items.filter((entry) => entry.id !== id);
  if (items.length === before) {
    return res.status(404).json({ ok: false, error: "not_found" });
  }

  res.status(200).json({ ok: true });
});

export default function handler(req, res) {
  return app(req, res);
}
