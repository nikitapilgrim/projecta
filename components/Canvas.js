import React, {useRef, useEffect, useMemo} from 'react'
import styled from 'styled-components'
import {useSpring, useSprings, animated} from 'react-spring'
import {useGesture} from 'react-use-gesture'
import {context, useAction, useAtom} from "@reatom/react"

import {zoomAtom} from "./UI/Zoom";

const Wrapper = styled(animated.div)`
  height: 80vh;
  width: 50vw;
  z-index: 0;
  background-color: white;
`;

export const Canvas = () => {
    const domTarget = React.useRef(null);
    const zoome = useAtom(zoomAtom);
    const hide = useMemo(() => {
        return zoome > 1.8
    }, [zoome]);

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

            </Wrapper>}
        </React.Fragment>

    )
};