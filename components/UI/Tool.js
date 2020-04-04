import React, {useRef} from 'react'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'


const Name = styled.div`
 
`

const Icon = styled.div`
  width: 32px;
  height: 32px;
  background: url("${props => props.url}");
`;


const Wrapper = styled(animated.div)`
    cursor: pointer;

  &:not(:first-child) {
    margin-top: 10px;
  }
`;

export const Tool = ({icon, name}) => {
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
    const bind = useDrag(({ down, movement: [mx, my] }) => {
        set({ x: down ? mx : 0, y: down ? my : 0 })
    })

    return (
        <Wrapper {...bind()} style={{ x, y }}>
            <Icon url={icon}/>
            <Name>
                {name}
            </Name>
        </Wrapper>
    )
};

