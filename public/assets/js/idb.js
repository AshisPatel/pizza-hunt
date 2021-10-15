// Creating a variable to hold db connection once it is established
let db;
// Establish a connection to IndexedDB database called 'pizza_hunt' and set its version to 1
// This is like a listener, indexedDB is a global variable of the 'window' object (window.indexedDB, but we can exclude window)
// It checks the first arguement of open to see if the db with that name exists, or if it needs to create it
// The second arguement is the version number, which determines if the DB structure has changed between connections, like we if changed columns in a SQL db
const request = indexedDB.open('pizza_hunt', 1);
// The data for indexedDB is stored in a 'object store' (similair to collectsion in MongoDB or Tables in SQL) until the connection to the database is re-established or open

// this method will run the first time we run the code, and then on any subsequent changes to the version number of the request.  
request.onupgradeneeded = function (event) {
    // save a reference to the database
    const db = event.target.result;
    // creates the object store (table) called 'new_pizza', set to have an auto incrementing primary key
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a succesfull
request.onsuccess = function(event) {
    // When db is succesfully created with its object store (from onupgradeneeded) or has succesfully established a connection, the global db variable is updated
    db = event.target.result;

    // check if app is online, if so run uploadPizza() to send all the local db data to api
    if (navigator.onLine) {
        console.log('Hello!')
        uploadPizza();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
}

// This function will be executed if we attempt to submit a new pizza and there is no internet connection

function saveRecord(record) {
    // open a new transaction with the database with read and write persmissions
    // The transaction is a temporary connection between the db and the app, since we are not constantly connected to the indexedDB db. 
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the objectstore for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add recrod to the store

    pizzaObjectStore.add(record); 
}

// function to upload pizza once connection with the internet is re-established

function uploadPizza() {
    // open transaction on our db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access your objet store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a variable -> this is an async function that takes time to retrieve all of the data in the store
    const getAll = pizzaObjectStore.getAll();

    getAll.onsuccess = function() {
        // if there was data in IndexedDB's store, send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse)
                }
                // open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                // access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                // clear all items in your store
                pizzaObjectStore.clear();
                
                alert ('All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }


}

// add an event listener for the app coming back online
window.addEventListener('online', uploadPizza);