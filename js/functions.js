import { form } from './selectors.js';

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


export {
    showMessage
}