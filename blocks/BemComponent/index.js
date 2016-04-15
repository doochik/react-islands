import React, { Component } from 'react';
import Control from './Control';

export default class BemComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked,
            focused: props.focused,
            disabled: props.disabled,
            hovered: false,
        };
        this.handleControlMouseEnter = () => this.onControlMouseEnter();
        this.handleControlMouseLeave = () => this.onControlMouseLeave();
        this.handleControlFocus = () => this.onControlFocus();
        this.handleControlBlur = () => this.onControlBlur();
    }

    getChildContext() {
        return {
            handleControlMouseEnter: this.handleControlMouseEnter,
            handleControlMouseLeave: this.handleControlMouseLeave,
            handleControlFocus: this.handleControlFocus,
            handleControlBlur: this.handleControlBlur,
        };
    }

    componentWillReceiveProps({ checked, disabled }) {
        if (disabled !== this.state.disabled) {
            this.setState({ disabled });
        }
        if (disabled === true) {
            this.setState({ checked: false, focused: false });
            
        } else if (checked !== this.state.checked) {
            this.setState({ checked });
        }
    }

    onControlMouseEnter() {
        if (!this.state.disabled) {
            this.setState({ hovered: true });
        }
    }

    onControlMouseLeave() {
        this.setState({ hovered: false });
    }

    onControlFocus() {
        if (!this.state.disabled) {
            this.setState({ focused: true });
        }
    }

    onControlBlur() {
        this.setState({ focused: false });
    }
}

BemComponent.childContextTypes = {
    handleControlMouseEnter: React.PropTypes.func.isRequired,
    handleControlMouseLeave: React.PropTypes.func.isRequired,
    handleControlFocus: React.PropTypes.func.isRequired,
    handleControlBlur: React.PropTypes.func.isRequired,
};

export { Control as BemControl };
