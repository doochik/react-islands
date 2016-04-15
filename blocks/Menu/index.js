import React, {Children} from 'react';
import bem from 'b_';
import BemComponent, {BemControl} from '../BemComponent';

const b = bem.with('menu');

export default class Menu extends BemComponent {
    constructor(props) {
        super(props);

        Object.assign(this.state, {
            hoveredIndex: null
        });

        this.listeners = {
            onClick: this.onClick.bind(this),
            onKeyDown: this.onKeyDown.bind(this)
        };

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
        const {theme, size} = this.props;

        const className = b({
            theme,
            size,
            disabled,
            focused
        });

        return this.renderMenu(className, this.listeners);
    }

    renderMenu(className, listeners) {
        const {children} = this.props;
        const {disabled} = this.state;

        const items = Children.map(children, (item, i) => {
            return React.cloneElement(item, {
                // key: `MenuItem-${i}`,
                disabled: disabled ? disabled : item.props.disabled,
                hoveredIndex: i,

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

}

Menu.childContextTypes = {
    hoveredIndex: React.PropTypes.number,
    ...BemComponent.childContextTypes
};

Menu.defaultProps = {
    onClick() {}
};
