import React, {useRef} from 'react'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import {Zoom} from "./Zoom";

const Wrapper = styled(animated.div)`
  position: absolute;
  left: 5vw;
  top: 5vh;
  z-index: 2;
  min-height: 600px;
  width: 50px;
  background-color: white;

`

const Header = styled.div`
  background-color: #666666;
`

const T = styled.div`
  width: 32px;
  height: 32px;
  background-color: black;
`;

const List = styled.div`

`;

const ToolWrapper = styled(animated.div)`
  &:not(:first-child) {
    margin-top: 10px;
  }
`;

const Tool = ({children}) => {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
    const bind = useDrag(({ down, movement: [mx, my] }) => {
        set({ x: down ? mx : 0, y: down ? my : 0 })
    })

    return (
        <ToolWrapper {...bind()} style={{ x, y }}>
            {children}
        </ToolWrapper>
    )
};

export const Tools = () => {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }));
    const memoryTarget = useRef(false);
    const bind = useDrag(({ offset: [x, y], event,cancel, down }) => {
        const target = event.target;
        if (!memoryTarget.current) memoryTarget.current = target;
        if (memoryTarget.current && memoryTarget.current.closest('.ui-tools')) {
            cancel();
        }
        if (!down) {
            memoryTarget.current = false;
        }
        set({ x, y })
    });

    return (
        <Wrapper {...bind()} style={{ x, y }}>
            <Header>
                Alatke
            </Header>
            <List className={'ui-tools'}>
                <Tool>
                    <T/>
                </Tool>
                <Tool>
                    <T/>
                </Tool>
                <Tool>
                    <T/>
                </Tool>
                <Tool>
                    <T/>
                </Tool>

            </List>
           <Zoom/>

        </Wrapper>
    )
};