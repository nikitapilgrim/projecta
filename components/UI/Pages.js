import React, {useRef} from 'react'
import styled from 'styled-components'
import { useSpring, useSprings, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
const arrayMove = require('array-move');
import {Switcher} from "./Switcher";
import {PlusSvg} from "../assets/PlusSvg";
import {FileImportSvg} from "../assets/FileImport";

const Wrapper = styled(animated.div)`
  position: absolute;
  right: 5vw;
  top: 5vh;
  z-index: 2;
  min-height: 600px;
  width: 105px;
  height: 663px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  user-select: none;
`;

const Header = styled.div`
   background-color: #666666;
    color: #ffffff;
    font-family: "Roboto Condensed";
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    cursor: pointer;
`;

const Actions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Button = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  span {
  color: #666666;
font-family: "Roboto Condensed";
font-size: 12px;
font-weight: 400;
  }
`

const Page = styled.div`
  width: 80px;
  height: 80px;
  background-color: gray;
  &:not(:first-child) {
    margin-top: 10px;
  }
`;

const Top = styled.div`
   padding: 16px;
`

const SwitcherWrapper = styled.div`
  padding: 0 10px;

`;

// Returns fitting styles for dragged/idle items
const fn = (order, down, originalIndex, curIndex, y) => index =>
    down && index === originalIndex
        ? { y: curIndex * 100 + y, scale: 1.1, zIndex: '1', shadow: 15, immediate: n => n === 'y' || n === 'zIndex' }
        : { y: order.indexOf(index) * 100, scale: 1, zIndex: '0', shadow: 1, immediate: false };

const clamp = (val,min, max) => Math.min(Math.max(min, val), max)


export const Pages = () => {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }));
    const memoryCancel = useRef(false);
    const bind = useDrag(({ offset: [x, y], event,cancel, down }) => {
        const target = event.target;
        if (!memoryCancel.current && target && target.closest('.ui-pages')) {
            memoryCancel.current = true;
            cancel();
        }
        if (!down) {
            memoryCancel.current = false;
        }
        if (!memoryCancel.current) set({ x, y })
    });

    return (
        <Wrapper {...bind()} style={{ x, y }}>
            <Header>Stranice</Header>
            <Top>
                <Actions>
                    <Button>
                        <PlusSvg/>
                        <span>Nova</span>
                    </Button>
                    <Button>
                        <FileImportSvg/>
                        <span>Import</span>
                    </Button>
                </Actions>
            </Top>
            <SwitcherWrapper>
                <Switcher/>
            </SwitcherWrapper>

            <DraggableList items={[1,2,3,4,5,6]}/>

        </Wrapper>
    )
};

function DraggableList({ items }) {
    const order = useRef(items.map((_, index) => index)) // Store indicies as a local ref, this represents the item order
    const [springs, setSprings] = useSprings(items.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.
    const bind = useDrag(({ args: [originalIndex], down, movement: [, y] }) => {
        const curIndex = order.current.indexOf(originalIndex)
        const curRow = clamp(Math.round((curIndex * 100 + y) / 100), 0, items.length - 1)
        const newOrder = arrayMove(order.current, curIndex, curRow)
        setSprings(fn(newOrder, down, originalIndex, curIndex, y)) // Feed springs new style data, they'll animate the view without causing a single render
        if (!down) order.current = newOrder
    })
    return (
        <div className="ui-pages" >
            {springs.map(({ zIndex, shadow, y, scale }, i) => (
                <animated.div
                    {...bind(i)}
                    key={i}
                    style={{
                        zIndex,
                        boxShadow: shadow.to(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
                        y,
                        scale
                    }}>
                    <Page></Page>
                </animated.div>
            ))}
        </div>
    )
}