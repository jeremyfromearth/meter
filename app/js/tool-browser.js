import * as d3 from 'd3'
import {DockPanel} from 'phosphor/lib/ui/dockpanel'
import {Drag, IDragEvent} from 'phosphor/lib/dom/dragdrop'
import {MimeData} from 'phosphor/lib/core/mimedata';
import {Widget} from 'phosphor/lib/ui/widget'
import {SVGWidget} from './svg-widget'

class ToolBrowser extends Widget {

    constructor(store) {
        super();
        this.drag = null;
        this.addClass('content');
        this.title.label = 'Tools';
        this.node.innerHTML = `<div class='toolbox'></div>`;

        this.store = store;
        this.store.subscribe('tools', this.on_tool_update.bind(this));

        this.module_lookup = {};
    }

    on_tool_update(data) {
        var container = this.node.getElementsByTagName('div')[0];

        this.module_lookup = {};
        for(var i = 0; i < data.tools.length; i++) {
            var category = data.tools[i];
            var modules = category.modules;
            var html = 
                `<div class='toolbox-category-container'>
                    <div class='toolbox-category-label'>${category.category}</div>`;

            for(var j = 0; j < modules.length; j++) {
                var module = modules[j];
                this.module_lookup[module.id] = modules[j];
                html += `<div data-module='${module.id}' id='${module.name}' class='toolbox-module-container'>
                            <i class='fa ${category.icon || 'fa-bar-chart-o'}' ></i>
                            <div class='toolbox-module'>${module.name}</div>
                            <br/>
                        </div>`;
            }
            html += `</div>`;
            container.insertAdjacentHTML('beforeend', html);
        }

        var ref = this;
        d3.selectAll('.toolbox-module-container')
            .each(function() {
                this.addEventListener('mousedown', function(event) {
                    ref.handleEvent(event);
                });
            });
    }

    handleEvent(event) {
        switch(event.type) {
            case 'mousedown':
                if(event.target.dataset.module) {
                    var module_id = event.target.dataset.module;
                    var mime_data = new MimeData();
                    mime_data.setData(
                        'application/vnd.phosphor.widget-factory', 
                        () => { 
                            var widget = new SVGWidget('svg');
                            widget.title.label = this.module_lookup[module_id].name; 
                            widget.title.closable = true;
                            return widget; 
                        });
                    this.drag = new Drag({
                        mimeData: mime_data,
                        dragImage: event.target.cloneNode(true),
                    })

                    let {clientX, clientY} = event;
                    this.drag.start(clientX, clientY).then(() => {
                        this.drag = null;
                    });
                }
                break;
        }
    }
}

export {ToolBrowser}
