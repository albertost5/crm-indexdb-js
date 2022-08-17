import { clientList } from "./selectors.js";

(function(){

    let DB;

    document.addEventListener('DOMContentLoaded', () => {
        createDb();

        if( window.indexedDB.open('crm', 1) ) {
            getClients();
        }

        clientList.addEventListener('click', deleteEntry);
    });

    function deleteEntry( e ) {
        if ( e.target.classList.contains('delete') ) {
            const clientId = Number(e.target.dataset.client);

            const accept = confirm('Would you like to remove the entry?');
            
            if ( accept ) {
                e.target.parentElement.parentElement.remove();
                const transaction = DB.transaction(['crm'], 'readwrite');
    
                const objectStore = transaction.objectStore('crm');
                objectStore.delete(clientId);
    
                transaction.oncomplete = () => {
                    console.log('Entry deleted: ', clientId);
                } 
                transaction.onerror = () => {
                    console.log('There was an error deleting the entry!');
                }
            }

        }
        
    }

    function createDb() {
        console.log('Creating DB...');

        const createDb = window.indexedDB.open('crm', 1);

        createDb.onerror = () => {
            console.log('Error creating database!');
        }

        createDb.onsuccess = () => {
            DB = createDb.result;
            console.log('Database created: ', DB);
        }

        createDb.onupgradeneeded = (e) => {
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('name','name', { unique: false });
            objectStore.createIndex('email','email', { unique: true });
            objectStore.createIndex('phone','phone', { unique: false });
            objectStore.createIndex('company','company', { unique: false });
            objectStore.createIndex('id','id', { unique: true });
        }

        console.log('Database created successfully!');
    }

    function getClients() {
        const connectDb = window.indexedDB.open('crm', 1);

        connectDb.onerror = () => {
            console.log('There was an error connecting the db!');
        }

        connectDb.onsuccess = () => {
            DB = connectDb.result;
            const objectStore = DB.transaction('crm').objectStore('crm');

           objectStore.getAll().onsuccess = (e) => {
            const clientsArr = e.target.result;
            clientsArr.forEach( client => {

                const { name, email, phone, company, id } = client;

                clientList.innerHTML += `
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${ name } </p>
                            <p class="text-sm leading-10 text-gray-700"> ${ email } </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${ phone }</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${ company }</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="edit-client.html?id=${ id }" class="text-teal-600 hover:text-teal-900 mr-5">Edit</a>
                            <a href="#" data-client="${ id }" class="text-red-600 hover:text-red-900 delete">Delete</a>
                        </td>
                    </tr>
                `;
            });
           }
        }
    }

})();