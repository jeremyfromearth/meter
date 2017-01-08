const Bootstrap = 'bootstrap';
const BootstrapComplete = 'bootstrap-complete';

function bootstrap() {
    // Could be a good place to fetch recent settings from local storage
    return {
        type: Bootstrap,
        data : {

        }
    }
}

function bootstrap_complete() {
    return {
        type: BootstrapComplete,
        data: {

        }
    }
}

export {
    bootstrap, Bootstrap, 
    bootstrap_complete, BootstrapComplete
}
