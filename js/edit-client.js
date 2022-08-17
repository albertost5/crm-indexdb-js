import { showMessage } from "./functions.js";
import { form, nameInput, emailInput, phoneInput, companyInput, submit} from "./selectors.js";

(function() {
    
    let DB;
    let clientId;

    document.addEventListener('DOMContentLoaded', () => {
        connectDb();

        form.addEventListener('submit', updateClient);
        
        // Query param - id
        const queryParams = new URLSearchParams(window.location.search);
        clientId = queryParams.get('id');
        
        if( clientId ) {
            setTimeout(() => {
                getClient(clientId);
            }, 1000);
        }
    });
    
    function getClient( id ) {
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');
        const client = objectStore.openCursor();
        
        client.onsuccess = (e) => {
            const cursor = e.target.result;
            
            if( cursor ) {
                if( cursor.value.id === Number(id) ) {
                    fillForm(cursor.value);
                    return;
                }
            }
        
            cursor.continue();
        }
        
        
    }
    
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
    
    function fillForm( client ) {
        submit.value = 'Edit Client';

        const { name, email, phone, company, id } = client;
        
        
        nameInput.value = name;
        emailInput.value = email;
        phoneInput.value = phone;
        companyInput.value = company;
    }

    function updateClient( e ) {
        e.preventDefault();

        if( !nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim() || !companyInput.value.trim() ) {
            showMessage('All fields are requierd!', 'error');
        }

        const clientUpdated = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            company: companyInput.value.trim(),
            id: Number(clientId)
        }

        console.log(clientUpdated);

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clientUpdated);

        transaction.oncomplete = () => {
            showMessage('Edited successfully!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

        transaction.onerror = () => {
            showMessage('There was an error editing the client', 'error');
        }
        
    }
    
})();