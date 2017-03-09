import * as d3 from 'd3'
import {Drag, IDragEvent} from 'phosphor/lib/dom/dragdrop'
import {MidiInfo} from './midi-info'
import {MimeData} from 'phosphor/lib/core/mimedata';
import {Widget} from 'phosphor/lib/ui/widget'
import {SVGWidget} from './svg-widget'

class ToolBrowser extends Widget {

    constructor(store) {
        super();
        this.drag = null;
        this.store = store;
        this.module_lookup = {};
        this.addClass('content');
        this.title.label = 'Tools';
        this.node.innerHTML = `<div class='toolbox'></div>`;
        //this.store.subscribe('tools', this.on_tool_update.bind(this));

        this.config = [{
            category: 'Analysis', 
            icon: 'fa-line-chart',
            modules: [{
                name: 'Metrics Over Time',
                options: [{
                    name: 'Metric Name', 
                    options: ['Energy', 'Amplitude', 'Complexity']
                }]
            }]
        }, {
            category: 'Models',
            icon: 'fa-sitemap',
            modules: [{
                name: 'K-Means',
                options: {}
            }, {
                name: 'K Nearest Neighbors',
                options: {}
            }]
        },{
            category: 'MIDI', 
            icon: 'fa-music',
            modules: [{
                name: 'Simple MIDI Player',
                options: {}
            }, {
                name: 'MIDI Writer', 
                options: {}
            }, {
                name: 'MIDI Info',
                widget: ()=> { return new MidiInfo(); },
                options: {}
            }]
        },{
            category: 'Visualizations', 
            icon: 'fa-bar-chart-o',
            modules: [{
                name: 'Clustering',
            }]
        }];
    }

    onAfterAttach(message) {
        var container = this.node.getElementsByTagName('div')[0];
        this.module_lookup = {};
        for(var i = 0; i < this.config.length; i++) {
            var category = this.config[i];
            var modules = category.modules;
            var html = 
                `<div class='toolbox-category-container'>
                    <div class='toolbox-category-label'>${category.category}</div>`;

            for(var j = 0; j < modules.length; j++) {
                var module = modules[j];
                this.module_lookup[i] = modules[j];
                html += `<div data-module='${i}' id='${module.name}' class='toolbox-module-container'>
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
            .on('mousedown',  () => {
                ref.handleEvent(d3.event) ;
            });
    }

    handleEvent(event) {
        switch(event.type) {
            case 'mousedown':
                if(event.target.dataset.module) {
                    var module_id = event.target.dataset.module;
                    var module = this.module_lookup[module_id];
                    var mime_data = new MimeData();
                    mime_data.setData(
                        'application/vnd.phosphor.widget-factory', 
                        module.widget ? module.widget : () => { 
                            var widget = new Widget();
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
