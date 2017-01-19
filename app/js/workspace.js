import {DockPanel} from 'phosphor/lib/ui/dockpanel'
import {Widget} from 'phosphor/lib/ui/widget';

class Workspace extends DockPanel {
    constructor() {
        super();
    }
    
    handleEvent(event) {
        super.handleEvent(event);
        switch(event.type) {
            case 'p-drop':
                console.log(event);
                //this.addWidget(new Widget());
                break;
            default:
                break;
        }
    } 
}

export {Workspace}
