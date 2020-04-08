import React, {useRef, useMemo, useState, useEffect, memo, useCallback} from 'react'
import usePortal from 'react-useportal'
import styled from 'styled-components'
import {Modal} from "./modals/Modal";
import {useSpring, animated} from 'react-spring'
import {useDrag} from 'react-use-gesture'
import {canvasAtom} from "../Canvas"
import {context, useAction, useAtom} from "@reatom/react"
import {zoomAtom} from "./Zoom";
import warningIcon from "./assets/warning-small.svg"

const Name = styled.div`
 
`

const Icon = styled(animated.div)`
  position: absolute;
  top: 0;
  width: ${props => props.width || `32px`};
  height: ${props => props.height || `32px`};;
  background: url("${props => props.url}");
  background-repeat: no-repeat;
  background-size: cover;
`;

const WarringIcon = styled(Icon)`

`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    cursor: pointer;
    height: 50px;
    width: 32px;

  &:not(:first-child) {
    margin-top: 10px;
  }
`;

const Warning = styled.div`
   position: absolute;
   bottom: 12px;
   left: -3px;
`;

const overlap = (rect1, rect2) => !(rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom);


const getBoundingClientRect = element => {
    const {top, right, bottom, left, width, height, x, y} = element.getBoundingClientRect()
    return {top, right, bottom, left, width, height, x, y}
}


function lowestValueAndKey(obj) {
    const [lowestItems] = Object.entries(obj).sort(([, v1], [, v2]) => v1 - v2);
    return lowestItems[0]
}

const DraggedIcon = memo(({url, update, data}) => {
    const canvas = useAtom(canvasAtom);
    const target = useRef(null);
    const {attached} = data;
    const [{x, y, scale}, set] = useSpring(() => ({x: 0, y: 0, scale: 1}));
    useEffect(() => {
        if (attached) {
            set({scale: canvas.scale})
        }
        if (!attached) set({scale: 1})
    }, [canvas, attached]);

    const bind = useDrag(({
                              down,
                              movement: [mx, my],
                              offset: [x, y],
                              xy,
                              previous
                          }) => {
        const sizes = target.current.getBoundingClientRect();
        const size = {
            left: sizes.x,
            right: sizes.x + sizes.width,
            top: sizes.y,
            bottom: sizes.y + sizes.height
        };
        const overlaped = overlap(canvas.borders, size);
        const to = {
            right: canvas.borders.right - sizes.width * 2,
            left: canvas.borders.left - sizes.width * 2,
            top: canvas.borders.top - sizes.height * 2,
            bottom: canvas.borders.bottom + sizes.height * 2
        };


        if (overlaped) {
            let snap = false;
            const canvasSizes = getBoundingClientRect(canvas.ref.current);
            const prepare = Object.entries(canvasSizes).reduce((acc, pair) => {
                const [key] = pair;
                let newValue = 0;

                if (key === 'height' || key === 'width' || key === 'x' || key === 'y') return acc;
                newValue = sizes[key] - canvasSizes[key];
                if (key === 'right' || key === 'bottom') {
                    newValue = Math.abs(sizes[key] - canvasSizes[key]);
                }
                //only x axis
                if (key === 'top' || key === 'bottom') return acc;
                return {
                    ...acc,
                    [key]: newValue
                }
            }, {});
            console.log(mx, prepare)



            if (!down) {
                const direction = lowestValueAndKey(prepare);
                set({x: to[direction], y: my});
                if (!attached) update({type: 'add'});
                update({type: 'attach'});
            }
            if (down) set({x: mx, y: my})
        }
        if (!overlaped) {
            if (!down) {
                update({type: 'unattach'});
                update({type: 'remove'});
            }
            set({x: down ? mx : 0, y: down ? my : 0})
        }
    });


    return (
        <Icon ref={target} url={url} {...bind()} style={{x, y, scale}}>
            {attached && <Warning>
                <Icon width={'16px'} height={'16px'} url={warningIcon}/>
            </Warning>}
        </Icon>
    )
});


export const Tool = ({icon, type, name, stateTools, dispatch}) => {
    const lastPosition = useRef(null);
    const update = useCallback(id => (action) => dispatch({id, elem: type, ...action}), []);

    return (
        <Wrapper>
            {stateTools.map((item) => {
                return <DraggedIcon data={item} update={update(item.id)} key={item.id} url={icon}/>
            })}

            <Name>
                {name}
            </Name>
        </Wrapper>
    )
};

