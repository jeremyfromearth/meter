import {Observable} from 'rxjs'

// Action Types
const Bootstrap = 'bootstrap';
const BootstrapComplete = 'bootstrap-complete';

function bootstrap() {
    return Observable.ajax('./data/helter-skelter.json')
        .map(xhr => {
            return {
                type: BootstrapComplete,
                data: xhr.response
            }
        });
}

export {
    bootstrap, 
    Bootstrap, 
    BootstrapComplete
}
