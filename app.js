import { readEntry, createEntry, deleteEntry } from './firebase.js';
import { readBudget, createBudget, deleteBudget } from './firebase.js';
// entry controls
const SHOW_ADD_ENTRY_MODAL_BTN = document.querySelector('.show-add-entry-modal-btn');
const ADD_ENTRY_BTN = document.querySelector('.add-entry-btn');
// const UPDATE_ENTRY_BTN = document.querySelector('.update-entry-btn');
const DELETE_ENTRY_BTN = document.querySelector('.delete-entry-btn');
const CLOSE_MODAL_BTN = document.querySelector('.close-modal-btn');


const ADD_BUDGET_BTN = document.querySelector('.add-budget-btn');
const SHOW_ADD_BUDGET_MODAL_BTN = document.querySelector('.show-add-budget-modal-btn');
const CLOSE_ADD_BUDGET_MODAL_BTN = document.querySelector('.close-budget-modal-btn');
const DELETE_BUDGET_BTN = document.querySelector('.delete-budget-btn');

//inputs 
//entry controls form
const DATE_ENTRY_TXT = document.querySelector('.date-entry-txt');
const DESC_ENTRY_TXT = document.querySelector('.desc-entry-txt');
const AMT_ENTRY_TXT = document.querySelector('.amt-entry-txt');
const TYPE_ENTRY_SELECT = document.querySelector('.type-entry-select');
const CAT_ENTRY_SELECT = document.querySelector('.cat-entry-select');
const CAT_ENTRY_LABEL = document.querySelector('.cat-entry-label');

//budget controls form
const NAME_BUDGET_TXT_ELEMENT = document.querySelector('.budget-name-txt');
const AMT_BUDGET_TXT_ELEMENT = document.querySelector('.budget-amt-txt');
const YEAR_BUDGET_TXT_ELEMENT = document.querySelector('.budget-year-txt');
const MONTH_BUDGET_SELECT_ELEMENT = document.querySelector('.budget-month-select');


//UI elements
// const TABLE_ENTRIES = document.querySelector('.table-entries');
const ADD_ENTRY_MODAL_CONTAINER = document.querySelector('.add-entry-modal-container');
const ADD_BUDGET_MODAL_CONTAINER = document.querySelector('.add-budget-modal-container');
const ENTRIES_CONTAINER = document.querySelector('.entries-container');
const BUDGETS_CONTAINER = document.querySelector('.budgets-container');

//State
let ENTRIES = [];
let BUDGETS = [];
// let totalFunds, totalSpendings, totalEarnings, shouldHave, difference;
let initialFunds = 1000.00;
let currentFunds = initialFunds;

//event listeners
//add entry in DB
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
    // UPDATE_ENTRY_BTN.disabled = true;
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
    if (idCurrentRowSelected !== '' && idCurrentRowSelected !== idEntry) {
        return;
    } else if (idCurrentRowSelected !== '' && idCurrentRowSelected == idEntry) {
        rowSelected.classList.toggle("rowSelected");
        DELETE_ENTRY_BTN.disabled = true;
        // UPDATE_ENTRY_BTN.disabled = true;
        idCurrentRowSelected = '';
    } else if (idCurrentRowSelected == '') {
        idCurrentRowSelected = idEntry;
        rowSelected.classList.toggle("rowSelected");
        DELETE_ENTRY_BTN.disabled = false;
        // UPDATE_ENTRY_BTN.disabled = false;
    }
});

//handler to select a budget
let idCurrentBudgetSelected = '';
BUDGETS_CONTAINER.addEventListener('click', (e) => {
    // Buscar el div más cercana al elemento clicado
    const divSelected = e.target.closest('div');
    if (!divSelected || !divSelected.hasAttribute('id')) {
        return; // Si no es un div válida o no tiene `id`, salir
    }
    //obtener id
    const idBudget = divSelected.getAttribute('id');
    // si ya hay un id actual seleccionado no puede haber otro seleccionado
    if (idCurrentBudgetSelected !== '' && idCurrentBudgetSelected !== idBudget) {
        return;
    } else if (idCurrentBudgetSelected !== '' && idCurrentBudgetSelected == idBudget) {
        divSelected.classList.toggle("budgetSelected");
        DELETE_BUDGET_BTN.disabled = true;
        // UPDATE_ENTRY_BTN.disabled = true;
        idCurrentBudgetSelected = '';
    } else if (idCurrentRowSelected == '') {
        idCurrentBudgetSelected = idBudget;
        divSelected.classList.toggle("budgetSelected");
        DELETE_BUDGET_BTN.disabled = false;
    }
});



