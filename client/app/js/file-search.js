import * as d3 from 'd3'
import UIBot from 'uibot'
import {Observable} from 'rxjs'
import {Widget} from 'phosphor/lib/ui/widget'
import * as Actions from './actions'

class FileSearch extends Widget {
    constructor(store) {
        super();
        this.store = store;   
        this.search_state = {};
        this.addClass('content');
        this.title.label = 'Search';
        this.filters_visible = false;
        this.filters_ui = UIBot();
        this.node.innerHTML = 
            `<div class='search-container'>
                <div class='search-input-container'>
                    <div>
                        <div class='search-component-label'>Search</div>
                        <input id='search-input' data-param='keywords' type='text' placeholder='keywords'></input>
                    </div>
                    <div id='search-filter-container' class='search-filter-container'>
                        <span id='filter-toggle-arrow' class='fa fa-caret-right'>
                            <div id='search-filters-toggle' class='search-component-label'>Advanced</div>
                        </span>
                        <div id='filters-container' class='search-filters'></div>
                    </div>
                </div>
                <div id='search-results-container' class='search-results-container'>
                    <div id='search-results-list' class='search-results-list'/>
                </div>
            </div>`;
        
        this.store.subscribe('file_search.config', this.on_search_config_update.bind(this));
        this.store.subscribe('file_search.results', this.on_search_results_update.bind(this));
    }

    onAfterAttach(message) {
        d3.select('#search-filters-toggle')
            .on('click', () => {
                this.filters_visible = !this.filters_visible;

                d3.select('#filters-container')
                    .style('display', this.filters_visible ? 'inherit' : 'none');

                d3.select('#filter-toggle-arrow')
                    .classed('fa-caret-down fa-caret-right', false)
                    .classed(this.filters_visible ? 'fa-caret-down' : 'fa-caret-right', true);
            });

        this.add_input_keyup_observer(d3.select('#search-input').node());
    }

    add_input_keyup_observer(input) {
        var keyup = Observable.fromEvent(input, 'keyup')
            .debounceTime(250)
            .map(function (e) {
                return e.target;
            });

        keyup.subscribe((target)=> {
            this.search_state[target.dataset.param] = target.value;
            this.store.dispatch(Actions.search_files(this.search_state));
            return {}
        });
    }

    update_list(data) {
        var list = document.getElementById('search-results-list');
        for(var i = 0; i < data.file_system.midi_library.length; i++) {
            var item = document.createElement('div');
            item.className = 'search-result-list-item';
            item.innerHTML = 
                `<span class='fa fa-file-sound-o'/> 
                    <div class='search-item-label'>
                        ${data.file_system.midi_library[i].filename}
                    </div>`
            list.appendChild(item);
        }
    }

    on_search_config_update(data) {
        this.search_state = {...data.file_search.state};
        this.filters_ui.build(
            this.search_state, 
            data.file_search.config, 
            document.getElementById('filters-container'));

        var inputs = this.filters_ui.get_inputs();
        for(var i = 0; i < inputs.length; i++) {
            this.add_input_keyup_observer(inputs[i]);
        }
    }

    on_search_results_update(data) {
                 
    }
}

export {FileSearch}
