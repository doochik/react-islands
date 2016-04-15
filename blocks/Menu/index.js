import React, {Children, PropTypes} from 'react';
import bem from 'b_';
import BemComponent, {BemControl} from '../BemComponent';

const b = bem.with('menu');

export default class Menu extends BemComponent {
    constructor(props) {
        super(props);

        Object.assign(this.state, {
            hoveredIndex: null,
            value: this._recalcValue(this.props.children)
        });

        this.listeners = {
            onKeyDown: this.onKeyDown.bind(this)
        };

        this.onItemCheck = this.onItemCheck.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onItemHover = this.onItemHover.bind(this);
    }

    getChildContext() {
        return {
            hoveredIndex: this.state.hoveredIndex,
            ...super.getChildContext()
        };
    }

    render() {
        const {disabled, focused} = this.state;
        const {mode, size, theme} = this.props;

        const className = b({
            disabled,
            focused,
            mode,
            size,
            theme
        });

        return this.renderMenu(className, this.listeners);
    }

    renderMenu(className, listeners) {
        const {children, mode} = this.props;
        const {disabled, value} = this.state;

        const items = Children.map(children, (item, i) => {
            return React.cloneElement(item, {
                checkable: Boolean(mode),
                // TODO: perf
                checked: value.indexOf(item.props.value) > -1,
                disabled: disabled ? disabled : item.props.disabled,
                hoveredIndex: i,

                onCheck: this.onItemCheck,
                onClick: this.onItemClick,
                onHover: this.onItemHover
            });
        });

        const tabIndex = disabled ? -1 : 0;

        return (
            <BemControl>
                <div
                    className={className}
                    tabIndex={tabIndex}
                    {...listeners}
                >{items}</div>
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

    onItemCheck(menuItem, checked) {
        this._setVal(menuItem, checked);
    }

    onItemClick(menuItem) {
        // pass child event
        this.props.onItemClick(menuItem);
    }

    onItemHover(menuItem, hovered) {
        this.setState({
            hoveredIndex: hovered ? menuItem.props.hoveredIndex : null
        });
    }

    onKeyDown(e) {
        if (this.state.disabled || !this.state.focused) {
            return;
        }

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();

            const dir = e.key === 'ArrowDown' ? 1 : -1;
            const {children} = this.props;
            const len = children.length;
            let nextIdx = this.state.hoveredIndex || 0;
            let i = 0;

            do {
                nextIdx += dir;
                if (nextIdx < 0) {
                    nextIdx = len - 1;
                }
                if (nextIdx >= len) {
                    nextIdx = 0;
                }
                if (++i === len) {
                    // overflow
                    return;
                }
            } while (children[nextIdx].props.disabled);

            this.setState({hoveredIndex: nextIdx});
        }
    }

    _recalcValue(items) {
        const {mode} = this.props;
        if (!mode || !Array.isArray(items)) {
            return [];
        }

        const value = items
            .filter((item) => item.props.checked)
            .map((item) => item.props.value);

        if (mode === 'radio' && value.length > 1) {
            throw new Error('Menu mode="radio" can has only single checked MenuItem');
        }

        return value;
    }

    _setVal(menuItem, checked) {
        const {mode} = this.props;

        if (!mode) {
            return;
        }

        const val = menuItem.getVal();
        let value = this.state.value;

        if (mode === 'radio') {
            if (checked) {
                value = [val];
            } else {
                value = [];
            }

        } else {
            if (checked) {
                value.push(val);
            } else {
                var index = value.indexOf(val);
                if (index > -1) {
                    value.splice(index, 1);
                }
            }
        }

        this.setState({value});
        this.props.onChange(value);
    }
}

Menu.childContextTypes = {
    hoveredIndex: React.PropTypes.number,
    ...BemComponent.childContextTypes
};

Menu.propTypes = {
    disabled: PropTypes.bool,
    mode: PropTypes.oneOf(['check', 'radio']),

    onChange: PropTypes.func,
    onItemClick: PropTypes.func
};

Menu.defaultProps = {
    onChange() {},
    onItemClick() {}
};
