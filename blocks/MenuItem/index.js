import React from 'react';
import bem from 'b_';
import BemComponent, { BemControl } from '../BemComponent';

const b = bem.with('menu-item');

export default class MenuItem extends BemComponent {
    constructor(props) {
        super(props);

        this.listeners = {
            onClick: this.onClick.bind(this)
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        super.componentWillReceiveProps(nextProps, nextContext);

        const hovered = nextContext.hoveredIndex === this.props.hoveredIndex;
        if (this.state.hovered !== hovered) {
            this.setState({hovered});
        }
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
                    {...listeners}
                >{this.props.children}</div>
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

MenuItem.contextTypes = {
    hoveredIndex: React.PropTypes.number
};

MenuItem.defaultProps = {
    disabled: false,
    onClick() {},
    onHover() {}
};
