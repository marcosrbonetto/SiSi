import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { connect } from "react-redux";

import { Typography } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';

class MiControledPopover extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null
        }
    }

    getComponent(key) {

        if (Array.isArray(this.props.children) && this.props.children.filter((seccion)=>{return seccion.key == "mainContent"}).length > 0)
            return this.props.children.filter((comp) => {
                return comp.key === key;
            });
        else if (key == 'mainContent')
            return this.props.children

        return false;
    }

    handleOpenModal = event => {
        this.props.onPopoverOpen && this.props.onPopoverOpen();
        this.setState({ anchorEl: event.currentTarget });
    };

    handleCloseModal = (event) => {
        this.props.onPopoverClose && this.props.onPopoverClose();
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                {!this.props.buttonAction &&
                    <Typography
                        onClick={this.handleOpenModal}
                        className={classes.link}
                    >{this.props.textoLink}</Typography>
                }
                {this.props.buttonAction &&
                    <div>
                        {this.getComponent('buttonAction')}
                    </div>
                }
                <Popover
                    id="simple-popper"
                    open={Boolean(this.state.anchorEl)}
                    anchorEl={this.state.anchorEl}
                    onClose={this.handleCloseModal}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Paper className={classes.contaninerDetalle}>
                        <div class="closePopover" onClick={this.handleCloseModal}>x</div>
                        {this.getComponent('headerContent')}
                        {this.getComponent('mainContent')}
                        {this.getComponent('footerContent')}
                    </Paper>
                </Popover>
            </div>
        );
    }
}

const styles = theme => ({
    link: {
        color: theme.color.info.main,
        cursor: 'pointer'
    },
    contaninerDetalle: {
        padding: '10px',
        position: 'relative',
        '& .closePopover': {
            fontFamily: "\'Roboto\', \'Helvetica\', \'Arial\', \'sans-serif\'",
            fontSize: '15px',
            position: 'absolute',
            top: '-2px',
            right: '4px',
            cursor: 'pointer'
        }
    },
});

let componente = undefined;
componente = withStyles(styles)(MiControledPopover);
componente = connect(
    null,
    null
)(componente);
export default componente;