const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3002;

// 🔐 Toggle security mode
const SECURE_MODE = false;

// Load data
function loadData() {
  return JSON.parse(fs.readFileSync("data.json"));
}

// Save data
function saveData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

// =========================
// 🟢 LOGIN (VULNERABLE)
// =========================
app.post("/login", (req, res) => {
  const { id, password } = req.body;
  const data = loadData();

  const user = data.users.find(u => u.id == id && u.password == password);

  if (!user) return res.json({ error: "Invalid login" });

  // ❌ No token/session (Broken Auth)
  res.json({ message: "Login success", userId: user.id });
});

// =========================
// 🟢 GET BALANCE
// =========================
app.get("/balance/:id", (req, res) => {
  const data = loadData();
  const user = data.users.find(u => u.id == req.params.id);

  if (!user) return res.json({ error: "User not found" });

  // ❌ Sensitive data exposure
  res.json(user);
});

// =========================
// 💀 SEND MONEY (VULNERABLE)
// =========================
app.post("/send", (req, res) => {
  const { fromUser, toUser, amount, requestId } = req.body;
  const data = loadData();

  const sender = data.users.find(u => u.id == fromUser);
  const receiver = data.users.find(u => u.id == toUser);

  if (!sender || !receiver) {
    return res.json({ error: "Invalid users" });
  }

  // =========================
  // 🔐 SECURITY FIXES
  // =========================
  if (SECURE_MODE) {
    // ✅ Validate amount
    if (amount <= 0 || amount > sender.balance) {
      return res.json({ error: "Invalid amount" });
    }

    // ✅ Prevent replay attack
    const exists = data.transactions.find(t => t.requestId === requestId);
    if (exists) {
      return res.json({ error: "Replay attack detected!" });
    }
  }

  // ❌ Insecure transaction (no validation in vulnerable mode)
  sender.balance -= amount;
  receiver.balance += amount;

  data.transactions.push({
    fromUser,
    toUser,
    amount,
    requestId: requestId || null,
    time: new Date()
  });

  saveData(data);

  res.json({ message: "Transaction successful" });
});

// =========================
// 📜 TRANSACTION HISTORY
// =========================
app.get("/transactions", (req, res) => {
  const data = loadData();

  // ❌ No authentication → anyone can see all transactions
  res.json(data.transactions);
});

// =========================
// 🚀 START SERVER
// =========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});