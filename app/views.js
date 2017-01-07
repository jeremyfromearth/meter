//import * as d3 from 'd3'
import {Widget} from 'phosphor/lib/ui/widget'
import {Menu} from 'phosphor/lib/ui/menu'
import {MenuBar} from 'phosphor/lib/ui/menubar'
import {BoxPanel} from 'phosphor/lib/ui/boxpanel'
import {TabPanel} from 'phosphor/lib/ui/tabpanel'
import {Keymap} from 'phosphor/lib/ui/keymap'
import {CommandRegistry} from 'phosphor/lib/ui/commandregistry'

class SVGWidget extends Widget {
    constructor(id) {
        super();
        this.addClass('content');
        this.title.label = 'Session';
        this.node.innerHTML = '<svg></svg>';
    }

    getSVG() {
        return this.node.getElementsByTagName('svg')[0];
    }

    onResize(msg) {
        var parent = this.getSVG().parentNode;
        this.getSVG().setAttribute('width', parent.clientWidth);
        this.getSVG().setAttribute('height', parent.clientHeight);
    }
}

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

    let dock_panel = new TabPanel();
    let svg_widget = new SVGWidget('Timeline');
    let box_panel = new BoxPanel({direction: 'left-to-right', spacing: 0});
    box_panel.id = 'main';

    BoxPanel.setStretch(dock_panel, 1);
    dock_panel.addWidget(svg_widget);
    box_panel.addWidget(dock_panel);
    Widget.attach(menu_bar, document.body);
    Widget.attach(box_panel, document.body);

    window.onresize = () => box_panel.update();
}

export {build_view}
