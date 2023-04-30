const ip = "http://127.0.0.1:3000/";

// html nodes variables
const editItemForm = document.getElementById("editItemForm");
const editItemButton = document.getElementById("editItemButton");
const addNewItemForm = document.getElementById("addNewItemForm");
const addNewItemButton = document.getElementById("addNewItemButton");
const statusMsg = document.getElementById("statusMsg");
const orderHistory = document.getElementById("orderHistory");
const activeOrders = document.getElementById("activeOrders");
const allOrders = document.getElementById("allOrders");

// function to display message from backend
const displayStatusMsg = async (message) => {
  statusMsg.innerHTML = `
    <div class="alert alert-success" role="alert" style='display: inline-block;'>
      ${message}
    </div>
  `;
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

// TODO: change the function to find and populate the desired element (div)
const populateItems = async (data) => {
  const itemsContainer = document.getElementById("itemsContainer");
  itemsContainer.innerHTML = "";

  data.forEach((e) => {
    let item = document.createElement("div");

    item.innerHTML = `
    
    <div>
    <div class="item-container" onclick="getPartsById(${e.id})"> \
    <div class="id"> \
        <h1 class="id">${e.id}</h1> \
        <h2 class="id">Datum:</h2> \
        <h2>${e.date}</h2> \
      </div> \
      <div class="basic-info"> \
        <h2 style="margin-bottom: 20px"> \
          Klijent: <strong>${e.name}</strong> </h2>
        
        <h2 style="margin-bottom: 20px">  Proizvođač: <strong>${e.manufacturer}</strong> \
        </h2> \
        <h2> \
          Vrsta aparata i model: <strong>${e.type}</strong> \
        </h2> \
      
      </div> \
      <div class="order-info"> \
        <h2> \
          Ukupno EUR:<strong>${e.totalAmount}</strong> \
        </h2> \
        <h2 style="margin-bottom: 20px"> \
          Polog EUR: <strong >${e.downpayment}</strong> \
        </h2> \
        <h2> \
          Obaviješten: <strong >${e.customerNotifiedAt}</strong> \
        </h2> \
        <h2> \
          Gotovo: <strong>${e.orderDoneAt}</strong> \
        </h2> \
      </div> \
      <div class="note"> \
        <p> Napomena: ${e.note} <p>
      </div> \
      
      <div class="buttons" style="display: flex;
            flex-direction: row; margin: 20px; max-height: 130px";>
      <div class="btn-group-vertical"
              style="margin-right: 5px"
              role="group"
              aria-label="Vertical button group"> \
          <button
                type="button"
                style="font-size: 14px"
                class="btn btn-outline-dark"
                data-bs-toggle="modal"
                
          
          onclick="addOrEditItem(${e.id})">Edit</button>\
          <button 
                type="button"
                class="btn btn-outline-dark"
                data-bs-toggle="modal"
                data-bs-target="#deleteItem"
                style="font-size: 14px"
                onclick="deleteItem(${e.id})"
                >Delete</button> \
        </div> \
      <div class="btn-group-vertical">\
            
              <button\
                type="button" \
                class="btn btn-outline-dark" \
                data-bs-toggle="modal" \
                data-bs-target="#addPart"
                style="font-size: 14px" \
                onclick="addOrEditPart(${e.id})"
              > \
                Dodaj dio \
              </button> \
              <button
                style='padding: 22px'
                type="button"
                class="btn btn-outline-warning"
                onclick="itemsPrint(${e.id})"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-printer-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"
                  />
                  <path
                    d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"
                  />
                </svg>
              </button> \
            </div>
            </div>  \
      
      </div>`;
    itemsContainer.append(item);
  });
};

// gets items by active, non-active, all and current month/year
const getItemsByOrderStatus = async (isOrderDone) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // JavaScript months are zero-based, so we add 1 to get the current month number
  const currentYear = today.getFullYear();

  let url = ip + "items/";
  if (isOrderDone === true) {
    url += "?orderDone=notnull";
    toggleHeading(": riješene");
  } else if (isOrderDone === false) {
    url += "?orderDone=null";
    toggleHeading(": aktivne");
  } else if (isOrderDone === "currentMonth") {
    url = `${ip}items/month/`;
    toggleHeading(": tekući mjesec");
  }

  const data = await sendRequest(url, "GET");
  populateItems(data.data);
};

