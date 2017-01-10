import {CommandRegistry} from 'phosphor/lib/ui/commandregistry'
import {Keymap} from 'phosphor/lib/ui/keymap'
import {Menu} from 'phosphor/lib/ui/menu'
import {MenuBar} from 'phosphor/lib/ui/menubar'

const commands = new CommandRegistry();
const keymap = new Keymap({commands});
commands.addCommand('file:new', {
    label: 'New', 
    icon: 'fa fa-file',
    mnemonic: -1,
    execute: () => {
        console.log('Open');
    }
});

commands.addCommand('file:open', {
    label: 'Open', 
    icon: 'fa fa-folder-open',
    mnemonic: -1,
    execute: () => {
        console.log('Save');
    }
});

commands.addCommand('file:save', {
    label: 'Save', 
    icon: 'fa fa-save',
    mnemonic: -1,
    execute: () => {
        console.log('Save');
    }
});

commands.addCommand('file:close', {
    label: 'Close', 
    icon: 'fa fa-close',
    mnemonic: -1,
    execute: () => {
        console.log('Close');
    }
});

commands.addCommand('settings:audio-engine', {
    label: 'Audio Engine', 
    icon: 'fa fa-volume-up',
    mnemonic: -1,
    execute: () => {
        console.log('Audio Engine');
    }
});

commands.addCommand('settings:midi-settings', {
    label: 'MIDI', 
    icon: 'fa fa-file-sound-o',
    mnemonic: -1,
    execute: () => {
        console.log('MIDI');
    }
});

commands.addCommand('settings:application', {
    label: 'Application', 
    icon: 'fa fa-gear',
    mnemonic: -1,
    execute: () => {
        console.log('Application');
    }
});

function create_main_menu() {
    let file_menu = new Menu({commands, keymap});
    file_menu.addItem({command: 'file:new'});
    file_menu.addItem({command: 'file:open'});
    file_menu.addItem({command: 'file:save'});
    file_menu.addItem({command: 'file:close'});
    file_menu.title.label = 'File';

    let settings_menu = new Menu({commands, keymap});
    settings_menu.title.label = 'Settings';
    settings_menu.addItem({command: 'settings:application'});
    settings_menu.addItem({command: 'settings:audio-engine'});
    settings_menu.addItem({command: 'settings:midi-settings'});

    let menu_bar = new MenuBar({commands, keymap});
    menu_bar.addMenu(file_menu);
    menu_bar.addMenu(settings_menu);
    return menu_bar;
}

export {create_main_menu}
