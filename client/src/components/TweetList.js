import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import socketIOClient from "socket.io-client";
import CardComponent from './CardComponent';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import Link from '@material-ui/core/Link';
import { notify } from '../actions/notify.action';
import { trackTweets, setTweetCount } from '../actions/search.action';
import store from '../store';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Fab from "@material-ui/core/Fab";
import PlayIcon from './PlayIcon.component';
import PauseIcon from './PauseIcon.component';

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
        marginTop:34
    },
    input: {
        display: 'none',
    },
    card: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    fab: {
      margin: theme.spacing(1)
    },
    extendedIcon: {
      marginRight: theme.spacing(1)
    },
    playBtn:{
      backgroundColor:'Blue'
    }
});


class TweetList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        items: [], 
        searchTerm: store.getState().trackTweets.searchTermUpdated, 
        totalList: [],
        resumeState: true 
    };
    this.handlePause = this.handlePause.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.count = 0;

  }

  handlePause(event) {
    fetch("/pause",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

componentDidMount() {
  let socket = socketIOClient('http://localhost:3000/');
  if(process.env.NODE_ENV === 'production') { socket = 
    socketIOClient('https://guarded-wave-15906.herokuapp.com') 
  }
  const { notify } = this.props;

  socket.on('connect', () => {
    console.log("Socket Connected");

    socket.on("tweets", data => {
        this.count += 1;
        notify(this.count)
        let ogList = [data].concat(this.state.totalList);
        let newList = [data].concat(this.state.items);
        if (newList.length <=25) {
            //totalList stores all the incoming tweets
            //items stores tweets which is has been loaded
            this.setState({ items: newList, totalList: ogList });
        } 
        else this.setState({totalList: ogList})
    });
  });

  socket.on('disconnect', () => {
    socket.off("tweets")
    socket.removeAllListeners("tweets");
    console.log("Socket Disconnected");
  });
}

componentDidUpdate(prevProps, prevState) {
  const { setTweetCount } = this.props

  let counter = store.getState().notify.notificationCounter
    if ( counter === 0) {
        //If notofication Icon is clicked then couter will reset to 0
    }
    if (prevState.searchTerm !== store.getState().trackTweets.searchTermUpdated) {
        let payload = {searchTerm: prevState.searchTerm, notificationCounter: counter}
        setTweetCount(payload);
        this.count = 0;
        notify(this.count)
        //update searchTerm
        this.setState({searchTerm: store.getState().trackTweets.searchTermUpdated})
    }
    if (prevState.searchTerm && prevState.searchTerm !== store.getState().trackTweets.searchTermUpdated) {
        //empty tweetlist when search term is changed
        this.setState({items: [], totalList:[]})
    }
}



/**
 * @description Function to load more tweets
 */
loadMoreTweets() {
    const { items } = this.state;
    let duplicateList = items.concat(this.state.totalList)
    let newList = [...new Set(duplicateList)]; //remove duplicate items after concatinating
    this.setState({items : newList})
}

/**
 * @desc play/pause tweet streaming
 */
togglePlay() {
  this.setState({resumeState: !this.state.resumeState}, () =>{
    if (this.state.resumeState) this.props.trackTweets();
    else this.handlePause();
  })
}

render() {
    const { items, totalList, resumeState } = this.state;
    const { classes } = this.props;
    let mostTweetedTerm = store.getState().setTweetCount.mostTweetedTerm;
    let notificationCounter = store.getState().setTweetCount.notificationCounter;
    console.log('mostTweetedTerm : ',mostTweetedTerm)

    let itemsCards = <TransitionGroup className="tweet_container">
        {
            items.map((x, id) =>
                <CSSTransition  key={id} timeout={500}>                
                    <CardComponent data={x} />
                </CSSTransition>
            )
        }
    </TransitionGroup>;

    let filterControls = <div onClick={()=>{this.togglePlay()}}>
      <Fab aria-label="add" className={classes.fab}>
        {resumeState? <PlayIcon/> : <PauseIcon/>}
      </Fab>
    </div>

    let controls = <div>
      {
        items.length > 0 ? filterControls : null
      }
    </div>

    let loading = <div>
      <p className="flow-text">Listening to Streams</p>
      <div className="progress lime lighten-3">
        <div className="indeterminate pink accent-1"></div>
      </div>
    </div>

    return (
        <Fragment>
            <div className="row">
                <div className="col s12 m4 l4">
                    <div className="input-field col s12">
                        {items.length > 0 ? controls : null}
                    </div>
                </div>
                <div className="history_container">
                  <Card className={classes.card}>
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                          History of Most Tweeted Term
                        </Typography>
                        <Typography variant="h5" component="h2">
                         {mostTweetedTerm ? mostTweetedTerm : null}
                        </Typography>
                        <Typography variant="h1" component="h1">
                          {notificationCounter ? notificationCounter : null}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">Detail History</Button>
                      </CardActions>
                    </Card>
                  </div>
                <div className="col s12 m4 l4 tweet_body_content">
                    
                    <div>
                        {items.length > 0 ? itemsCards : loading}
                    </div>
                  </div>
                <div className="col s12 m4 l4"></div>
              </div>
            {
                items.length >= 25 && items.length !== totalList.length? 
                <div className="load_more">
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => {this.loadMoreTweets()}}
                    >
                    Load More
                  </Link> 
                </div>: null
            }
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
    notify: state.notify,
    trackTweets: state.trackTweets,
    setTweetCount: state.setTweetCount
});

export default connect(mapStateToProps, { notify, trackTweets, setTweetCount })(withStyles(useStyles)(TweetList));
