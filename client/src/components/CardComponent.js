import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

const useStyles = theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
    chip:{
       marginLeft:10
    },
    chipTxtColor: {
        color:'#1976b2'
    },
    bigAvatar: {
        margin: 10,
        width: 60,
        height: 60,
    }
});

class CardComponent extends React.Component {
    render() {
        const { data } = this.props;
        const { classes } = this.props;

        return (
            <div className="card-panel">
                <Paper className={classes.root}>
                    <div className="card-content">
                        <div className="col s2">
                            <Avatar alt={data.user.name} src={data.user.profile_image_url} className={classes.bigAvatar} />
                        </div>
                        <Typography component="div">
                            <div className="col s10 left-align">
                                <span className="white-text">{data.text}</span>
                            </div>
                        </Typography>
                    </div>
                    <div>
                        <Chip className={classes.chip} size="medium" label={new Date(data.created_at).toLocaleTimeString()} />
                        <Chip className={`${classes.chip} ${classes.chipTxtColor}`} label={`@${data.user.screen_name}`} component="a" href={`https://twitter.com/${data.user.screen_name}`} clickable target="_blank"/>
                    </div>
                </Paper>
            </div>
        )
    }
}
export default withStyles(useStyles)(CardComponent);