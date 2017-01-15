import {Observable} from 'rxjs'

// Action Types
const Log = 'log';
const Bootstrap = 'bootstrap';
const BootstrapComplete = 'bootstrap-complete';

// Load all data needed at application init
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

function log(message) {
    return {
        type: Log,
        data: message
    }
}

export {
    log,
    Log,
    bootstrap, 
    Bootstrap, 
    BootstrapComplete
}
