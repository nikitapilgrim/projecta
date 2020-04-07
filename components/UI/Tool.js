import React, {useRef, useMemo, useState, useEffect} from 'react'
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

const Icon = styled.div`
  position: relative;
  width: ${props => props.width || `32px`};
  height: ${props => props.height || `32px`};;
  background: url("${props => props.url}");
  background-repeat: no-repeat;
  background-size: cover;
`;


const Wrapper = styled(animated.div)`
    position: relative;
    cursor: pointer;

  &:not(:first-child) {
    margin-top: 10px;
  }
`;

const Warning = styled.div`
   position: absolute;
   bottom: -3px;
   left: -3px;
`;

const overlap = (rect1, rect2) => !(rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom);


function lowestValueAndKey(obj) {
    const [lowestItems] = Object.entries(obj).sort(([, v1], [, v2]) => v1 - v2);
    return lowestItems[0]
}



export const Tool = ({icon, type}) => {
    const [{x, y, scale}, set] = useSpring(() => ({x: 0, y: 0, scale: 1}));
    const canvas = useAtom(canvasAtom);
    const target = useRef(null);
    const [attached, setAttached] = useState(false);
    const lastPosition = useRef(null);

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
            const prepare = Object.entries(canvas.sizes).reduce((acc, pair) => {
                const [key] = pair;
                let newValue = 0;

                if (key === 'height' || key === 'width' || key === 'x' || key === 'y') return acc;
                newValue = sizes[key] - canvas.sizes[key];
                if (key === 'right' || key === 'bottom') {
                    newValue = Math.abs(sizes[key] - canvas.sizes[key]);
                }
                //only x axis
                if (key === 'top' || key === 'bottom') return acc;
                return {
                    ...acc,
                    [key]: newValue
                }
            }, {});


            if (!down) {
                const direction = lowestValueAndKey(prepare);
                set({x: to[direction], y: my});
                setAttached(true);
            }
            if (down) set({x: mx, y: my})
        }
        if (!overlaped) {
            setAttached(false)
            set({x: down ? mx : 0, y: down ? my : 0})
        }
    });


    return (
        <Wrapper ref={target} {...bind()} style={{x, y, scale}}>
            <Icon url={icon}>
                {attached && <Warning>
                    <Icon width={'16px'} height={'16px'} url={warningIcon}/>
                </Warning>}
            </Icon>
            <Name>
                {type}
            </Name>

        </Wrapper>
    )
};

