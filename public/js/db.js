const { response } = require("express");
const { ServerResponse } = require("http");

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
                headers: {
                    Accept: 'application/json, test/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(ServerResponse => {
                    if (ServerResponse.message) {
                        throw new Error(ServerResponse);
                    }
                    const transaction = db.transaction(['new_transaction'],'readwrite');
                    const budgetOjectStore = transaction.budgetOjectStore('new_transaction');
                    budgetOjectStore.clear();
                    alert('All saved transactions have been submitted!!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}

// listen for app back online
window.addEventListener('online', uploadTransaction);