//open modal for deletion
const deleteItem = async (id) => {
  let deleteModal = document.getElementById("modalItem");
  deleteModal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Jeste li sigurni da želite obrisati ovu stavku?</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
       
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Ne želim</button>
          <button type="button" class="btn btn-warning" data-bs-dismiss="modal" onclick="deleteConfirmed(${id})">Potvrdi</button>
      </div>
    </div>
  `;

  // show the modal
  new bootstrap.Modal(deleteModal).show();
};

//delete item and close modal
const deleteConfirmed = async (id) => {
  const payload = new FormData();
  payload.append("id", id);
  await sendRequest(ip + "items/delete/", "DELETE", payload);
  return;
};

const deletePart = async (itemFK, id) => {
  let deleteModal = document.getElementById("modalItem");
  deleteModal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Jeste li sigurni da želite obrisati ovu stavku?</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Ne želim</button>
          <button type="button" class="btn btn-warning" data-bs-dismiss="modal" onclick="deletePartConfirmed(${itemFK}, ${id})">Potvrdi</button>
        </div>
      </div>
    </div>
  `;

  // show the modal
  new bootstrap.Modal(deleteModal).show();
};

const deletePartConfirmed = async (itemFK, id) => {
  const response = await sendRequest(
    ip + `parts/${id}?itemFK=${itemFK}`,
    "DELETE"
  );
  console.log(response);
};

// FUNCTION FOR REFRESHING THE LAST VIEWED PAGES by criteria: last button pressed = last triggered function is getting refreshed
let lastCalledFunction = getItemsByOrderStatus; // initially set to default function

// function to be called on button click
const refreshOtherFunction = (func) => {
  lastCalledFunction = func;
  localStorage.setItem("lastCalledFunction", func.toString()); // store the function as a string
  func();
};

// function to refresh the last called function
const refreshLastCalledFunction = () => {
  lastCalledFunction();
};

setInterval(refreshLastCalledFunction, 15000);

const saveItem = async (id = "") => {
  let form = document.getElementById("ItemForm");
  let payload = new FormData(form);
  if (id !== "") {
    payload.append("id", id);
    const response = await sendRequest(ip + "items/edit/", "PUT", payload);
    return;
  }
  const response = await sendRequest(ip + "items/add/", "POST", payload);
  return false;
};

// Function for heading text
function toggleHeading(newText) {
  var dynamicHeadingSpan = document.getElementById("heading");
  dynamicHeadingSpan.textContent = " ";
  dynamicHeadingSpan.textContent = newText;
}

