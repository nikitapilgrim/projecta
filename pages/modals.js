import React from 'react'
import styled,{css} from 'styled-components'
import {Modal} from "../components/UI/modals/Modal";

const Wrapper = styled.div`
   min-height: 100vh;
   display: flex;
   justify-content: center;
   align-items: center;
  
`;
const ModalsWrapper = styled.div`
min-height: 100vh;
height: 100%;
width: 100%;
top:0;
left: 0;
overflow-y: scroll;
& > div {
    position: relative;
    margin-top: 10vh;
    left: 50%;
    transform: translate(-50%, 0);
}
`

const CreateModal = (name) => {
    const typesModals = {
        text: ``
    }
    return Modal

};

export default () => {

    return (
        <Wrapper>
            <ModalsWrapper id={'modals'}>
                <Modal type={'text'} active={true}></Modal>
                <Modal type={'image'} active={true}></Modal>
                <Modal type={'audio'} active={true}></Modal>
                <Modal active={true}></Modal>
            </ModalsWrapper>
        </Wrapper>
    )
}
