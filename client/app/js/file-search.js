import * as d3 from 'd3'
import UIBot from 'uibot'
import {Observable} from 'rxjs'
import {Widget} from 'phosphor/lib/ui/widget'

class FileSearch extends Widget {
    constructor(store) {
        super();
        this.store = store;   
        this.search_state = {};
        this.store.subscribe('file_system.midi_library', this.update_list.bind(this));
        this.store.subscribe('file-search', this.update_file_search.bind(this));
        this.addClass('content');
        this.title.label = 'Files';
        this.filters_visible = false;
        this.filters_ui = UIBot();
        this.node.innerHTML = 
            `<div class='search-container'>
                <div class='search-input-container'>
                    <div>
                        <div class='search-component-label'>Search</div>
                        <input id='search-input' type='text' placeholder='keywords'></input>
                    </div>
                    <div id='search-filter-container' class='search-filter-container'>
                        <span id='filter-toggle-arrow' class='fa fa-caret-right'>
                            <div id='search-filters-toggle' class='search-component-label'>Details</div>
                        </span>
                        <div id='filters-container' class='search-filters'></div>
                    </div>
                </div>
                <div id='search-results-container' class='search-results-container'>
                    <div id='search-results-list' class='search-results-list'/>
                </div>
            </div>`
    }

    onAfterAttach(message) {
        var details_toggle = document.getElementById('search-filters-toggle');
        details_toggle.addEventListener('click', () => {
            var filters_container = document.getElementById('filters-container'); 
            var arrow = document.getElementById('filter-toggle-arrow');
            this.filters_visible = !this.filters_visible;
            d3.select(filters_container)
                .style('display', this.filters_visible ? 'inherit' : 'none');
            d3.select(arrow)
                .classed('fa-caret-down fa-caret-right', false)
                .classed(this.filters_visible ? 'fa-caret-down' : 'fa-caret-right', true);
        });

        var search_input = document.getElementById('search-input');
        var keyup = Observable.fromEvent(search_input, 'keyup')
            .debounceTime(500)
            .map(function (e) {
                return e.target.value;
            });

        keyup.subscribe((text)=> {
            // TODO: Call action for search for files
            console.log(text);
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

    update_file_search(data) {
        this.search_state = {...data.file_search.state};
        this.filters_ui.build(
            this.search_state, 
            data.file_search.config, 
            document.getElementById('filters-container'));
    }
}

export {FileSearch}
