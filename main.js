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

function updateLeads(lead) {
  myLeads = []
  myLeads.push(lead)
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