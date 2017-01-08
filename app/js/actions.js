const OPEN_FILE = 'open_file';

function open_file(path) {
    return {
        type: OPEN_FILE,
        data: {
            path: path
        }
    }
}

export {
    open_file
}
