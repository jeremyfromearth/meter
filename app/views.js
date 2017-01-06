import {Widget} from 'phosphor/lib/ui/widget'
import {Menu} from 'phosphor/lib/ui/menu'
import {MenuBar} from 'phosphor/lib/ui/menubar'
import {Keymap} from 'phosphor/lib/ui/keymap'
import {CommandRegistry} from 'phosphor/lib/ui/commandregistry'


function build_view() {
    const commands = new CommandRegistry();
    const keymap = new Keymap({commands});
    commands.addCommand('file:open', {
        label: 'Open', 
        mnemonic: -1,
        execute: () => {
            console.log('Open');
        }
    });

    commands.addCommand('file:save', {
        label: 'Save', 
        mnemonic: -1,
        execute: () => {
            console.log('Save');
        }
    });

    commands.addCommand('file:close', {
        label: 'Close', 
        mnemonic: -1,
        execute: () => {
            console.log('Close');
        }
    });

    let file_menu = new Menu({commands, keymap});
    file_menu.title.label = 'File';
    file_menu.addItem({command: 'file:open'});
    file_menu.addItem({command: 'file:save'});
    file_menu.addItem({command: 'file:close'});

    let menu_bar = new MenuBar({commands, keymap});
    menu_bar.addMenu(file_menu);

    Widget.attach(menu_bar, document.body);
}

export {build_view}
