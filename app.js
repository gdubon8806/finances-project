//add entry form controls
const SHOW_ADD_ENTRY_MODAL_BTN = document.querySelector('.show-add-entry-modal-btn');
const ADD_ENTRY_BTN = document.querySelector('.add-entry-btn');
const CLOSE_MODAL_BTN = document.querySelector('.close-modal-btn');
const ADD_ENTRY_MODAL_CONTAINER = document.querySelector('.add-entry-modal-container');

//inputs 
const DATE_ENTRY_TXT = document.querySelector('.date-entry-txt');
const DESC_ENTRY_TXT = document.querySelector('.desc-entry-txt');
const AMT_ENTRY_TXT = document.querySelector('.amt-entry-txt');


//UI elements
const TABLE_ENTRIES = document.querySelector('.table-entries');

//State
const ENTRIES = [];


//event listeners
ADD_ENTRY_BTN.addEventListener('click', () => {
    addNewEntry();
})

SHOW_ADD_ENTRY_MODAL_BTN.addEventListener('click', () => {
    toggleModalEntry();
})

CLOSE_MODAL_BTN.addEventListener('click', () => {
    toggleModalEntry();
})

function toggleModalEntry() {
    ADD_ENTRY_MODAL_CONTAINER.classList.toggle('hide');
}

function addNewEntry() {
    ENTRIES.push(createNewEntry()); //updates state

    updateTableEntries(); //updates UI
}

function createNewEntry() {
    //first get current input data
    let tempDATE_ENTRY_TXT =  DATE_ENTRY_TXT.value;
    let tempDESC_ENTRY_TXT =  DESC_ENTRY_TXT.value;
    let tempAMT_ENTRY_TXT =  AMT_ENTRY_TXT.value;

    const newEntry = new Entry(tempDATE_ENTRY_TXT, tempDESC_ENTRY_TXT, tempAMT_ENTRY_TXT);
    return newEntry;
}

function updateTableEntries() {
    let rowEntry = document.createElement('tr');
    let tableDataDesc = document.createElement('td');
    let tableDataAmt = document.createElement('td');
    let tableDataDate = document.createElement('td');
    
    let newEntryToShow = ENTRIES[ENTRIES.length - 1];

    tableDataDesc.innerHTML = newEntryToShow.description;
    tableDataAmt.innerHTML = newEntryToShow.amount;
    tableDataDate.innerHTML = newEntryToShow.date;

    rowEntry.appendChild(tableDataDesc);
    rowEntry.appendChild(tableDataAmt);
    rowEntry.appendChild(tableDataDate);

    TABLE_ENTRIES.appendChild(rowEntry);

}


class Entry {
    constructor(date, description, amount) {
        this.date = date;
        this.description = description;
        this .amount = amount;
    }  
}