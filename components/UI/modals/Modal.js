import React, {useRef, useMemo, useState, useEffect} from 'react'
import usePortal from 'react-useportal'
import useSSR from 'use-ssr'
import styled from 'styled-components'
import {CloseIcon} from "../assets/Close";
import audioimg from "../assets/Bild_3.png";


const Positon = styled.div`
  position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const Wrapper = styled.div`
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16);
    border-radius: 5px;
    background-color: #ffffff;
    width: 322px;
`;
const Header = styled.div`
    display: flex;
    align-items: center;
    justify-items: flex-start;
    padding: 7px 9px;
    color: #666666;
    font-family: Roboto;
    font-size: 14px;
    font-weight: 900;
    span {
      margin-left: 8px;
    }
`

const ButtonsContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;
width: 100%;
padding-bottom: 15px;
padding-top: 18px;
  font-family: "Roboto Condensed";
font-size: 13px;
font-weight: 400;
`

const Ok = styled.button`
display: inline-block;
background: none;
border: none;
padding: 4px 8px;
background-color: #74a27b;
color: white;

`;

const Cancel = styled.button`
display: inline-block;
background: none;
border: none;
padding: 4px 8px;

background-color: #980000;
margin-left: 3px;
color: white;

`

const ModalBody = styled.div`
  position: relative;
  img {
    margin: 0 auto;
    max-width: 100%;
  }
`

const TextArea = styled.textarea`
width: 100%;
padding: 24px;
border: none;
`

export const ModalAsPortal = ({active}) => {
    const {isServer} = useSSR();
    if (isServer) return <></>
    const {Portal} = usePortal({
        bindTo: document && document.getElementById('modals')
    });


    return (
        <Portal>
            {active && <Positon>
                <Modal/>
            </Positon>}
        </Portal>)
};

const TextInner = () => {

    return (
        <>
            <ModalBody>
                <TextArea value={`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
                    et ea rebum. Stet clita kasd gubergren, no `}></TextArea>
            </ModalBody>
            <ButtonsContainer>
                <Ok>Ok</Ok>
                <Cancel>Izbrisati</Cancel>
            </ButtonsContainer>
        </>
    )
};
const AudioInner = () => {

    return (
        <>
            <ModalBody>
                <img src={audioimg} alt="img"/>
            </ModalBody>
            <ButtonsContainer>
                <Ok>Importirati audio</Ok>
                <Cancel>Izbrisati</Cancel>
            </ButtonsContainer>
        </>
    )
};

const P = styled.p`
color: #000000;
font-family: Arial;
font-size: 13px;
font-weight: 400;
  padding: 24px;
`

const ImageInner = () => {
    const url = `https://loremflickr.com/${322}/${180}/people/all`;

    return (
        <>
            <ModalBody>
                <img src={url} alt="img"/>
                <P>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
                    et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
                    et ea rebum. Stet clita kasd gubergren, no sea
                </P>
            </ModalBody>
            <ButtonsContainer>
                <Ok>Importirati sliku</Ok>
                <Cancel>Izbrisati</Cancel>
            </ButtonsContainer>
        </>
    )
};


export const Modal = ({name, active, type}) => {


    return (
        <Wrapper>
            <Header>
                <CloseIcon/>
                <span>Naslov</span>
            </Header>
            {type === 'text' && <TextInner/>}
            {type === 'image' && <ImageInner/>}
            {type === 'audio' && <AudioInner/>}


        </Wrapper>
    )
}