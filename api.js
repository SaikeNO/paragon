const API_URL = "http://localhost:3000/receipts";

const fetchReceipts = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Error fetching receipts:", error);
  }
};

const addReceipt = async (item) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding receipt:", error);
  }
};

const updateReceipt = async (index, item) => {
  try {
    const response = await fetch(`${API_URL}/${index}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating receipt:", error);
  }
};

const deleteReceipt = async (index) => {
  try {
    const response = await fetch(`${API_URL}/${index}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting receipt:", error);
  }
};
