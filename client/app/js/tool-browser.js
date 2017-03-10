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
        this.node.innerHTML = `<div class='toolbox' id='tools-container'></div>`;

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
        var ref = this;
        d3.select('#tools-container')
            .selectAll('div')
            .data(this.config)
            .enter()
            .append('div')
            .attr('class', 'toolbox-category-container')
            .each(function(d, i) {
                var div = d3.select(this);
                var module_list = ref.module_lookup[d.category] = [];
                div.append('div')
                    .datum(d)
                    .attr('class', 'toolbox-category-label')
                    .text(d.category)

                var container = div.append('div');
                container.selectAll('div')
                    .data(d.modules)
                    .enter()
                    .append('div')
                    .attr('class', 'toolbox-module-container')
                    .attr('data-category', i)
                    .attr('data-module', (d, j) => {
                        return j;    
                    })
                    .each(function(d, j) {
                        var div = d3.select(this);
                        div.append('i')
                            .attr('class', 'fa ' + (d.icon || 'fa-bar-chart-o'))
                        div.append('div')
                            .attr('class', 'toolbox-module')
                            .text(d.name);
                    })
                    .on('mousedown', ref.on_module_click.bind(ref));
            });
    }

    on_module_click() {
        var event = d3.event;
        console.log(this);
        switch(event.type) {
            case 'mousedown':
                if(event.target.dataset.module) {
                    var category_idx = event.target.dataset.category;
                    var module_idx = event.target.dataset.module;
                    var module = this.config[category_idx].modules[module_idx];
                    var mime_data = new MimeData();
                    mime_data.setData(
                        'application/vnd.phosphor.widget-factory', 
                        module.widget ? module.widget : () => { 
                            var widget = new Widget();
                            widget.title.label = module.name; 
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
