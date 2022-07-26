import styled from 'styled-components'

export const LayoutContainer = styled.div `
  max-width: 74rem;
  height: 50rem;
  margin: 5rem auto;
  padding: 2.5rem;
  background: ${props => props.theme['gray-800']};
  display: flex;
  flex-direction: column;
`