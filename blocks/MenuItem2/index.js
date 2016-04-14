import React from 'react';
import bem from 'b_';
import BemComponent, { BemControl } from '../BemComponent';

const b = bem.with('menu-item');

export default class MenuItem2 extends BemComponent {
    constructor(props) {
        super(props);

        this.listeners = {
            onClick: this.onClick.bind(this)
        };
    }

    componentWillMount() {
        this.props.onInit(this);
    }
    
    componentWillUnmount() {
        this.props.onDestroy(this);
    }

    render() {
        const { disabled, hovered } = this.state;
        const { theme, size } = this.props;

        const className = b({
            theme,
            size,

            disabled,
            hovered
        });

        return this.renderMenuItem(className, this.listeners)
    }

    renderMenuItem(className, listeners) {
        return (
            <BemControl>
                <div
                    className={className}
                    data-value={this.props.value}
                    {...listeners}
                >{this.props.text}</div>
            </BemControl>
        );
    }

    onClick(e) {
        if (this.state.disabled) {
            e.preventDefault();
        } else {
            this.props.onClick();
        }
    }

    onControlMouseEnter() {
        console.log('onControlMouseEnter')
        if (this.state.disabled) {
            return;
        }

        super.onControlMouseEnter();

        this.props.onHover(this, true);
    }

    onControlMouseLeave() {
        if (this.state.disabled) {
            return;
        }

        super.onControlMouseLeave();

        this.props.onHover(this, false);
    }
}

MenuItem2.defaultProps = {
    disabled: false,
    onClick() {},
    onDestroy() {},
    onInit() {},
    onHover() {}
};
