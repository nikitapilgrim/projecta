import React, {useRef} from 'react'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import {Zoom} from "./Zoom";
import {Tool} from "./Tool";

const toolsIcons = {
    image: require("./assets/image-active.svg").default,
    sound: require("./assets/sound-active.svg").default,
    text: require("./assets/text-active.svg").default,
    video: require("./assets/video-active.svg").default,
    warning: require("./assets/warning-small.svg").default,
};

const Wrapper = styled(animated.div)`
  position: absolute;
  left: 5vw;
  top: 5vh;
  z-index: 2;
  width: 50px;
    height: 473px;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16);
    background-color: #ffffff;
  user-select: none;

`

const Header = styled.div`
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
                <Tool icon={toolsIcons.image} name={'Slika'}/>
                <Tool icon={toolsIcons.sound} name={'Zvuk'}/>
                <Tool icon={toolsIcons.video} name={'Video'}/>
                <Tool icon={toolsIcons.text} name={'Tekst'}/>

            </List>
           <Zoom/>

        </Wrapper>
    )
};