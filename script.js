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
const allOrders = document.getElementById("allOrders"); // change to whatever element contains the items

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
    <div class="buttons btn-group-vertical"
              role="group"
              aria-label="Vertical button group"> \
          <button style="padding: 10px"
                type="button"
                class="btn btn-outline-dark"
                data-bs-toggle="modal"
                
          
          onclick="addOrEditItem(${e.id})">edit</button>\
          <button style="padding: 10px"
                type="button"
                class="btn btn-outline-danger"
                data-bs-toggle="modal"
                data-bs-target="#delete"
                onclick="deleteItem(${e.id})">delete</button> \
          <button
                style="padding: 10px"
                type="button"
                class="btn btn-outline-warning"
                onclick="printContent()"
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
        </div> \
    <div class="id"> \
        <h1 class="id">${e.id}</h1> \
        <h2 class="id">Datum:</h2> \
        <h2>${e.date}</h2> \
        
        
      </div> \
      <div class="basic-info"> \
        <h2> \
          Klijent: <strong>${e.customerInfo}</strong> \
        </h2> \
        <h2> \
          Proizvođač: <strong>${e.manufacturer}</strong> \
        </h2> \
        <h2> \
          Aparat: <strong>${e.type}</strong> \
        </h2> \
        <h2> \
          Model: <strong>${e.model}</strong> \
        </h2> \
      </div> \
      <div class="order-info"> \
        <h2> \
          Ukupno: <strong>${e.totalAmount}</strong> \
        </h2> \
        <h2> \
          Polog: <strong>${e.downpayment}</strong> \
        </h2> \
        <h2> \
          Obaviješten: <strong>${e.customerNotifiedAt}</strong> \
        </h2> \
        <h2> \
          Gotovo: <strong>${e.orderDoneAt}</strong> \
        </h2> \
      </div> \
      <div class="note"> \
        <p>${e.note}</p> \
      </div> \
      <div class="buttons">\
              <!-- button uredi stavka -->\
              <button\
                type="button" \
                class="btn btn-outline-dark" \
                data-bs-toggle="modal" \
                data-bs-target="#addPart" \
              > \
                Dodaj dio \
              </button> \
            </div> \
      
      <div>`;

    itemsContainer.append(item);
  });
};

const getAllData = async () => {
  const data = await sendRequest(ip + "items/", "GET");
  populateItems(data.data);
};

const deleteItem = async (id) => {
  const payload = new FormData();
  payload.append("id", id);
  sendRequest(ip + "items/delete/", "DELETE", payload);
};

const saveItem = async (id = "") => {
  let form = document.getElementById("ItemForm");
  let payload = new FormData(form);
  if (id !== "") {
    payload.append("id", id);
    const response = await sendRequest(ip + "items/edit/", "PUT", payload);
    console.log(response);
    return;
  }
  const response = await sendRequest(ip + "items/add/", "POST", payload);
  console.log(response);
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

              <div class="mb-3">
                <label for="formGroupExampleInput" class="form-label"
                  >Info o klijentu</label
                >
                <input
                  type="text"
                  name="customerInfo"
                  class="form-control"
                  id="formGroupExampleInput"
                  value="${id !== "" ? response.data.customerInfo : ""}"
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
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Zatvori
                </button>
                <button
                  id="addNewItemButton"
                  type="button"
                  class="btn btn-primary"
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

//FUNKCIJA ZA PRINT

function printContent() {
  var iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(this.responseText);
      iframe.contentWindow.document.close();
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }
  };
  xhttp.open("GET", "print.html", true);
  xhttp.send();
}
