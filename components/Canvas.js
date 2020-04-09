import React, {useRef, useEffect, useMemo} from 'react'
import styled from 'styled-components'
import {useSpring, useSprings, animated} from 'react-spring'
import {useGesture} from 'react-use-gesture'
import {context, useAction, useAtom} from "@reatom/react"
import useWindowSize from '@rehooks/window-size';
import useSSR from "use-ssr/dist/useSSR";


import demoimg from './assets/stranica.png'

import {zoomAtom} from "./UI/Zoom";
import {declareAction, declareAtom} from "@reatom/core";

const Wrapper = styled(animated.div)`
  
  z-index: 0;
  background-color: white;
  user-select: none;
  img {
      max-width: 100%;
      border: none;
      height: auto;
  }
`;


const setCanvas = declareAction("setCanvas");

export const canvasAtom = declareAtom({scale: 1}, on => [
    on(setCanvas, (_state, size) => size),
]);

const getBoundingClientRect = element => {
    const {top, right, bottom, left, width, height, x, y} = element.getBoundingClientRect()
    return {top, right, bottom, left, width, height, x, y}
}


export const Canvas = () => {
    const domTarget = React.useRef(null);
    const zoome = useAtom(zoomAtom);
    const hide = useMemo(() => {
        return zoome > 1.8
    }, [zoome]);
    const {isBrowser} = useSSR();
    let windowSize = isBrowser ? useWindowSize(): null;

    const handleSetCanvas = useAction(canvas => setCanvas(canvas))

    useEffect(() => {
        if (domTarget.current && isBrowser) {
            const sizes = getBoundingClientRect(domTarget.current);
            const borders = {
                left: sizes.left,
                right: sizes.left + sizes.width,
                top: sizes.top,
                bottom: sizes.y + sizes.height
            };
            const parameter = {
                ref: domTarget,
                borders,
                sizes: {...sizes},
                scale: zoome
            };
            handleSetCanvas(parameter)
        }
    }, [zoome, windowSize, isBrowser]);

    const [{x, y, rotateX, rotateY, rotateZ, zoom, scale}, set] = useSpring(() => ({
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        zoom: 0,
        x: 0,
        y: 0,
        config: {mass: 5, tension: 350, friction: 40}
    }));

    const zooming = ({offset: [d, a]}) => {
        set({zoom: d / 200, rotateZ: a});
    }

    useEffect(() => {
        set({scale: zoome});
    }, [zoome]);

    const bind = useGesture(
        {
            onPinch: (props) => zooming(props),
            onWheel: (props) => zooming(props)
        },
        {domTarget, event: {passive: false}}
    );

    return (
        <React.Fragment>
            {!hide && <Wrapper ref={domTarget} {...bind()} style={{x, y, scale}}>
                <img src={demoimg} alt=""/>
            </Wrapper>}
        </React.Fragment>

    )
};