import * as d3 from 'd3'
import UIBot from 'uibot'
import deepEql from 'deep-eql'
import {Observable} from 'rxjs'
import {Widget} from 'phosphor/lib/ui/widget'
import * as Actions from './actions'

class FileSearch extends Widget {
    constructor(store) {
        super();
        this.store = store;   
        this.addClass('content');
        this.title.label = 'Search';
        this.filters_visible = false;
        this.filters_ui = UIBot();
        this.previous_search = {};
        this.search = { keywords: ''};

        this.node.innerHTML = 
            `<div class='search-container'>
                <div class='search-input-container'>
                    <div>
                        <div class='search-component-label'>Search</div>
                        <input id='search-input' data-param='keywords' type='text' placeholder='keywords'></input>
                    </div>
                </div>
                <div id='search-results-container' class='search-results-container'>
                    <div id='search-results-list' class='search-results-list'/>
                </div>
            </div>`;
        
        this.store.subscribe('search_results', this.on_search_results_update.bind(this));
    }

    onAfterAttach(message) {
        var input = d3.select('#search-input').node();
        var keyup = Observable.fromEvent(input, 'keyup')
            .debounceTime(250)
            .map(function(e) {
                return e;
            })

        keyup.subscribe( event => {
            this.on_search_input_change(event);
        });

        var change = Observable.fromEvent(input, 'change')
            .debounceTime(250)
            .map(function(e) {
                return e;

            });

        change.subscribe( event => {
            this.on_search_input_change(event);
        });
    }
        
    on_search_input_change(event) {
        var keywords = d3.select('#search-input').node().value;
        keywords = keywords.length ? keywords.split(' ') : [];
        this.search['keywords'] = keywords;
        if(!deepEql(this.search, this.previous_search)) {
            this.store.dispatch(Actions.search_files(this.search));
            this.previous_search = {...this.search};
        }
    }

    on_search_results_update(data) {
        var files = data.search_results;
        d3.selectAll('.search-result-list-item').remove(); 
        d3.select('#search-results-list')
            .selectAll('div')
            .data(files)
            .enter()
            .append('div')
            .classed('search-result-list-item', true)
            .each(function(d) {
                d3.select(this)
                    .attr('file-file-data', d.checksum)
                    .append('span')
                    .classed('fa fa-file-sound-o', true)
                    .each(function() {
                        d3.select(this)
                            .append('div')
                            .classed('search-item-label', true)
                            .text(d.filename)
                    })
            });
    }
}

export {FileSearch}
