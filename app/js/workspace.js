import {DockPanel} from 'phosphor/lib/ui/dockpanel'
import {Widget} from 'phosphor/lib/ui/widget';

class Workspace extends DockPanel {
    constructor() {
        super();
    }
    
    handleEvent(event) {
        switch(event.type) {
            case 'p-drop':
                if(event.supportedActions == 'copy-link') {
                    this.addWidget(new Widget());
                } else {
                    super.handleEvent(event);
                }
                break;

            default:
                super.handleEvent(event);
                break;
            
        }
    } 
}

export {Workspace}
