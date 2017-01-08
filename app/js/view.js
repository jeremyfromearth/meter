import * as d3 from 'd3'
import {BoxPanel} from 'phosphor/lib/ui/boxpanel'
import {CommandRegistry} from 'phosphor/lib/ui/commandregistry'
import {DockPanel} from 'phosphor/lib/ui/dockpanel'
import {Keymap} from 'phosphor/lib/ui/keymap'
import {Menu} from 'phosphor/lib/ui/menu'
import {MenuBar} from 'phosphor/lib/ui/menubar'
import {TabPanel, TabPlacement} from 'phosphor/lib/ui/tabpanel'
import {Widget, WidgetFlag} from 'phosphor/lib/ui/widget'


class SVGWidget extends Widget {
    constructor(svg_id) {
        super();
        this.addClass('content');
        this.node.innerHTML = `<svg id=${svg_id}></svg>`;
        this.getSVG().style.width = '100%';
        this.getSVG().style.height = '100%';
    }

    getSVG() {
        return this.node.getElementsByTagName('svg')[0];
    }

    onResize() {
        var svg = this.getSVG();
        svg.setAttribute('width', svg.clientWidth);
        svg.setAttribute('height', svg.clientHeight);
    }
}

class D3Widget extends SVGWidget {
    constructor(id, title) {
        super(id, title);
    }
}

function build_view() {
    const commands = new CommandRegistry();
    const keymap = new Keymap({commands});
    commands.addCommand('file:open', {
        label: 'Open', 
        icon: 'fa fa-file',
        mnemonic: -1,
        execute: () => {
            console.log('Open');
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
        icon: 'fa fa-file',
        mnemonic: -1,
        execute: () => {
            console.log('Close');
        }
    });

    // Create a menu
    let file_menu = new Menu({commands, keymap});
    file_menu.title.label = 'File';
    file_menu.addItem({command: 'file:open'});
    file_menu.addItem({command: 'file:save'});
    file_menu.addItem({command: 'file:close'});

    let menu_bar = new MenuBar({commands, keymap});
    menu_bar.addMenu(file_menu);

    // Main container
    let main_panel = new BoxPanel({direction: 'left-to-right'});
    main_panel.id = 'main';

    // Left panel
    let source_box_panel = new BoxPanel({direction: 'top-to-bottom'});
    let source_panel = new TabPanel();

    let session_widget = new Widget();
    session_widget.title.label = 'Session';
    session_widget.addClass('content');

    let file_widget = new Widget();
    file_widget.title.label = 'Files';
    file_widget.addClass('content');

    let data_widget = new Widget();
    data_widget.title.label = 'Data';
    data_widget.addClass('content');

    // Visualization & Tools area
    let tool_box_panel = new BoxPanel({direction: 'left-to-right'});
    let tool_panel = new DockPanel();
    tool_panel.addClass('content');

    // Add widgets
    source_box_panel.addWidget(source_panel);
    source_panel.addWidget(session_widget);
    source_panel.addWidget(file_widget);
    source_panel.addWidget(data_widget);
    tool_box_panel.addWidget(tool_panel);
    main_panel.addWidget(source_box_panel);
    main_panel.addWidget(tool_box_panel);

    BoxPanel.setStretch(source_box_panel, 1);
    BoxPanel.setStretch(tool_box_panel, 4);

    Widget.attach(menu_bar, document.body);
    Widget.attach(main_panel, document.body);

    window.onresize = () => main_panel.update();
}

export {build_view}
