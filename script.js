//ZA NOVU STAVKU DATUM DEFAULT VALUE = DANASNJI DAN
let currentDate = (document.getElementById("currentDate").valueAsDate =
  new Date());

// html nodes variables
const editItemForm = document.getElementById("editItemForm");
const editItemButton = document.getElementById("editItemButton");
const addNewItemForm = document.getElementById("addNewItemForm");
const addNewItemButton = document.getElementById("addNewItemButton");
const statusMsg = document.getElementById("statusMsg");
const orderHistory = document.getElementById("orderHistory");
const activeOrders = document.getElementById("activeOrders");
const allOrders = document.getElementById("allOrders");

// array to save all items got from backend
let items = [];

// function to display message from backend
const displayStatusMsg = async (message) => {
  statusMsg.innerHTML = message;
  await new Promise((r) => setTimeout(r, 3000));
  statusMsg.innerHTML = "";
};

// function to send a request to backend
const sendRequest = async (url, method, payload) => {
  try {
    const response = await fetch(url, {
      method,
      body: payload,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    displayStatusMsg(data.message);
    return data;
  } catch (e) {
    console.error(e);
  }
};

// TODO: refactor the function to create array of item divs and display them in html
async function getData(url) {
  const data = await sendRequest(url, "GET", null);
  items = await data;
  // Find the table element
  const table = document.getElementById("myTable");
  var tableHTML = "";
  items.forEach((item) => {
    tableHTML += "<tr>";
    Object.values(item).forEach((element) => {
      tableHTML += "<td>" + element + "</td>";
    });
    tableHTML += "</tr>";
  });

  table.innerHTML = tableHTML;
}

// FUNKCIJA KOJA PRATI KOJI BUTTON JE KLIKNUT I EXECUTEA SENDREQUEST PO URLU I MIJENJA TEKST
// TODO: refactor the function
function handleButtonClick(button) {
  button.addEventListener("click", function (e) {
    e.preventDefault();

    if (button === addNewItemButton) {
      const payload = new FormData(button);
      sendRequest("http://192.168.86.127:3000/items/add/", "POST", payload);
    } else if (button === editItemButton) {
      const payload = new FormData(button);
      sendRequest("http://192.168.86.127:3000/items/edit/", "POST", payload);
    } else if (button === allOrders) {
      // svi itemi
      var heading = "Narudžbe: sve";
      var div = document.getElementById("heading");
      div.textContent = heading;
      getData("http://192.168.86.127:3000/items/");
    } else if (button === orderHistory) {
      var heading = "Narudžbe: riješene";
      var div = document.getElementById("heading");
      div.textContent = heading;
      getData("http://192.168.86.127:3000/items/"); //urediti url za neaktivne predmete
    } else if (button === activeOrders) {
      var heading = "Narudžbe: aktivne";
      var div = document.getElementById("heading");
      div.textContent = heading;
      getData("http://192.168.86.127:3000/items/"); //urediti url za aktivne predmete
    }
  });
}

// embed the functions to buttons
//POZIVANJE FUNKCIJA
handleButtonClick(addNewItemButton);
handleButtonClick(allOrders);
handleButtonClick(editItemButton);
handleButtonClick(activeOrders);
handleButtonClick(orderHistory);
