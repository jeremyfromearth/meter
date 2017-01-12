import {add_observer} from '../core/redux-observer'
import {create_main_menu} from './menu'
import {BoxPanel} from 'phosphor/lib/ui/boxpanel'
import {DockPanel} from 'phosphor/lib/ui/dockpanel'
import {TabPanel, TabPlacement} from 'phosphor/lib/ui/tabpanel'
import {Widget, WidgetFlag} from 'phosphor/lib/ui/widget'
import * as AppState from '../reducers/app-state'

class View {
    constructor(store) {
        this.store = store;
        store.subscribe(this.on_application_init, 'app_state.state');
    }

    on_application_init(state) {
        if(state.app_state && state.app_state.state == AppState.BootstrapComplete) {
            let main_panel = new BoxPanel({direction: 'left-to-right'});
            main_panel.id = 'main';

            // Left panel
            let source_box_panel = new BoxPanel({direction: 'top-to-bottom'});
            let source_panel = new TabPanel();

            let session_widget = new Widget();
            session_widget.title.label = 'Project';
            session_widget.addClass('content');

            let file_widget = new Widget();
            file_widget.title.label = 'Files';
            file_widget.addClass('content');

            let data_widget = new Widget();
            data_widget.title.label = 'Tools';
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

            Widget.attach(create_main_menu(), document.body);
            Widget.attach(main_panel, document.body);

            window.onresize = () => main_panel.update();
        }
    }
}

export {View}
