import {Observable} from 'rxjs'

// Load all data needed at application init
const BootstrapComplete = 'bootstrap-complete';
function bootstrap() {
    // TODO: Get user vars from local storage and load needed resources
    // Initialize the store!
    return {
        type: BootstrapComplete,
        data: {}
    };
}

// Log a message to the console
const Log = 'log';
function log(message) {
    return {
        type: Log,
        data: message
    }
}

// Clear the log
const ClearLog = 'clear-log';
function clear_log() {
    return {
        type: ClearLog,
        data: null
    }
}

// Search for files
const SearchFilesComplete = 'search-files-complete';
const SearchFilesError = 'search-files-error';

function search_files(search) {
    return Observable.ajax({
            url: '/search', 
            responseType: 'json', 
            method: 'POST', 
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(search)
        })
        .map(xhr => {
            return {
                type: SearchFilesComplete,
                data: xhr.response
            }
        });
}

export {
    log,
    Log,
    ClearLog,
    clear_log,
    bootstrap, 
    BootstrapComplete,
    search_files,
    SearchFilesComplete
}
