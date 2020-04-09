import React, {useRef, useState, useReducer} from 'react'
import styled from 'styled-components'
import {useSpring, animated} from 'react-spring'
import {useDrag} from 'react-use-gesture'
import {Zoom} from "./Zoom";
import {Tool} from "./Tool";
import {useAtom} from "@reatom/react";
import {canvasAtom} from "../Canvas";
import {nanoid} from 'nanoid'

const toolsIcons = {
    image: require("./assets/image-active.svg").default,
    sound: require("./assets/sound-active.svg").default,
    text: require("./assets/text-active.svg").default,
    video: require("./assets/video-active.svg").default,
    warning: require("./assets/warning-small.svg").default,
};

const Wrapper = styled(animated.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 23px;
  
  position: absolute;
  left: 5vw;
  top: 10vh;
  z-index: 2;
  width: 50px;
    height: 473px;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16);
    background-color: #ffffff;
  user-select: none;

`

const Header = styled.div`
  width: 100%;
  background-color: #666666;
    color: #ffffff;
    font-family: "Roboto Condensed";
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    cursor: pointer;
`


const List = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

`;

const getInitialState = () => ({
    attached: false,
    id: nanoid()
});

const globalInitialState = {
    sound: [getInitialState()],
    video: [getInitialState()],
    text: [getInitialState()],
    image: [getInitialState()]
};

const changePropertyById = (state, id, type, prop, value) => {
    let newState = state[type].map(item => {
        if (item.id === id) {
            item[prop] = value
        }
        return item
    });
    return {...state, newState}
};

const removeElemById = (state, id, type) => {
    let copy = {...state};
    copy[type] = copy[type].filter(item => item.id !== id);
    return copy
};


function reducer(state, action) {
    switch (action.type) {
        case 'add':
            return {...state, [action.elem]: [...state[action.elem], getInitialState()]};
        case 'attach':
            return changePropertyById(state, action.id, action.elem, 'attached', true);
        case 'unattach':
            return changePropertyById(state, action.id, action.elem, 'attached', false);
        case 'remove':
            if (!state[action.elem].every(elem => elem.attached)) return state
            return removeElemById(state, action.id, action.elem);
        default:

    }
    console.log(state)
}


export const Tools = () => {
    const [{x, y}, set] = useSpring(() => ({x: 0, y: 0}));
    const [stateTools, dispatch] = useReducer(reducer, globalInitialState);
    const dragTarget = useRef(null);

    const bind = useDrag(({first,offset: [x, y], event, cancel, down}) => {
        const target = event.target;
        if (first) dragTarget.current = target;
        if (dragTarget.current && dragTarget.current.classList.contains('draggable__icon')) {
            cancel();
        }
        set({x, y})
    });

    return (
        <Wrapper {...bind()} style={{x, y}}>
            <Header>
                Alatke
            </Header>
            <List className={'ui-tools'}>
                <Tool stateTools={stateTools.image} type={'image'} dispatch={dispatch} icon={toolsIcons.image}
                      name={'Slika'}/>
                <Tool stateTools={stateTools.sound} type={'sound'} dispatch={dispatch} icon={toolsIcons.sound}
                      name={'Zvuk'}/>
                <Tool stateTools={stateTools.video} type={'video'} dispatch={dispatch} icon={toolsIcons.video}
                      name={'Video'}/>
                <Tool stateTools={stateTools.text} type={'text'} dispatch={dispatch} icon={toolsIcons.text}
                      name={'Tekst'}/>
            </List>
            <Zoom/>

        </Wrapper>
    )
};