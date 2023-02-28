const editItemForm = document.getElementById("editItemForm");
const editItemButton = document.getElementById("editItemButton");
const addNewItemForm = document.getElementById("addNewItemForm");
const addNewItemButton = document.getElementById("addNewItemButton");
const getEditItems = document.getElements;

function handleButtonClick(button, form, method) {
  button.addEventListener("click", function (e) {
    e.preventDefault();

    const payLoad = new FormData(form);

    console.log([...payLoad]);

    const options = {
      method: method,
      mode: "no-cors",
      body: payLoad,
    };

    fetch(
      `http://192.168.86.127:3000/items/${method === "POST" ? "add" : "edit"}/`,
      options
    )
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  });
}

handleButtonClick(addNewItemButton, addNewItemForm, "POST");
handleButtonClick(editItemButton, editItemForm, "PUT");

// 2. verzija

function makeApiCall(method, resource, payload = null) {
  const options = {
    method: method,
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  return (
    fetch(`http://192.168.86.127:3000/${resource}`, options)
      .then((res) => res.json())
      //tu fali       .then((data) => console.log(data)) iz nekog razloga?

      .catch((err) => console.log(err))
  );
}

/* 3. GET za edit button

<form>
  <label for="name">Name:</label>
  <input type="text" id="name" name="name">

  <label for="email">Email:</label>
  <input type="email" id="email" name="email">

  <label for="phone">Phone:</label>
  <input type="tel" id="phone" name="phone">
</form>

fetch('/api/users/1')
  .then(response => response.json())
  .then(data => {
    document.querySelector('input[name="name"]').value = data.name;
    document.querySelector('input[name="email"]').value = data.email;
    document.querySelector('input[name="phone"]').value = data.phone;
  });
 */

const editItemForm = document.getElementById("editItemForm");
const editItemButton = document.getElementById("editItemButton");
const addNewItemForm = document.getElementById("addNewItemForm");
const addNewItemButton = document.getElementById("addNewItemButton");

function handleButtonClick(button, form, method) {
  button.addEventListener("click", function (e) {
    e.preventDefault();

    const payLoad = new FormData(form);

    const options = {
      method,
      body: payLoad,
    };
    // Get all items za EDIT button

    if (button === editItemButton) {
      //primjer funkcije koja popunjava iteme - da li je ovdje točna konekcija 'editItemsButton' za formu na EDIT buttonu?
      function populateFormWithData(data) {
        const form = document.querySelector("#editItemsButton");

        // loop over the form elements
        for (let i = 0; i < form.elements.length; i++) {
          const element = form.elements[i];

          // check if the element has a name and if the data contains a corresponding key
          if (element.name && data[element.name] !== undefined) {
            element.value = data[element.name];
          }
        }
      }
      const getItem = {
        method: "GET",
        mode: "no-cors",
      };

      fetch("http://192.168.86.127:3000/items/", getItem)
        .then((res) => res.json())
        .then((data) => {
          populateFormWithData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    fetch(
      `http://192.168.86.127:3000/items/${method === "POST" ? "add" : "edit"}/`,
      options
    )
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  });
}

handleButtonClick(addNewItemButton, addNewItemForm, "POST");
handleButtonClick(editItemButton, editItemForm, "PUT");

// za mjesec prikazati
<script>
  const month = [ "Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj",
  "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac", ];
  const d = new Date(); let name = month[d.getMonth()] + " " + d.getFullYear();
  document.getElementById("demo").innerHTML = name;
</script>;
