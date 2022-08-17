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

        const name = document.querySelector('#name').value.trim();
        const email = document.querySelector('#email').value.trim();
        const phone = document.querySelector('#phone').value.trim();
        const company = document.querySelector('#company').value.trim();

        if ( !name || !email || !phone || !company ) {
            showMessage('All the fields are required', 'error')
        }

        // Insert new entry - Object
        const client = {
            name,
            email,
            phone,
            company,
            id: Date.now()
        }

        createClient(client);

        form.reset();
    }

    function showMessage( message, type ) {
        const alertDiv = document.querySelector('.alert');
        
        if( !alertDiv ) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = message;
            messageDiv.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alert');
        
            if ( type === 'error') {
                messageDiv.classList.add('error', 'bg-red-100', 'border-red-400', 'text-red-700');
            } else {
                messageDiv.classList.add('success', 'bg-green-100', 'border-green-400', 'text-green-700');
            }
        
            form.appendChild(messageDiv);
            clearAlert(messageDiv);
        }
        
    }

    function clearAlert( htmlElement ) {
        setTimeout(() => {
            htmlElement.remove();
        }, 1500);
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