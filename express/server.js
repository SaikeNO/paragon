const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;
const receiptFilePath = path.join(__dirname, "receipts.json");

app.use(cors());
app.use(express.json());

const readReceipts = () => {
  try {
    const data = fs.readFileSync(receiptFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeReceipts = (data) => {
  fs.writeFileSync(receiptFilePath, JSON.stringify(data, null, 2));
};

app.get("/receipts", (req, res) => {
  const receipts = readReceipts();
  res.json(receipts);
});

app.post("/receipts", (req, res) => {
  const receipts = readReceipts();
  const newItem = req.body;
  receipts.push(newItem);
  writeReceipts(receipts);
  res.status(204).json();
});

app.put("/receipts/:index", (req, res) => {
  const index = req.params.index;
  const updatedItem = req.body;
  const receipts = readReceipts();

  if (index >= 0 && index < receipts.length) {
    receipts[index] = updatedItem;
    writeReceipts(receipts);
    res.json(updatedItem);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

app.delete("/receipts/:index", (req, res) => {
  const index = req.params.index;
  const receipts = readReceipts();

  if (index >= 0 && index < receipts.length) {
    const removedItem = receipts.splice(index, 1);
    writeReceipts(receipts);
    res.json(removedItem);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
