import {Widget} from 'phosphor/lib/ui/widget'

class ToolBrowser extends Widget {
    constructor(store) {
        super();
        this.store = store;
        this.store.subscribe('tools', this.on_tool_update.bind(this));

        this.addClass('content');
        this.title.label = 'Tools';
        this.node.innerHTML = `<div class='toolbox'></div>`
    }

    on_tool_update(data) {
        var container = this.node.getElementsByTagName('div')[0];
        for(var i = 0; i < data.tools.length; i++) {
            var category = data.tools[i];
            var modules = category.modules;

            var html = 
                `<div class='toolbox-category-container'>
                    <div class='toolbox-category-label'>${category.category}</div>`;

            for(var j = 0; j < modules.length; j++) {
                var module = modules[j];
                html += `<div class='toolbox-module-container'>
                            <i class='fa ${category.icon || 'fa-bar-chart-o'}' ></i>
                            <div class='toolbox-module'>${module.name}</div>
                            <br/>
                        </div>`;
            }
            html += `</div>`;

            container.insertAdjacentHTML('beforeend', html);
        }
    }
}

export {ToolBrowser}
