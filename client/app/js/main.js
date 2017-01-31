// application
import * as Actions from './actions'
import Store from './store'
import {View} from './view'

// css
require('phosphor/styles/base.css')
require('../styles/index.css');
require('../styles/font-awesome.min.css');

// init
const store = new Store() 
new View(store);
store.dispatch(Actions.bootstrap());
