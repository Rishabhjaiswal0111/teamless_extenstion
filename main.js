let myLeads = []

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const saveBtn = document.getElementById("save-btn")

let leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))

if(leadsFromLocalStorage){
    myLeads = leadsFromLocalStorage
    renderLeads()
}

inputBtn.addEventListener("click", function() {
    myLeads.push(inputEl.value)
    inputEl.value = ""
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    renderLeads()
})



function renderLeads(){
    // const li = document.createElement("li")
    // li.innerHTML = "<a target = '_blank' href = https://" + myLeads[myLeads.length - 1] + ">" + myLeads[myLeads.length - 1] + "</a>"
    // ulEl.append(li)


    let listItems = ""
    for(let i = 0; i < myLeads.length; i++){
        listItems += `
            <li>
                <a href = "${myLeads[i]}" target = "_blank">${myLeads[i]}</a>
            </li>
        `
    }
    
    ulEl.innerHTML = listItems
    
}

deleteBtn.addEventListener("click", function(){
    deleteAll()
})

function deleteAll(){
    myLeads = []
    localStorage.clear()
    renderLeads()
}

saveBtn.addEventListener("click", function(){
    getCurrentPageHTML();
})

function find_table(document_data){
    const tempElement = document.createElement("div");
    tempElement.innerHTML = document_data;
    const elements = tempElement.getElementsByClassName("data-value");
    console.log("Inside Find table")
    // Create an array to store the extracted data
    const data = [];

    // Loop through the elements and extract their text content
    for (let i = 0; i < elements.length; i++) {
    data.push(elements[i].textContent);
    }

    // Create an HTML table to display the data
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    // Iterate through the data and create table rows
    for (let i = 0; i < data.length; i += 5) {
    const row = document.createElement("tr");

    for (let j = 0; j < 5; j++) {
        const cell = document.createElement(i === 0 ? "th" : "td");
        cell.textContent = data[i + j];
        row.appendChild(cell);
    }

    tbody.appendChild(row);
    }

    table.appendChild(tbody);

    // Append the table to the document body or any other desired location
    document.body.appendChild(table);
}

function updateLeads(lead) {
  myLeads = []
  myLeads.push(lead)
  find_table(lead)
  localStorage.setItem("myLeads", JSON.stringify(lead) )
  renderLeads()
}

function getCurrentPageHTML() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs[0]) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: function () {
            return document.documentElement.outerHTML;
          },
        },
        (result) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else {
            updateLeads(result[0].result)
          }
        }
      );
    }
  });
}