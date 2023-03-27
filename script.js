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
const itemsContainer = document.getElementById("items-container"); // change to whatever element contains the items

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
  itemsContainer.innerHTML = "";
  data.forEach((e) => {
    console.log(e.id);
    let item = document.createElement("div");
    item.className = "item-container";
    item.innerHTML = `
      <div class="id"> \
        <h1 class="id">${e.id}</h1> \
        <h2 class="id">Datum:</h2> \
        <h2>${e.date}</h2> \
        <div> \
          <button onclick="deleteItem(${e.id})">delete</button> \
          <button onclick="editItem(${e.id})">edit</button> \
          <button>print</button> \
        </div> \
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
      </div>`;
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

const saveItem = async (id) => {
  let form = document.getElementById("ItemForm");
  let payload = new FormData(form);
  payload.append("id", id);
  const response = await sendRequest(ip + "items/edit/", "PUT", payload);
  console.log(response);
};

const editItem = async (id = "") => {
  const response = await sendRequest(ip + `items/${id}`);
  console.log(response.data.id);
  let modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = "modalunesi";
  modal.setAttribute("data-bs-backdrop", "static");
  modal.setAttribute("data-bs-keyboard", "false");
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", "staticBackdropLabel");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-dialog modal-lg"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              Nova stavka
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
                  value="${response.data.name}"
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
                  value="${response.data.customerInfo}"
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
                  value="${response.data.manufacturer}"
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
                  value="${response.data.type}"
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
                    value="${response.data.downpayment}"
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
                    value="${response.data.totalAmount}"
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
                  value="${response.data.date}"
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
                  <input type="datetime" name="returnedAt" class="form-control" value="${response.data.returnedAt}"/>
                </div>

                <div class="box mb-3">
                  <label for="formGroupExampleInput" class="form-label"
                    >Klijent obaviješten dana</label
                  >
                  <input
                    type="datetime"
                    name="customerNotifiedAt"
                    class="form-control"
                    value="${response.data.customerNotifiedAt}"
                  />
                </div>
                <div class="box mb-3">
                  <label for="formGroupExampleInput" class="form-label"
                    >Narudžba gotova</label
                  >
                  <input type="datetime" name="orderDoneAt" class="form-control" value="${response.data.orderDoneAt}"/>
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
                >${response.data.note}</textarea>
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
                  onclick="saveItem(${id})"
                >
                  Spremi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  `;
  document.body.append(modal);
};

/*function handleButtonClick(button) {
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
}*/

// embed the functions to buttons
//POZIVANJE FUNKCIJA
/*
handleButtonClick(addNewItemButton);
handleButtonClick(allOrders);
handleButtonClick(editItemButton);
handleButtonClick(activeOrders);
handleButtonClick(orderHistory);
*/
