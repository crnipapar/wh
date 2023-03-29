// Funkcija za populate print



const itemsPrint = async (id) => {
    const response = await sendRequest(ip + `items/${id}`);
    const e = response.data;
    const itemsContainerPrint = document.getElementById("itemsContainerPrint");
    itemsContainerPrint.innerHTML = `
    <div>
    <h2 style="padding-bottom: 25px; border-bottom: 2px solid black;  ;">Narudžba br. ${e.id}</h2>
  </div>
  
  <div style="margin-top: 15px;">
    <p style="font-size: 20px;">Klijent: <strong> ${e.customerInfo}</strong></p> 
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
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis hic
      maiores consequatur neque assumenda. Rem eius distinctio soluta, ipsa
      illum magnam tempora sit voluptatem! Deleniti consequuntur corporis
      aperiam? Reprehenderit, dicta.
    </p>
  </div>
  </div>`;
  
    itemsContainerPrint.append(item);
  
    
    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(itemsContainerPrint.innerHTML);
    printWindow.focus();
    printWindow.print();
  };