import React, { Component } from 'react';
import './App.css';
import TweetList from './components/TweetList';
import MenuBar from './components/MenuBar.component';
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ScrollTop from './components/ScrollTop.component';

// Redux
import { Provider } from 'react-redux';
import store from './store';

class App extends Component {
  render() {
    return (
      <div id="back-to-top-anchor" className="App">   
        <Provider store={store}>
          <MenuBar/> 
          <TweetList/>
          <ScrollTop {...this.props}>
            <Fab color="" size="small" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </ScrollTop>
        </Provider>    
      </div>
    );
  }
}

export default App;