//Budget functions and handlers

//create budget to DB
ADD_BUDGET_BTN.addEventListener('click', () => {
    createBudget(getDataNewBudget()).then(() => {
        //update state and UI   
        initializeBudgets();
        loadBudgetOptions();
    });
})

DELETE_BUDGET_BTN.addEventListener('click', () => {
    //sends to db
    deleteBudget(idCurrentBudgetSelected).then(() => {
        //update state and UI
        initializeBudgets();
    });
    // UPDATE_ENTRY_BTN.disabled = true;
    DELETE_BUDGET_BTN.disabled = true;
    idCurrentBudgetSelected = '';
})


//load CAT_ENTRY_SELECT options of budget
function loadBudgetOptions() {
    CAT_ENTRY_SELECT.innerHTML = '';
    //first make query to db
    readBudget().then((budgets) => {
        budgets.forEach(budget => {
            const budgetOptionElement = document.createElement('option');
            budgetOptionElement.innerHTML = budget.name;
            budgetOptionElement.value = budget.id;
            CAT_ENTRY_SELECT.append(budgetOptionElement);
        });
    })
}
loadBudgetOptions();

function getDataNewBudget() {

    let nameBudgetTxtValue = NAME_BUDGET_TXT_ELEMENT.value;
    let amtBudgetTxtValue = AMT_BUDGET_TXT_ELEMENT.value;
    let yearBudgetTxtValue = YEAR_BUDGET_TXT_ELEMENT.value.trim();
    let monthBudgetSelectValue = MONTH_BUDGET_SELECT_ELEMENT.value;

    if (nameBudgetTxtValue == '') {
        nameBudgetTxtValue = 'Presupuesto sin nombre';
    }
    if (amtBudgetTxtValue == '') {
        amtBudgetTxtValue = '0';
    }

    if (yearBudgetTxtValue == '') {
        yearBudgetTxtValue = new Date().getFullYear().toString();
    }


    const newBudget = new Budget(
        nameBudgetTxtValue,
        amtBudgetTxtValue,
        yearBudgetTxtValue,
        monthBudgetSelectValue
    );

    return newBudget;
}

SHOW_ADD_BUDGET_MODAL_BTN.addEventListener('click', () => {
    toggleModalAddBudget();
})

SHOW_ADD_ENTRY_MODAL_BTN.addEventListener('click', () => {
    toggleModalEntry();
})

CLOSE_MODAL_BTN.addEventListener('click', () => {
    toggleModalEntry();
})

CLOSE_ADD_BUDGET_MODAL_BTN.addEventListener('click', () => {
    toggleModalAddBudget();
})

function toggleModalAddBudget() {
    ADD_BUDGET_MODAL_CONTAINER.classList.toggle('hide');
}

function toggleModalEntry() {
    ADD_ENTRY_MODAL_CONTAINER.classList.toggle('hide');
}


//handler que detecte cuando se selecciona un deposito o retiro. 
TYPE_ENTRY_SELECT.addEventListener('change', () => {
    if (TYPE_ENTRY_SELECT.value == 'Deposit') {
        CAT_ENTRY_LABEL.style.display = 'none';
        CAT_ENTRY_SELECT.style.display = 'none';
    } else {
        CAT_ENTRY_SELECT.style.display = 'block';
        CAT_ENTRY_LABEL.style.display = 'block';
    }
})

function getDataNewEntry() {
    //first get current input data
    let tempDATE_ENTRY_TXT = DATE_ENTRY_TXT.value;
    if (tempDATE_ENTRY_TXT == '') {
        tempDATE_ENTRY_TXT = new Date();
        tempDATE_ENTRY_TXT = tempDATE_ENTRY_TXT.toISOString().split('T')[0];
    }
    let tempDESC_ENTRY_TXT = DESC_ENTRY_TXT.value;
    let tempAMT_ENTRY_TXT = AMT_ENTRY_TXT.value;
    let tempTYPE_ENTRY_SELECT = TYPE_ENTRY_SELECT.value;
    let tempCAT_ENTRY_SELECT = 'N/A'
    if (TYPE_ENTRY_SELECT.value == 'Withdrawal') {
        tempCAT_ENTRY_SELECT = CAT_ENTRY_SELECT.value;
    }

    const newEntry = new Entry(
        tempDATE_ENTRY_TXT,
        tempDESC_ENTRY_TXT,
        tempAMT_ENTRY_TXT,
        tempTYPE_ENTRY_SELECT,
        tempCAT_ENTRY_SELECT
    );

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

    currentFunds = initialFunds;
}

