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
const SearchFiles = 'search-files';
function search_files(search) {
    // TODO: Get search results from server
    return {
        type: SearchFiles,
        data: {
            search: search
        }
    }
}

export {
    log,
    Log,
    bootstrap, 
    BootstrapComplete,
    search_files,
    SearchFiles
}
