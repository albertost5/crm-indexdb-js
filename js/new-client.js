import { showMessage } from "./functions.js";
import { nameInput, emailInput, phoneInput, companyInput } from "./selectors.js";

(function(){
    let DB;

    // HTML ELEMENTS
    const form = document.querySelector('#clientForm');
    
    document.addEventListener('DOMContentLoaded', connectDb);
    form.addEventListener('submit', validateClient);
    
    function connectDb() {
        const connectDb = window.indexedDB.open('crm', 1);
        
        connectDb.onerror = () => {
            console.log('Couldnt connect the database!');
        }
        
        connectDb.onsuccess = () => {
            DB = connectDb.result;
            console.log('Connected: ', DB);
        }
    }
    
    function validateClient( e ) {
        e.preventDefault();

        if ( !nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim() || !companyInput.value.trim() ) {
            showMessage('All the fields are required', 'error')
        }

        // Insert new entry - Object
        const client = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            company: companyInput.value.trim(),
            id: Date.now()
        }

        createClient(client);

        form.reset();
    }

    function createClient( client ) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        
        const objectStore = transaction.objectStore('crm');
        objectStore.add( client );

        transaction.onerror = () => {
            showMessage('There was an error adding a new client!', 'error');
        }

        transaction.oncomplete = () => {
            showMessage('Client added successfully!');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }
})();