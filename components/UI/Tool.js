import React, {useRef, useMemo, useState, useEffect, memo, useCallback} from 'react'
import usePortal from 'react-useportal'
import styled from 'styled-components'
import {Modal} from "./modals/Modal";
import {useSpring, animated} from 'react-spring'
import {useDrag} from 'react-use-gesture'
import {canvasAtom} from "../Canvas"
import {context, useAction, useAtom} from "@reatom/react"
import {zoomAtom} from "./Zoom"
import {ModalAsPortal} from "./modals/Modal";
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

const DraggedIcon = memo(({type, url, update, data}) => {
    const {Portal} = usePortal();
    const canvas = useAtom(canvasAtom);
    const target = useRef(null);
    const draggingIcon = useRef(false);
    const [modalOpen, setModalOpen] = useState(false);
    const {attached} = data;
    const [{x, y, scale}, set] = useSpring(() => ({x: 0, y: 0, scale: 1}));
    useEffect(() => {
        if (attached) {
            set({scale: canvas.scale})
        }
        if (!attached) set({scale: 1})
    }, [canvas, attached]);

    const bind = useDrag(({
                              event,
                              dragging,
                              down,
                              movement: [x, y],
                              offset: [mx, my],
                              xy,
                              previous
                          }) => {

        const targetDrag = event.target;

        if (!dragging) {
            draggingIcon.current = false
        }
        if (dragging) {
            setTimeout(() => {
                if (dragging) draggingIcon.current = true
            }, 200);
        }
        const sizes = getBoundingClientRect(target.current);
        const size = {
            left: sizes.left,
            right: sizes.left + sizes.width,
            top: sizes.top,
            bottom: sizes.bottom + sizes.height
        };
        const overlaped = overlap(canvas.borders, size);
        const to = {
            right: canvas.borders.right - sizes.width * 2.2,
            left: canvas.borders.left - sizes.width * 2.2,
            top: canvas.borders.top - sizes.height * 2.2,
            bottom: canvas.borders.bottom - sizes.height * 2.2
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
            const percentage = {
                left: prepare.left / canvasSizes.width * 100,
                right: prepare.right / canvasSizes.width * 100
            };


            if (!down && percentage[lowestValueAndKey(percentage)] < 10) {
                const direction = lowestValueAndKey(prepare);
                set({x: to[direction], y: my});
                if (!attached) update({type: 'add'});
                update({type: 'attach'});
            }
            if (!down && percentage[lowestValueAndKey(percentage)] > 10) {
                set({x: mx, y: my});
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

    const openModal = () => {
        if (attached && draggingIcon.current === false) {
            setModalOpen(true)
        }
    };
    const closeModal = () => {
        setModalOpen(false)
    };

    return (
        <>
            <Icon className={'draggable__icon'} ref={target} url={url} {...bind()} style={{x, y, scale}}>
                {attached && <Warning onClick={openModal}>
                    <Icon width={'16px'} height={'16px'} url={warningIcon}/>
                </Warning>}
            </Icon>
            <ModalAsPortal type={type} closeModal={closeModal} active={modalOpen}></ModalAsPortal>
        </>

    )
});


export const Tool = ({icon, type, name, stateTools, dispatch}) => {
    const lastPosition = useRef(null);
    const update = useCallback(id => (action) => dispatch({id, elem: type, ...action}), []);

    return (
        <Wrapper>
            {stateTools.map((item) => {
                return <DraggedIcon type={type} data={item} update={update(item.id)} key={item.id} url={icon}/>
            })}
            <Name>
                {name}
            </Name>
        </Wrapper>
    )
};

