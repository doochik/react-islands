import React, {Children} from 'react';
import bem from 'b_';
import BemComponent, {BemControl} from '../BemComponent';

const b = bem.with('menu');

/**
 * Example render through props.renderItem
 * 
 * <Menu2
 *  theme="islands"
 *  renderItem={<MenuItem2/>}
 *  items={[
 *      {value: '1', text: 'menu-item2 1'},
 *      {value: '2', text: 'menu-item2 2'},
 *      {value: '3', text: 'menu-item2 3'},
 *      {value: '4', text: 'menu-item2 4'}
 *  ]}
 * </Menu2>
 */
export default class Menu2 extends BemComponent {
    constructor(props) {
        super(props);

        this._lastHoveredItem = null;
        this._items = [];

        this.listeners = {
            onClick: this.onClick.bind(this),
            onKeyDown: this.onKeyDown.bind(this)
        };

        this.onItemHover = this.onItemHover.bind(this);
        this.onItemInit = this.onItemInit.bind(this);
        this.onItemDestroy = this.onItemDestroy.bind(this);
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
        const {disabled} = this.state;

        const tabIndex = disabled ? -1 : 0;

        const items = this.props.items.map((item) => {
            return React.createElement(
                this.props.renderItem.type,
                Object.assign({
                    key: item.value,
                    // disable menu items
                    disabled: disabled,
                    theme: this.props.theme,
                    onHover: this.onItemHover,
                    // collect renderedMenuItems
                    onInit: this.onItemInit,
                    onDestroy: this.onItemDestroy
                }, item)
            );
        });

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
        if (hovered) {
            this._lastHoveredItem = menuItem;
        } else {
            if (this._lastHoveredItem && this._lastHoveredItem.state.hovered) {
                this._lastHoveredItem.setState({hovered: false});
            }

            this._lastHoveredItem = null;
        }
    }

    onItemInit(menuItem) {
        this._items.push(menuItem);
    }

    onItemDestroy(menuItem) {
        const index = this._items.indexOf(menuItem);
        if (index >= 0) {
            this._items.splice(index, 1);
        }
    }

    onKeyDown(e) {
        if (this.state.disabled || !this.state.focused) {
            return;
        }

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();

            const dir = e.key === 'ArrowDown' ? 1 : -1;
            const items = this._items;
            const len = items.length;
            const hoveredIdx = this._lastHoveredItem ? Math.max(items.indexOf(this._lastHoveredItem), 0) : 0;
            let nextIdx = hoveredIdx;
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
            } while (items[nextIdx].props.disabled);

            this._lastHoveredItem.setState({hovered: false});

            items[nextIdx].setState({hovered: true});
            this._lastHoveredItem = items[nextIdx];
        }
    }

}

Menu2.propTypes = {
    items: React.PropTypes.array
};

Menu2.defaultProps = {
    onClick() {}
};
