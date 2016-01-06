import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../blocks/button';
import TextInput from '../blocks/textinput';
import Link from '../blocks/link';

function handleClick() {
    console.log('click!');
}

ReactDOM.render(
    <div>
        <Button name="btn1" size="s">Click me!</Button>
        <br/>
        <TextInput size="s" value="islands" placeholder="Fill me!" />
        <br/>
        Link: <Link size="s" url="#/https://yandex.ru">Yandex</Link>
        <br/>
        Pseudo link: <Link size="s" onClick={handleClick}>Yandex</Link>
    </div>,
    document.getElementById('root')
);