// Funkcija za populate print
const itemsPrint = async (id) => {
  const response = await sendRequest(ip + `items/${id}`);
  const itemData = response.data;

  const partsResponse = await sendRequest(ip + `items/parts/${id}`);
  const partsData = partsResponse.data;

  // Create new popup window for printing
  const printWindow = window.open("");

  // Populate the popup window with content
  printWindow.document.write(`
    <html>
      <head>
        <style type="text/css">
          @media print {
            @page {
              size: 57mm auto;
              margin: 0;
            }
            body {
              font-size: 10pt;
            }
            h1, h2, h3 {
              font-size: 12pt;
            }
          }
        </style>
      </head>
      <body>
        <div>
          <h2>Narudžba br. ${itemData.id}</h2>
        </div>
        <div>
          <p>Klijent: <strong>${itemData.name}</strong></p> 
          <p>Datum kreiranja narudžbe: ${itemData.date}</p> 
        </div>
        <div>
          <p>Proizvođač: <strong>${itemData.manufacturer}</strong></p>  
          <p>Vrsta aparata i model: <strong>${itemData.type}</strong></p> 
        </div>
        <div>
          <p>Polog EUR: <strong>${itemData.downpayment}</strong></p>
        </div>

        <div id="partsPrint">

        </div>

      </body>
    </html>
  `);

  // Populate parts data
  const partsContainer = printWindow.document.getElementById("partsPrint");
  partsData.forEach((part, i) => {
    const partDiv = document.createElement("div");
    partDiv.innerHTML = `
      <div>
        <h2>Dio ${i + 1}: <strong> ${part.description}</strong></h2>
      </div>
    `;
    partsContainer.append(partDiv);
  });

  // Focus on the popup window and initiate print
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

const getPartsById = async (id) => {
  let url = ip + `items/parts/${id}`;
  const payload = new FormData();
  payload.append("itemID", id);
  const data = await sendRequest(url, "GET");
  populateParts(data.data);
};

// const savePart = async (id = "") => {

const savePart = async (id = "") => {
  let form = document.getElementById("PartForm");
  let payload = new FormData(form);

  if (id !== "") {
    payload.append("id", id);
    console.log("ID if the id is not null: " + id);
    console.log(payload.description);
    const response = await sendRequest(ip + `parts/edit/${id}`, "PUT", payload);
    console.log(response);
    return;
  }
  const response = await sendRequest(ip + "parts/add/", "POST", payload);
  console.log(response);
  return;
};

const populateParts = async (data) => {
  const partsContainer = document.getElementById("partsContainer");
  partsContainer.innerHTML = "";

  data.forEach((e) => {
    let part = document.createElement("div");

    part.innerHTML = `
    <div class="part-container3">
              <div class="parts-info row">
                <h2 style="padding-bottom: 15px">Opis: <strong> ${e.description}</strong></h2>
                <div class="d-flex">
  <div class="col-sm-6">
    <h2>Došao:</h2>
  </div>
  <div class="col-sm-6">
    <h2><strong>${e.arrivedAt}</strong></h2>
  </div>
</div>

<div class="d-flex">
  <div class="col-sm-6">
    <h2>Isporučen:</h2>
  </div>
  <div class="col-sm-6">
    <h2><strong>${e.sentAt}</strong></h2>
  </div>
</div>


  
              </div>
              <div class="parts-date row">
                <div>
                  <button
                  onclick="addOrEditPart('${e.itemFK}', '${e.id}')"
                    type="button"
                    class="btn btn-outline-dark btn-sm"
                    data-bs-toggle="modal"
                  >
                    Uredi dio
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-dark btn-sm"
                    data-bs-toggle="modal"
                    onclick="deletePart('${e.itemFK}', '${e.id}');" 
                  >
                    Obriši dio
                  </button>
                </div>
              </div>
            </div>
    `;
    partsContainer.append(part);
  });
};

const addOrEditPart = async (itemFK, id = "") => {
  let response;

  if (id != "") {
    response = await sendRequest(ip + `parts/${id}`);
    console.log("Value of description field: " + response.data.description);
  }

  let modal = document.getElementById("modalItem");
  modal.innerHTML = `
    <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 mx-auto" id="staticBackdropLabel">
              ${id !== "" ? "Uredi dio" : "Dodaj dio"}
            </h1>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form id="PartForm">

          <div class="mb-3" style="margin: 20px">
            <label for="formGroupExampleInput" class="form-label"
              >Opis dijela</label
            >
            <textarea
              name="description"
              class="form-control2"
              style="height: 150px"
              value="${id !== "" ? response.data.description : ""}"
            >${id !== "" ? response.data.description : ""}</textarea>
          </div>
          <div class="modal-body">
              <div style="display: grid; grid-template-columns: 50% 50%">
                <div class="box mb-3">
                  <label for="formGroupExampleInput" class="form-label"
                    >Dio: Došao dana
                  </label>
                  <input type="date" name="arrivedAt" class="form-control" value="${
                    id !== "" ? response.data.arrivedAt : ""
                  }" />
              
                </div>

                <div class="box mb-3">
                  <label for="formGroupExampleInput" class="form-label"
                    >Dio: Isporučen dana</label
                  >
                  <input type="date" name="sentAt" class="form-control" value="${
                    id !== "" ? response.data.sentAt : ""
                  }" />
                  
                </div>

                <input type="hidden" name="itemFK" value="${itemFK}" />
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button
              
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Zatvori
            </button>
            <button
              type="button"
              id="addPartButton"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              onclick="${id !== "" ? `savePart(${id})` : "savePart()"}"
            >
              Spremi
            </button>
          </div>
        </div>
      </div>
  `;
  new bootstrap.Modal(modal).show();
};

// function to open a modal to add or edit a new item
const addOrEditItem = async (id = "") => {
  let response;
  if (id != "") {
    response = await sendRequest(ip + `items/${id}`);
    console.log(response.data.id);
  }
  let modal = document.getElementById("modalItem");
  modal.innerHTML = `
    <div class="modal-dialog modal-lg"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              ${id !== "" ? "Uredi stavku" : "Nova stavka"}
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form id="ItemForm">
              
              <div style="display: grid; grid-template-columns: 35% 65%">

              <div class="mb-3">
                <label for="formGroupExampleInput" class="form-label"
                  >Klijent</label
                >
                <input
                  type="text"
                  name="name"
                  class="form-control"
                  id="formGroupExampleInput"
                  value="${id !== "" ? response.data.name : ""}"
                />
              </div>

          
            </div>
              <div style="display: grid; grid-template-columns: 35% 65%">

              <div class="mb-3">
                <label for="formGroupExampleInput2" class="form-label"
                  >Proizvođač</label
                >
                <input
                  type="text"
                  name="manufacturer"
                  class="form-control"
                  id="formGroupExampleInput"
                  value="${id !== "" ? response.data.manufacturer : ""}"
                />
              </div>
              <div class="mb-3">
                <label for="formGroupExampleInput" class="form-label"
                  >Vrsta aparata i model</label
                >
                <input
                  type="text"
                  name="type"
                  class="form-control"
                  id="formGroupExampleInput"
                  value="${id !== "" ? response.data.type : ""}"
                />
              </div>
              </div>

            
            <div style="display: grid; grid-template-columns: 40% 40% 20%">
                <div class="mb-3">
                  <label for="formGroupExampleInput" class="form-label"
                    >Polog EUR</label
                  >
                  <input
                    type="number"
                    name="downpayment"
                    class="form-control"
                    value="${id !== "" ? response.data.downpayment : ""}"
                  />
                </div>
                <div class="mb-3">
                  <label for="formGroupExampleInput" class="form-label"
                    >Ukupno EUR</label
                  >
                  <input
                    type="number"
                    name="totalAmount"
                    class="form-control"
                    value="${id !== "" ? response.data.totalAmount : ""}"
                  />
                </div>

                <div class="mb-3">
                <label for="formGroupExampleInput2" class="form-label"
                  >Datum</label
                >
                <input
                  type="date"
                  name="date"
                  class="form-control"
                  id="currentDate"
                  value="${
                    id !== ""
                      ? response.data.date
                      : new Date().toISOString().slice(0, 10)
                  }"
                />
              </div>
              </div>

              <div
                style="display: grid; grid-template-columns: 33% 33% 33%"
              >
                <div class="box mb-3">
                  <label for="formGroupExampleInput" class="form-label"
                    >Vraćeno dana</label
                  >
                  <input type="date" name="returnedAt" class="form-control" value="${
                    id !== "" ? response.data.returnedAt : ""
                  }"/>
                </div>

                <div class="box mb-3">
                  <label for="formGroupExampleInput" class="form-label"
                    >Klijent obaviješten dana</label
                  >
                  <input
                    type="date"
                    name="customerNotifiedAt"
                    class="form-control"
                    value="${id !== "" ? response.data.customerNotifiedAt : ""}"
                  />
                </div>
                <div class="box mb-3">
                  <label for="formGroupExampleInput" class="form-label"
                    >Narudžba gotova (arhiva)</label
                  >
                  <input type="date" name="orderDoneAt" class="form-control" value="${
                    id !== "" ? response.data.orderDoneAt : ""
                  }"/>
                </div>
              </div>
              <div class="mb-3">
                <label for="formGroupExampleInput" class="form-label"
                  >Napomena</label
                >
                <textarea
                  name="note"
                  class="form-control2"
                  style="height: 200px"
                >${id !== "" ? response.data.note : ""}</textarea>
              </div>

              <div class="modal-footer">
                <button
                id="modalCloseButton"
                  type="button"
                  class="btn btn-secondary btn-lg"
                  data-bs-dismiss="modal"
                >
                  Zatvori
                </button>
                <div
                  id="addNewItemButton"
                  class="btn btn-primary btn-lg"
                  
          
                  onclick="${
                    id !== ""
                      ? `saveItem(${id}, event)`
                      : "saveItem(undefined, event)"
                  };"
                >
                  Spremi
                </div>
              </div>
              </form>

          </div>
        </div>
      </div>
  `;
  new bootstrap.Modal(modal).show();
};

// Set a global flag variable to indicate whether the modal is open or not
let isModalOpen = false;

// Add an event listener for the "shown.bs.modal" event
document
  .getElementById("modalItem")
  .addEventListener("shown.bs.modal", function () {
    isModalOpen = true;
  });

// Add an event listener for the "hidden.bs.modal" event
document
  .getElementById("modalItem")
  .addEventListener("hidden.bs.modal", function () {
    isModalOpen = false;
  });

// Add an event listener for the "keydown" event
document.addEventListener("keydown", function (event) {
  // Check if the other modal is open
  const otherModalBackdrop = document
    .getElementById("modalItem")
    .querySelector(".modal-backdrop");
  const otherModal = document
    .getElementById("modalItem")
    .querySelector(".modal.show");

  if (isModalOpen || otherModalBackdrop || otherModal) {
    return;
  }

  // If the other modal is not open, proceed with opening the new modal
  if (event.key === "n") {
    event.preventDefault(); // prevent the default "Bookmark" action
    var existingModalBackdrop = document.querySelector(".modal-backdrop");
    var existingModal = document.querySelector(".modal.show");
    if (existingModalBackdrop) {
      existingModalBackdrop.remove(); // remove any existing modal backdrop
    }
    if (existingModal) {
      existingModal.classList.remove("show"); // remove the "show" class from any existing modals
    }
    document.getElementById("newItemButton").click(); // open the new modal
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.querySelector("#currentDate");
  if (dateInput !== null && dateInput.value === "") {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();
    const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
    dateInput.value = formattedDate;
  }
});

const test = async (id) => {
  let url = ip + `items/parts/${id}`;
  const payload = new FormData();
  payload.append("itemID", id);
  const data = await sendRequest(url, "GET");
  populatePartsPrint(data.data);
};

const populatePartsPrint = async (data) => {
  const partsContainer = document.getElementById("partsPrint");
  partsContainer.innerHTML = "";
  data.forEach((e) => {
    let part = document.createElement("div");

    part.innerHTML = `
    <div>
      <h2>Dio ${e.id}: <strong> ${e.description}</strong></h2>
      </div>
    `;
    partsContainer.append(part);
  });
};
