import React, {PropTypes} from 'react';
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
    
    getVal() {
        return this.props.value;
    }
    
    componentWillReceiveProps(nextProps, nextContext) {
        super.componentWillReceiveProps(nextProps, nextContext);

        const hovered = nextContext.hoveredIndex === this.props.hoveredIndex;
        if (this.state.hovered !== hovered) {
            this.setState({hovered});
        }
    }

    render() {
        const { checked, disabled, hovered } = this.state;
        const { theme, size } = this.props;

        const className = b({
            theme,
            size,

            checked,
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
            if (this.props.checkable) {
                const newChecked = !this.state.checked;
                this.setState({checked: newChecked});
                this.props.onCheck(this, newChecked);
            }

            this.props.onClick(this);
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

MenuItem.propTypes = {
    disabled: PropTypes.bool,
    checkable: PropTypes.bool,

    onCheck: PropTypes.func,
    onClick: PropTypes.func,
    onHover: PropTypes.func
};

MenuItem.contextTypes = {
    hoveredIndex: PropTypes.number
};

MenuItem.defaultProps = {
    disabled: false,
    checkable: false,

    onCheck() {},
    onClick() {},
    onHover() {}
};
