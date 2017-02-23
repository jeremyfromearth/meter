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
    return Observable.ajax({url: '/search', headers: {data : JSON.stringify(search)}})
        .map(xhr => {
            console.log(xhr.response);
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
