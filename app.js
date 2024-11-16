//add entry form controls
const SHOW_ADD_ENTRY_MODAL_BTN = document.querySelector('.show-add-entry-modal-btn');
const ADD_ENTRY_BTN = document.querySelector('.add-entry-btn');
const CLOSE_MODAL_BTN = document.querySelector('.close-modal-btn');
const ADD_ENTRY_MODAL_CONTAINER = document.querySelector('.add-entry-modal-container');

//inputs 
const DATE_ENTRY_TXT = document.querySelector('.date-entry-txt');
const DESC_ENTRY_TXT = document.querySelector('.desc-entry-txt');
const AMT_ENTRY_TXT = document.querySelector('.amt-entry-txt');
const TYPE_ENTRY_SELECT = document.querySelector('.type-entry-select');


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

    renderTableEntries(); //updates UI
}

function createNewEntry() {
    //first get current input data
    let tempDATE_ENTRY_TXT = DATE_ENTRY_TXT.value;
    let tempDESC_ENTRY_TXT = DESC_ENTRY_TXT.value;
    let tempAMT_ENTRY_TXT = AMT_ENTRY_TXT.value;
    let tempTYPE_ENTRY_SELECT = TYPE_ENTRY_SELECT.value;

    const newEntry = new Entry(tempDATE_ENTRY_TXT, tempDESC_ENTRY_TXT, tempAMT_ENTRY_TXT, tempTYPE_ENTRY_SELECT);

    return newEntry;
}

const ENTRIES_CONTAINER = document.querySelector('.entries-container')

function renderTableEntries() {
    ENTRIES_CONTAINER.innerHTML = ""; //restarts entries container

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
        //solo spendings
        let depositsDateEntries = dateEntries.filter((entry) => {
            if (entry.type == "Deposit") return true;
        })

        if (depositsDateEntries.length > 0) {

            for (let i = 0; i < depositsDateEntries.length; i++) {
                let rowEntry = document.createElement('tr');
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