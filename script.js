//ZA NOVU STAVKU DATUM DEFAULT VALUE = DANASNJI DAN
//let currentDate = (document.getElementById("currentDate").valueAsDate =
// new Date());

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
    console.log(e.id);
    let item = document.createElement("div");

    item.innerHTML = `
    
    <div>
    <div class="item-container"> \
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
          Ukupno EUR: <strong>${e.totalAmount}</strong> \
        </h2> \
        <h2 style="margin-bottom: 20px"> \
          Polog EUR: <strong>${e.downpayment}</strong> \
        </h2> \
        <h2> \
          Obaviješten: <strong>${e.customerNotifiedAt}</strong> \
        </h2> \
        <h2> \
          Gotovo: <strong>${e.orderDoneAt}</strong> \
        </h2> \
      </div> \
      <div class="note"> \
        <p> Napomena: ${e.note} <p>
      </div> \
      
      <div class="buttons" style="display: flex;
            flex-direction: row; margin: 20px";>
      <div class="btn-group-vertical"

              role="group"
              aria-label="Vertical button group"> \
          <button
                type="button"
                class="btn btn-outline-dark"
                data-bs-toggle="modal"
                
          
          onclick="addOrEditItem(${e.id})">edit</button>\
          <button 
                type="button"
                class="btn btn-outline-danger"
                data-bs-toggle="modal"
                data-bs-target="#deleteItem"
                onclick="deleteItem(${e.id})"
                >delete</button> \
        </div> \
      <div class="btn-group-vertical">\
            
              <button\
                type="button" \
                class="btn btn-outline-dark" \
                data-bs-toggle="modal" \
                data-bs-target="#addPart" \
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

const getItemsByOrderStatus = async (isOrderDone) => {
  let url = ip + "items/";
  if (isOrderDone === true) {
    url += "?orderDone=notnull";
  } else if (isOrderDone === false) {
    url += "?orderDone=null";
  }
  console.log("Fetching items from URL:", url);

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

//delete stavka
const deleteConfirmed = async (id) => {
  const payload = new FormData();
  payload.append("id", id);
  await sendRequest(ip + "items/delete/", "DELETE", payload);
  getItemsByOrderStatus();
  return;
};

const saveItem = async (id = "") => {
  let form = document.getElementById("ItemForm");
  let payload = new FormData(form);
  if (id !== "") {
    payload.append("id", id);
    const response = await sendRequest(ip + "items/edit/", "PUT", payload);
    console.log(response);
    getItemsByOrderStatus();
    return;
  }
  const response = await sendRequest(ip + "items/add/", "POST", payload);
  console.log(response);
  getItemsByOrderStatus();
  return;
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
                  type="datetime"
                  name="date"
                  class="form-control"
                  id="currentDate"
                  value="${id !== "" ? response.data.date : ""}"
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
                  <input type="datetime" name="returnedAt" class="form-control" value="${
                    id !== "" ? response.data.returnedAt : ""
                  }"/>
                </div>

                <div class="box mb-3">
                  <label for="formGroupExampleInput" class="form-label"
                    >Klijent obaviješten dana</label
                  >
                  <input
                    type="datetime"
                    name="customerNotifiedAt"
                    class="form-control"
                    value="${id !== "" ? response.data.customerNotifiedAt : ""}"
                  />
                </div>
                <div class="box mb-3">
                  <label for="formGroupExampleInput" class="form-label"
                    >Narudžba gotova</label
                  >
                  <input type="datetime" name="orderDoneAt" class="form-control" value="${
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
                  type="button"
                  class="btn btn-secondary btn-lg"
                  data-bs-dismiss="modal"
                >
                  Zatvori
                </button>
                <button
                  id="addNewItemButton"
                  type="button"
                  class="btn btn-primary btn-lg"
                  data-bs-dismiss="modal"
                  onclick="${id !== "" ? `saveItem(${id})` : "saveItem()"}"
                >
                  Spremi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  `;
  new bootstrap.Modal(modal).show();
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
  const e = response.data;

  // Create new popup window for printing
  const printWindow = window.open("");

  // Populate the popup window with content
  printWindow.document.write(`
    <div>
    <h2 style="padding-bottom: 25px; border-bottom: 2px solid black;  ;">Narudžba br. ${e.id}</h2>
  </div>
  
  <div style="margin-top: 15px;">
    <p style="font-size: 20px;">Klijent: <strong> ${e.name}</strong></p> 
    <p>Datum kreiranja narudžbe: ${e.date}</p> \
  
  </div>
  
    <div style="margin-top: 30px">
    <p>Proizvođač: <strong>${e.manufacturer}</strong></p>  
    <p>Vrsta aparata i model: <strong>${e.type}</strong></p> 
  </div>
  
  
  <div style="margin-top: 30px">
  <p>Narudžba gotova dana: <strong> ${e.orderDoneAt}</strong></p>   
  <p>Klijent obaviješten dana: <strong>${e.customerNotifiedAt}</strong></p> 
  
  </div>
  
  <div style="margin-top: 50px">
    <p>Polog EUR: <strong>${e.downpayment}</strong></p>
    <p>Ukupno EUR: <strong> ${e.totalAmount} </strong></p>
    
  </div>
  
  
  <div style="margin-top: 70px; border-top: 1px solid black; font-size: 12px;">
    <p>Napomena</p>
    <p>
      ${e.note}
    </p>
  </div>
  </div>`);

  // Focus on the popup window and initiate print
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};
