import React, {useRef} from 'react'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import ReactSlider from 'react-slider'
import Slider from 'rc-slider';
import {context, useAction, useAtom} from "@reatom/react"
import {declareAction, declareAtom} from '@reatom/core'

const StyledSlider = styled(ReactSlider)`
    height: 300px;
    background-color: gray;
`;

const StyledThumb = styled.div`
    height: 25px;
    line-height: 25px;
    width: 25px;
    text-align: center;
    background-color: #000;
    color: #fff;
    border-radius: 50%;
    cursor: grab;
`;

const Thumb = (props, state) => <StyledThumb {...props}>{state.valueNow}</StyledThumb>;

const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
    background: ${props => props.index === 2 ? '#f00' : props.index === 1 ? '#0f0' : '#ddd'};
    border-radius: 999px;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

const SliderWrapper = styled.div`
  flex-grow: 1;
  margin-top: 23px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Name = styled.div`
  color: #666666;
font-family: "Roboto Condensed";
font-size: 13px;
font-weight: 700;
`

const Percentage = styled.div`
color: #666666;
font-family: "Roboto Condensed";
font-size: 11px;
font-weight: 300;
`

const setZoom = declareAction("setZoom");

export const zoomAtom = declareAtom(1, on => [
    on(setZoom, (_state, zoom) => zoom),
]);


export const Zoom = () => {
    const zoom = useAtom(zoomAtom);
    const handleChangeZoom = useAction(factor => setZoom(factor));

    return (
        <SliderWrapper>
            <Name>
                Zoom
            </Name>
            <Percentage>
                {Math.round(zoom * 100)}%
            </Percentage>
            <Slider vertical min={0.2} max={2} step={0.1} included={false} onChange={handleChangeZoom} defaultValue={1} />
        </SliderWrapper>
    )
};