let db;

const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createOjectStore('new_transaction', { autoIncrement: true});
}; 

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine){

    }
};

request.onerror = function(event) {
   console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const budgetOjectStore = transaction.ojectStore('new_transaction');
    budgetOjectStore.add(record);
}

function uploadTransaction() {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const budgetOjectStore = transaction.ojectStore('new_transaction');
    const getAll = budgetOjectStore.getAll();

    getAll.onsuccess = function() {

        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
            })
        }
    }
}

