import * as d3 from 'd3'
import {Observable} from 'rxjs'
import {Widget} from 'phosphor/lib/ui/widget'

class FileBrowser extends Widget {
    constructor(store) {
        super();
        this.store = store;   
        this.store.subscribe('file_system.midi_library', this.update_list.bind(this));
        this.addClass('content');
        this.title.label = 'Files';
        this.filters_visible = false;
        this.node.innerHTML = 
            `<div class='search-container'>
                <div class='search-input-container'>
                    <div>
                        <div class='search-component-label'>Search</div>
                        <input id='search-input' type='text'></input>
                    </div>
                    <div id='search-filter-container' class='search-filter-container'>
                        <span id='filter-toggle-arrow' class='fa fa-caret-right'>
                            <div id='search-filters-toggle' class='search-component-label'>Details</div>
                        </span>
                        <ul id='filter-list' class='search-filters'>
                            <li><input type='checkbox' checked='true'/>Artist</li>
                            <li><input type='checkbox' checked='true'/>Album</li>
                            <li><input type='checkbox' checked='true'/>Composer</li>
                            <li><input type='checkbox' checked='true'/>Song Title</li>
                            <li><input type='checkbox' checked='true'/>Genre</li>
                            <ul>
                                <li><input type='checkbox' checked='true'/>Alternative</li>
                                <li><input type='checkbox' checked='true'/>Blues</li>
                                <li><input type='checkbox' checked='true'/>Country</li>
                                <li><input type='checkbox' checked='true'/>Hip Hop</li>
                                <li><input type='checkbox' checked='true'/>Pop</li>
                            </ul>
                            <li><input type='checkbox' checked='true'/>Year</li>
                            <li><input type='text' placeholder='date range (ex. 1954-1976)'/></li>
                        </ul>
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
            var filters_list = document.getElementById('filter-list'); 
            var arrow = document.getElementById('filter-toggle-arrow');
            this.filters_visible = !this.filters_visible;
            d3.select(filters_list)
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
            })

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
}

export {FileBrowser}
