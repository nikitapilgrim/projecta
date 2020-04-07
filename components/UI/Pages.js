import React, {useRef,useState} from 'react'
import styled from 'styled-components'
import {useSpring, useSprings, animated} from 'react-spring'
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

import {useDrag} from 'react-use-gesture'

const arrayMove = require('array-move');
import {Icon} from "../Icon";
import {Switcher} from "./Switcher";
import {PlusSvg} from "../assets/PlusSvg";
import {FileImportSvg} from "../assets/FileImport";
import deleteSvg from "../assets/Icon_awesome-file-import.svg";
import fileImportSvg from "../assets/Icon_material-delete-forever.svg";
import arrowSvg from "./assets/Icon_material-play-arrow.svg";


const Wrapper = styled(animated.div)`
  position: absolute;
  right: 5vw;
  top: 10vh;
  z-index: 2;
  min-height: 400px;
  width: 105px;
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

const Top = styled.div`
   padding: 16px;
`

const SwitcherWrapper = styled.div`
  padding: 0 10px;

`;

// fake data generator
const getItems = count =>
    Array.from({length: count}, (v, k) => k).map(k => ({
        active: true,
        id: `Stranica-${k + 1}`,
        content: `Stranica-${k + 1}`,
        vertical: k % 4 === 0
    }));

const grid = 12;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",


    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    padding: grid,
    width: "100%"
});



export const Pages = () => {
    const [{x, y}, set] = useSpring(() => ({x: 0, y: 0}));
    const memoryCancel = useRef(false);
    const bind = useDrag(({offset: [x, y], event, cancel, down}) => {
        const target = event.target;
        if (!memoryCancel.current && target && target.closest && target.closest('.ui-pages')) {
            memoryCancel.current = true;
            cancel();
        }
        if (!down) {
            memoryCancel.current = false;
        }
        if (!memoryCancel.current) set({x, y})
    });

    return (
        <Wrapper {...bind()} style={{x, y}}>
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

            <DraggableList items={[1, 2, 3, 4, 5, 6]}/>

        </Wrapper>
    )
};

function DraggableList({items}) {
    const [elems, setElems] = useState(getItems(4));

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const items = arrayMove(elems,
            result.source.index,
            result.destination.index)

        setElems(items);
        
    }

    return (
        <div className="ui-pages">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            {elems.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <Page data={item} provided={provided} snapshot={snapshot}/>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}


const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.active ? `#e6eaff` : ``};

  &:not(:first-child) {
    margin-top: 10px;
  }
`;

const PageHoriz = styled.div`
    width: 81px;
    height: 53px;
    background-color: #cccccc;
`

const PageVert = styled.div`
width: 53px;
height: 81px;
background-color: #cccccc;
`

const PageControlls = styled.div`
  display: flex;
  align-items: center;
  

`

const TopBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 2px
 
`
const ArrowTop = styled(Icon)`
  transform: rotate(90deg);
`
const ArrowBottom = styled(Icon)`
  transform: rotate(-90deg);

`
const PageName = styled.div`
color: #666666;
font-family: "Roboto Condensed";
font-size: 10px;
font-weight: 400;
`

const PageBottom = styled.div`
    width: 110%;
    display: flex;
    justify-content: space-between;
    
    
`;


const Page = ({data, provided, snapshot}) => {
    const {content, vertical} = data;

    return (
        <PageWrapper

            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
            )}
        >
            {vertical ? <PageVert/> : <PageHoriz/>}
            <PageBottom>
                <PageName>{content}</PageName>
                <PageControlls>
                    <Icon width={'9px'} height={'10px'} url={fileImportSvg}/>
                    <TopBottom>
                        <ArrowTop width={'4px'} height={'5px'} url={arrowSvg}/>
                        <ArrowBottom width={'4px'} height={'5px'} url={arrowSvg}/>
                    </TopBottom>
                    <Icon width={'9px'} height={'10px'} url={deleteSvg}/>
                </PageControlls>
            </PageBottom>
        </PageWrapper>
    )
}