let receipt = JSON.parse(localStorage.getItem("receiptItems")) || [];
let editingItemIndex = null;

const receiptBody = document.getElementById("receiptBody");
const totalPriceElement = document.getElementById("totalPrice");
const addItemButton = document.getElementById("addItemButton");
const itemDialog = document.getElementById("itemDialog");
const itemForm = document.getElementById("itemForm");
const itemName = document.getElementById("itemName");
const itemQuantity = document.getElementById("itemQuantity");
const itemPrice = document.getElementById("itemPrice");
const cancelDialogButton = document.getElementById("cancelDialog");

const saveReceipt = () => {
  localStorage.setItem("receiptItems", JSON.stringify(receipt));
};

const calculateTotal = () => {
  const total = receipt.reduce((sum, item) => sum + item.quantity * item.price, 0);
  totalPriceElement.textContent = `${total.toFixed(2)} zł`;
};

const renderReceipt = () => {
  receiptBody.innerHTML = "";
  receipt.forEach((item, index) => {
    const row = document.createElement("tr");

    const lpCell = document.createElement("td");
    lpCell.textContent = index + 1;
    row.appendChild(lpCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = item.name;
    row.appendChild(nameCell);

    const quantityCell = document.createElement("td");
    quantityCell.textContent = item.quantity;
    row.appendChild(quantityCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = `${item.price.toFixed(2)} zł`;
    row.appendChild(priceCell);

    const totalCell = document.createElement("td");
    totalCell.textContent = `${(item.quantity * item.price).toFixed(2)} zł`;
    row.appendChild(totalCell);

    const actionsCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.textContent = "Edytuj";
    editButton.addEventListener("click", () => editItem(index));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Usuń";
    deleteButton.addEventListener("click", () => deleteItem(index));

    actionsCell.classList.add("actions");
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);

    receiptBody.appendChild(row);
  });

  calculateTotal();
};

const openDialog = (item = {}) => {
  itemName.value = item.name || "";
  itemQuantity.value = item.quantity || "";
  itemPrice.value = item.price || "";
  itemDialog.showModal();
};

const closeDialog = () => {
  itemDialog.close();
  editingItemIndex = null;
};

const addItem = (event) => {
  event.preventDefault();

  const name = itemName.value;
  const quantity = parseFloat(itemQuantity.value);
  const price = parseFloat(itemPrice.value);

  if (!name || quantity <= 0 || price <= 0) {
    alert("Wprowadź poprawne dane.");
    return;
  }

  if (editingItemIndex !== null) {
    receipt[editingItemIndex] = { name, quantity, price };
  } else {
    receipt.push({ name, quantity, price });
  }

  saveReceipt();
  renderReceipt();
  closeDialog();
};

const editItem = (index) => {
  const item = receipt[index];
  editingItemIndex = index;
  openDialog(item);
};

const deleteItem = (index) => {
  if (confirm("Czy na pewno chcesz usunąć tę pozycję?")) {
    receipt.splice(index, 1);
    saveReceipt();
    renderReceipt();
  }
};

addItemButton.addEventListener("click", () => {
  openDialog();
});

itemForm.addEventListener("submit", addItem);

cancelDialogButton.addEventListener("click", closeDialog);

renderReceipt();
