(function(){

    let DB;

    document.addEventListener('DOMContentLoaded', createDb);

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
})();