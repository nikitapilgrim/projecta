import React from 'react'
import styled from 'styled-components'
import {Tools} from "../components/UI/Tools";
import {Pages} from "../components/UI/Pages";
import {Canvas} from "../components/Canvas";
import {Header} from "../components/Header";

const Wrapper = styled.div`
   min-height: 100vh;
   display: flex;
   justify-content: center;
   align-items: center;
  
`;

export default () => {

    return (
        <Wrapper>
            <Header/>
            <Tools/>
            <Pages/>
            <Canvas/>
            <div id={'modals'}>

            </div>
        </Wrapper>
    )
}
