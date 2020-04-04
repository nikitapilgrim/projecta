import React, {useRef} from 'react'
import styled from 'styled-components'
import arrow from './assets/Icon_material-play-arrow.svg'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

`

const Arrow = styled.div`
   width: 12px;
   height: 15px;
   transform: ${props => props.right ? `scale(-1, -1) ` : ``};
   background: url(${arrow});
`;

const Input = styled.input`
border: 1px solid #e6eaff;
background-color: #f2f2f2;
padding: 4px;
flex-shrink: 1;
max-width: 26px;
color: #666666;
font-family: "Roboto Condensed";
font-size: 12px;
font-weight: 700;
margin: 0 2px
`

export const Switcher = () => {
    return (
        <Wrapper>
            <Arrow/>
            <Input/>
            /
            <Input/>
            <Arrow right={true}/>

        </Wrapper>
    )
}