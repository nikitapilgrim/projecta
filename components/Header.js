import React, {useRef} from 'react'
import styled from 'styled-components'
import {HomeSvg} from "./assets/HomeSvg";
import {SaveSvg} from "./assets/SaveSvg";
import {HelpSvg} from "./assets/HelpSvg";

const icons = {
    home: require('./assets/Icon_awesome-home.svg'),
    save: require('./assets/Icon_awesome-save.svg'),
    help: require('./assets/Icon_ionic-ios-help-buoy.svg'),
}

const Wrapper = styled.div`
padding: 0 24px;
display: flex;
align-items: center;
position:absolute;
top: 0;
height: 50px;
width: 100%;
box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16);
background-color: #ffffff;

`;

const Logo = styled.h1`
    margin-left: 52px;
    color: #666666;
    font-family: "Roboto Condensed";
    font-size: 23px;
    font-weight: 700;
`

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Button = styled.div`
   display:flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   &:not(:first-child) {
    margin-left: 11px;
   }
  
 
`;

const Help = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
  color: #666666;
font-family: "Roboto Condensed";
font-size: 16px;
font-weight: 700;
    position: relative;
    left: 2px;
    top: -1px;
  }
`

const Text = styled.div`
    color: #666666;
    font-family: "Roboto Condensed";
    font-size: 7px;
    font-weight: 400;

`



export const Header = () => {

    return (
        <Wrapper>
            <Buttons>
                <Button>
                    <HomeSvg/>
                    <Text>Glavna</Text>
                </Button>
                <Button>
                    <SaveSvg/>
                    <Text>Snimiti</Text>
                </Button>


            </Buttons>
            <Logo>Ime projekta</Logo>
            <Help>
                <HelpSvg/>
                <span>Pomoć</span>
            </Help>

        </Wrapper>
    )
};