function renderTableEntries() {
    ENTRIES_CONTAINER.innerHTML = ""; //restarts entries container UI

    let copy_entries = ENTRIES.slice(); //copy of array entries 
    copy_entries.sort((a, b) => new Date(a.date) - new Date(b.date));
    //grouped by date entries 
    const entries_grouped_by_dates = Object.groupBy(copy_entries, ({ date }) => date);
    //iterate over this object and render data in table with template

    for (let entryDate in entries_grouped_by_dates) {
        let totalIncome = 0, totalSpendings = 0;
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

                tableDataAmt.style.minWidth = "150px";
                tableDataDesc.style.paddingLeft = '0px';

                rowEntry.appendChild(tableDataDesc);
                rowEntry.appendChild(tableDataAmt);

                content.querySelector(".spending-table-entries").append(rowEntry);

                totalSpendings += parseFloat(spendingsDateEntries[i].amount);
            }

        } else {
            let rowEntry = document.createElement('tr');
            let tableDataEntry = document.createElement('td');
            tableDataEntry.innerHTML = "No hay entradas.";
            rowEntry.append(tableDataEntry);
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
                totalIncome += parseFloat(depositsDateEntries[i].amount);
            }
        } else {
            let rowEntry = document.createElement('tr');
            let tableDataEntry = document.createElement('td');
            tableDataEntry.innerHTML = "No hay entradas.";
            rowEntry.style.textAlign = "center";
            rowEntry.append(tableDataEntry);
            content.querySelector(".income-table-entries").append(rowEntry);
        }


        document.querySelector(".entries-container").append(content);

        //create summary of date of entries
        let templateSummary = document.querySelector(".summary-date-template");
        let contentSummary = templateSummary.content.cloneNode(true);
        contentSummary.querySelector(".current-total-funds-spendings").innerHTML = "L. " + currentFunds.toFixed(2);
        contentSummary.querySelector(".total-spendings").innerHTML = "L. " + totalSpendings.toFixed(2);

        //calculate first substracting the spendings
        let newTotalFunds = parseFloat(currentFunds) - parseFloat(totalSpendings);

        contentSummary.querySelector(".new-total-funds-after-spendings").innerHTML = "L. " + newTotalFunds.toFixed(2);

        currentFunds = newTotalFunds;

        contentSummary.querySelector(".current-total-funds-income").innerHTML = "L. " + currentFunds.toFixed(2);
        contentSummary.querySelector(".total-income").innerHTML = "L. " + totalIncome.toFixed(2);

        //calculate later adding the income
        newTotalFunds = parseFloat(currentFunds) + parseFloat(totalIncome);
        contentSummary.querySelector(".new-total-funds-after-income").innerHTML = "L. " + newTotalFunds.toFixed(2);

        currentFunds = newTotalFunds;

        document.querySelector(".entries-container").append(contentSummary);

    }

}


function initializeBudgets() {
    BUDGETS = []; //restarts BUDGETS state arr
    readBudget().then((budgets) => {
        budgets.forEach((budget) => {
            BUDGETS.push(budget);
        })
        //update ui with data obtanied
        renderBudgets();
        // console.log(BUDGETS);s
    });
}

function renderBudgets() {
    BUDGETS_CONTAINER.innerHTML = ''
    let x = 100;
    let y = 100;
    for (let budget of BUDGETS) {
        let template = document.querySelector(".budget-template");
        let content = template.content.cloneNode(true);
        let divContainerBudget = content.querySelector('.budget-container');
        divContainerBudget.id = budget.id;

        content.querySelector('.name-budget').innerHTML = budget.name;
        content.querySelector('.amt-budget').innerHTML = 'L. ' + budget.amount;
        content.querySelector('.year-budget').innerHTML = 'Año: ' + budget.year;
        content.querySelector('.month-budget').innerHTML = 'Mes: ' + budget.month
        //budget graphics
        // let budgetGraphic = content.querySelector('.budget-graphic');
        // let ctx = budgetGraphic.getContext('2d');
        // ctx.beginPath();
        // ctx.arc(x, y, 50, 0, Math.PI * 2);
        // ctx.fill();
        BUDGETS_CONTAINER.append(content);
    }
}

//data modeling classes
class Entry {
    constructor(date, description, amount, type, category) {
        this.date = date;
        this.description = description;
        this.amount = amount;
        this.type = type
        this.category = category
    }
}

class Budget {
    constructor(name, amount, year, month) {
        this.name = name;
        this.amount = amount
        this.year = year;
        this.month = month
    }
}

initializeEntries();
initializeBudgets();


