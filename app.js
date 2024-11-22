import { readEntry, createEntry, deleteEntry } from './firebase.js';
// entry controls
const SHOW_ADD_ENTRY_MODAL_BTN = document.querySelector('.show-add-entry-modal-btn');
const ADD_ENTRY_BTN = document.querySelector('.add-entry-btn');
const CLOSE_MODAL_BTN = document.querySelector('.close-modal-btn');
const ADD_ENTRY_MODAL_CONTAINER = document.querySelector('.add-entry-modal-container');
const DELETE_ENTRY_BTN = document.querySelector('.delete-entry-btn');

//inputs 
const DATE_ENTRY_TXT = document.querySelector('.date-entry-txt');
const DESC_ENTRY_TXT = document.querySelector('.desc-entry-txt');
const AMT_ENTRY_TXT = document.querySelector('.amt-entry-txt');
const TYPE_ENTRY_SELECT = document.querySelector('.type-entry-select');


//UI elements
// const TABLE_ENTRIES = document.querySelector('.table-entries');
const ENTRIES_CONTAINER = document.querySelector('.entries-container');

//State
let ENTRIES = [];

//event listeners
//add entry
ADD_ENTRY_BTN.addEventListener('click', () => {
    //send data to DB 
    createEntry(getDataNewEntry()).then(() => {
        //update state and UI   
        initializeEntries();
    });
})

//delete entry
DELETE_ENTRY_BTN.addEventListener('click', () => {
    //sends to db
    deleteEntry(idCurrentRowSelected).then(() => {
        //update state and UI
        initializeEntries();
    });
    DELETE_ENTRY_BTN.disabled = true;
    idCurrentRowSelected = '';
})


//for clic handler over rows to select them in entries container
let idCurrentRowSelected = '';
ENTRIES_CONTAINER.addEventListener('click', (e) => {
    // Buscar la fila más cercana al elemento clicado
    const rowSelected = e.target.closest('tr');
    if (!rowSelected || !rowSelected.hasAttribute('id')) {
        return; // Si no es una fila válida o no tiene `id`, salir
    }
    //obtener id
    const idEntry = rowSelected.getAttribute('id');
    // si ya hay un id actual seleccionado no puede haber otro seleccionado
    if(idCurrentRowSelected !== '' &&  idCurrentRowSelected !== idEntry) {
        return;
    } else if(idCurrentRowSelected !== '' &&  idCurrentRowSelected == idEntry) {
        rowSelected.classList.toggle("rowSelected");
        DELETE_ENTRY_BTN.disabled = true;
        idCurrentRowSelected = '';
    } else if(idCurrentRowSelected == '') {
        idCurrentRowSelected = idEntry;
        rowSelected.classList.toggle("rowSelected");
        DELETE_ENTRY_BTN.disabled = false;
    }
});


SHOW_ADD_ENTRY_MODAL_BTN.addEventListener('click', () => {
    toggleModalEntry();
})

CLOSE_MODAL_BTN.addEventListener('click', () => {
    toggleModalEntry();
})


function toggleModalEntry() {
    ADD_ENTRY_MODAL_CONTAINER.classList.toggle('hide');
}

function getDataNewEntry() {
    //first get current input data

    let tempDATE_ENTRY_TXT = DATE_ENTRY_TXT.value;
    let tempDESC_ENTRY_TXT = DESC_ENTRY_TXT.value;
    let tempAMT_ENTRY_TXT = AMT_ENTRY_TXT.value;
    let tempTYPE_ENTRY_SELECT = TYPE_ENTRY_SELECT.value;

    const newEntry = new Entry(
        tempDATE_ENTRY_TXT,
        tempDESC_ENTRY_TXT,
        tempAMT_ENTRY_TXT,
        tempTYPE_ENTRY_SELECT);

    return newEntry;
}

function initializeEntries() {
    //get data
    ENTRIES = []; //restarts entries state arr
    readEntry().then((entries) => {
        entries.forEach((entry) => {
            ENTRIES.push(entry);
        })
        //update ui with data obtanied
        renderTableEntries();
    });

}

function renderTableEntries() {
    ENTRIES_CONTAINER.innerHTML = ""; //restarts entries container UI

    let copy_entries = ENTRIES.slice(); //copy of array entries 

    //grouped by date entries 
    const entries_grouped_by_dates = Object.groupBy(copy_entries, ({ date }) => date);

    //iterate over this object and render data in table with template
    for (let entryDate in entries_grouped_by_dates) {
        let template = document.querySelector(".day-entries-template");
        let content = template.content.cloneNode(true);

        let dateToFormat = entryDate + "T00:00:00";
        const fecha = new Date(dateToFormat);

        // Opciones para el formato deseado
        const opciones = {
            weekday: 'long', // Día de la semana completo
            day: 'numeric', // Día del mes
            month: 'long' // Nombre completo del mes
        };

        // Formatear la fecha en español
        const formateador = new Intl.DateTimeFormat('es-HN', opciones);
        const fechaFormateada = formateador.format(fecha);

        //primero poner la fecha de encabezado
        content.querySelector(".date-header").innerHTML = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);;

        //iterar sobre entries para egresos
        let dateEntries = entries_grouped_by_dates[entryDate];


        //solo spendings
        let spendingsDateEntries = dateEntries.filter((entry) => {
            if (entry.type == "Withdrawal") return true;
        })

        if (spendingsDateEntries.length > 0) {
            for (let i = 0; i < spendingsDateEntries.length; i++) {
                let rowEntry = document.createElement('tr');
                rowEntry.id = spendingsDateEntries[i].id;
                let tableDataDesc = document.createElement('td');
                let tableDataAmt = document.createElement('td');

                tableDataDesc.innerHTML = spendingsDateEntries[i].description;
                tableDataAmt.innerHTML = 'L. ' + spendingsDateEntries[i].amount;

                rowEntry.appendChild(tableDataDesc);
                rowEntry.appendChild(tableDataAmt);

                content.querySelector(".spending-table-entries").append(rowEntry);
            }

        } else {
            let rowEntry = document.createElement('tr');
            rowEntry.innerHTML = "No hay entries"
            content.querySelector(".spending-table-entries").append(rowEntry);
        }

        //iterar sobre entries para ingresos
        //solo deposits
        let depositsDateEntries = dateEntries.filter((entry) => {
            if (entry.type == "Deposit") return true;
        })

        if (depositsDateEntries.length > 0) {

            for (let i = 0; i < depositsDateEntries.length; i++) {
                let rowEntry = document.createElement('tr');
                rowEntry.id = depositsDateEntries[i].id;
                let tableDataDesc = document.createElement('td');
                let tableDataAmt = document.createElement('td');

                tableDataDesc.innerHTML = depositsDateEntries[i].description;
                tableDataAmt.innerHTML = 'L. ' + depositsDateEntries[i].amount;

                rowEntry.appendChild(tableDataDesc);
                rowEntry.appendChild(tableDataAmt);

                content.querySelector(".income-table-entries").append(rowEntry);
            }
        } else {
            let rowEntry = document.createElement('tr');
            rowEntry.innerHTML = "No hay entries"
            content.querySelector(".income-table-entries").append(rowEntry);
        }


        document.querySelector(".entries-container").append(content);
    }

}


class Entry {
    constructor(date, description, amount, type) {
        this.date = date;
        this.description = description;
        this.amount = amount;
        this.type = type
    }
}

initializeEntries();