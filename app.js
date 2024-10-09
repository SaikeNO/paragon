let editingItemIndex = null;
let receipt;

const receiptBody = document.getElementById("receiptBody");
const totalPriceElement = document.getElementById("totalPrice");
const addItemButton = document.getElementById("addItemButton");
const itemDialog = document.getElementById("itemDialog");
const itemForm = document.getElementById("itemForm");
const itemName = document.getElementById("itemName");
const itemQuantity = document.getElementById("itemQuantity");
const itemPrice = document.getElementById("itemPrice");
const cancelDialogButton = document.getElementById("cancelDialog");

const calculateTotal = () => {
  const total = receipt.reduce((sum, item) => sum + item.quantity * item.price, 0);
  totalPriceElement.textContent = `${total.toFixed(2)} zł`;
};

const renderReceipt = async () => {
  receipt = await fetchReceipts();

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

const addEditItem = async (event) => {
  event.preventDefault();

  const item = {
    name: itemName.value,
    quantity: parseFloat(itemQuantity.value),
    price: parseFloat(itemPrice.value),
  };

  if (!item.name || item.quantity <= 0 || item.price <= 0) {
    alert("Wprowadź poprawne dane.");
    return;
  }

  if (editingItemIndex !== null) {
    await updateReceipt(editingItemIndex, item);
  } else {
    await addReceipt(item);
  }

  await renderReceipt();
  closeDialog();
};

const editItem = (index) => {
  const item = receipt[index];
  editingItemIndex = index;
  openDialog(item);
};

const deleteItem = async (index) => {
  if (confirm("Czy na pewno chcesz usunąć tę pozycję?")) {
    await deleteReceipt(index);
    await renderReceipt();
  }
};

addItemButton.addEventListener("click", () => openDialog());

itemForm.addEventListener("submit", addEditItem);

cancelDialogButton.addEventListener("click", closeDialog);

renderReceipt();
