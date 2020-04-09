import React, {useRef, useMemo, useState, useCallback, useImperativeHandle, forwardRef, useEffect} from 'react'
import usePortal from 'react-useportal'
import useSSR from 'use-ssr'
import styled, {css} from 'styled-components'
import {useDropzone} from 'react-dropzone'
import {CloseIcon} from "../assets/Close";
import dynamic from 'next/dynamic'
import ReactPlayer from 'react-player'

const AudioWave = dynamic(() => import('../../AudioWave.js'), {
    ssr: false
});

import audioimg from "../assets/Bild_3.png";


const Positon = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999;
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

const Import = styled.input`
display: inline-block;
background: none;
border: none;
padding: 4px 8px;
background-color: #74a27b;
color: white;

`;
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

const DropZoneContainer = styled.div`
  min-height: 180px;
  border: 2px dashed #BBB;
  margin: 30px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${props => (props.isDragActive) && css`
    border-color: green;
  `}
`
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
    const [audio, setAudio] = useState(null);
    const drop = useRef(null);

    const handleChange = (event) => {
        if (drop) {
            drop.current.open();
        }
    };

    const handleUpload = (link) => {
        setAudio(link)
    };


    return (
        <>
            <ModalBody>
                {!audio ? <MyDropzone ref={drop} onChange={handleUpload}/> : <img src={audioimg} alt="img"/>}
            </ModalBody>
            <ButtonsContainer>
                <Ok onClick={handleChange}>Importirati audio</Ok>
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
    const [img, setImg] = useState(null);
    const drop = useRef(null);
    const memo = useRef(null);

    const handleUpload = (link) => {
        setImg(link)
    };
    const handleChange = (event) => {
        if (!memo.current) memo.current = drop.current;
        drop.current = memo.current;
        if (drop) {
            drop.current.open();
        }
    }

    return (
        <>
            <ModalBody>

                {!img ? <MyDropzone ref={drop} onChange={handleUpload}/> : <img src={img} alt="img"/>}
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
                <Ok onClick={handleChange}>Importirati sliku</Ok>
                <Cancel>Izbrisati</Cancel>
            </ButtonsContainer>
        </>
    )
};

const VideoContainer = styled.div`;
   width: 100%;
  video {
    width: 100%;
  }
`
const VideoInner = () => {
    const [video, setVideo] = useState(null);
    const drop = useRef(null);
    const memo = useRef(null);

    const handleUpload = (link) => {
        setVideo(link)
    };
    const handleChange = (event) => {
        if (!memo.current) memo.current = drop.current;
        drop.current = memo.current;
        if (drop) {
            drop.current.open();
        }
    }

    return (
        <>
            <ModalBody>

                {!video ? <MyDropzone ref={drop} onChange={handleUpload}/> : <VideoContainer>
                    <video controls={true} src={video}></video>
                </VideoContainer>}
            </ModalBody>
            <ButtonsContainer>
                <Ok onClick={handleChange}>Importirati video</Ok>
                <Cancel>Izbrisati</Cancel>
            </ButtonsContainer>
        </>
    )
};


const MyDropzone = forwardRef(({onChange}, ref) => {

    const onDrop = useCallback(acceptedFiles => {
        let file = acceptedFiles[0];
        let blobURL = URL.createObjectURL(file);
        onChange(blobURL)
    }, []);

    const {getRootProps, getInputProps, isDragActive, isDragReject, open} = useDropzone({onDrop});
    useImperativeHandle(ref, () => ({
        open: open
    }));

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <DropZoneContainer isDragActive={isDragActive} isDragReject={isDragReject}>
                Drop files here
            </DropZoneContainer>
        </div>
    )
})


export const Modal = ({name, active, type, closeModal}) => {


    return (
        <Wrapper>
            <Header>
                <CloseIcon onClick={closeModal}/>
                <span>Naslov</span>
            </Header>
            {type === 'text' && <TextInner/>}
            {type === 'image' && <ImageInner/>}
            {type === 'sound' && <AudioInner/>}
            {type === 'video' && <VideoInner/>}


        </Wrapper>
    )
}


export const ModalAsPortal = ({active, type, closeModal}) => {
    const {Portal} = usePortal();

    return (
        <Portal>
            {active && <Positon>
                <Modal closeModal={closeModal} type={type}/>
            </Positon>}
        </Portal>)
};
