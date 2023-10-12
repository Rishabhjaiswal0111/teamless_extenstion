let myLeads = []
let pageDetails = []

// const inputEl = document.getElementById("input-el")
// const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const saveBtn = document.getElementById("save-btn")

let leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))

if(leadsFromLocalStorage){
    updateLeads(leadsFromLocalStorage)
}

function renderLeads(){
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
    renderLeads()
})

function deleteAll(){
    myLeads = []
    pageDetails = []
    table = document.getElementById("tracking-details-table")
    header = document.getElementById("tracking-container-number-header")
    if (table) { table.remove() }
    if (header) { header.remove() }
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
    const header = document.createElement("h1")
    header.id = "tracking-container-number-header"
    header.textContent = data[0];
    const table = document.createElement("table");
    table.id = "tracking-details-table";
    const tbody = document.createElement("tbody");

    // Iterate through the data and create table rows
    const parse_data = [];
    for (let i = 4; i < data.length; i += 5) {
    const row = document.createElement("tr");
    row_data = {}
    for (let j = 0; j < 5; j++) {
        const cell = document.createElement(i === 0 ? "th" : "td");
        cell.textContent = data[i + j];
        if(j == 0){
            row_data["planned_date"] = data[i + j];
            row_data["actual_date"] = data[i + j];
        }
        if(j == 1){
            row_data["location"] = data[i + j];
        }
        row.appendChild(cell);
    }
    parse_data.push(row_data);
    tbody.appendChild(row);
    }

    table.appendChild(tbody);
    console.log(parse_data);
    localStorage.setItem("tracking_data", JSON.stringify(parse_data))

    // Append the table to the document body or any other desired location
    document.body.appendChild(header);
    document.body.appendChild(table);
}

function updateLeads(lead) {
  pageDetails = []
  pageDetails.push(lead)
  find_table(lead)
  localStorage.setItem("myLeads", JSON.stringify(pageDetails) )
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