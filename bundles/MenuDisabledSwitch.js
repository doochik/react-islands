import React from 'react';
import Button from '../blocks/Button';
import Menu from '../blocks/Menu';
import MenuItem from '../blocks/MenuItem';

export default class MenuDisabledSwitch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled: true
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({
            disabled: !this.state.disabled
        })
    }

    render() {
        return (
            <div>
                <Button onClick={this.handleClick} theme="islands" size="l">
                    {this.state.disabled ? 'Enable' : 'Disable'}
                </Button>
                <Menu theme="islands" disabled={this.state.disabled} size="l">
                    <MenuItem theme="islands">menu-item1</MenuItem>
                    <MenuItem theme="islands">menu-item2</MenuItem>
                    <MenuItem theme="islands">menu-item3</MenuItem>
                </Menu>
            </div>
        );
    }
}
