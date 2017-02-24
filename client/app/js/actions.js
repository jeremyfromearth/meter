import {Observable} from 'rxjs'

// Load all data needed at application init
const BootstrapComplete = 'bootstrap-complete';
function bootstrap() {
    // TODO: Get user vars from local storage and load needed resources
    return Observable.ajax('./data/filesystem.json')
        .map(xhr => {
            return {
                type: BootstrapComplete,
                data: { 
                    file_system: {
                        midi_library: xhr.response
                    }
                }
            }
        });
}

// Log a message to the console
const Log = 'log';
function log(message) {
    return {
        type: Log,
        data: message
    }
}

// Search for files
const SearchFilesComplete = 'search-files-complete';
function search_files(search) {
    console.log('Actions.search_files');
    console.log(search);
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
                data: {
                    search_results: xhr.response
                }
            }
        });
}

export {
    log,
    Log,
    bootstrap, 
    BootstrapComplete,
    search_files,
    SearchFilesComplete
}
