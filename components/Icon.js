import styled from "styled-components";

export const Icon = styled.div`
  position: relative;
  width: ${props => props.width || `32px`};
  height: ${props => props.height || `32px`};;
  background: url("${props => props.url}");
  background-repeat: no-repeat;
  background-size: cover;
`;
