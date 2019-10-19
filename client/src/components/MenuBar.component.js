import React, { Component } from 'react';
import { connect } from 'react-redux';
/*import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'*/
//import { fade, makeStyles } from '@material-ui/core/styles';
import { fade,withStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { setSearch, trackTweets } from '../actions/search.action';
import { notify } from '../actions/notify.action';
import store from '../store';

const useStyles = theme => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
          display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
          display: 'none',
        },
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
});

class MenuBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationCount : store.getState().notify.notificationCounter
        }

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.notificationCount !== store.getState().notify.notificationCounter) {
            this.setState({notificationCount: store.getState().notify.notificationCounter})
        }
    }

    handleKeyPress(event) {
        const { trackTweets } = this.props;
        if (event.key === 'Enter') {
            trackTweets();//stream tweet for entered keyword
        }
    }

    test() {
        console.log('Susseess')
    }

    render() {
        const { notificationCount } = this.state;
        const { classes, setSearch, notify,trackTweets } = this.props;
        const bull = <span className={classes.bullet}>•</span>;

        return (
            <div className={classes.grow}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                        >
                        </IconButton>
                        <Typography variant="h5" component="h2" style={{color:'white'}}>
                            Tw
                          {bull}
                          e
                          e{bull}
                          ty
                        </Typography>
                        <div className={classes.search}>
                            {/*<div className={classes.searchIcon} onClick={()=>{this.test()}}>
                                <SearchIcon/>
                            </div>*/}
                            <IconButton 
                                aria-label="delete" 
                                style={{float:'right'}} 
                                className={classes.margin}
                                onClick={trackTweets}
                            >
                                <SearchIcon />
                            </IconButton>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={setSearch}
                                onKeyPress={this.handleKeyPress}
                            />
                        </div>
                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            <IconButton aria-label="show new notifications" color="inherit">
                                <Badge badgeContent={notificationCount && notificationCount >0?notificationCount: null } color="secondary">
                                    <NotificationsIcon onClick={() => {notify(0)}}/>
                                </Badge>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        )
       
    }
}
const mapStateToProps = state => ({
    notify: state.notify
});

export default connect(mapStateToProps, { setSearch, trackTweets, notify })(withStyles(useStyles)(MenuBar));
//export default MenuBar;

 /*return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h4" color="inherit">
                            Tweetvati
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        )*/