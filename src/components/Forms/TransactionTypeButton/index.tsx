import React from 'react'
import { TouchableOpacityProps } from 'react-native'

import { 
  Container,
  Icon,
  Title
} from './styles'

const icon = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
}

interface Props extends TouchableOpacityProps {
  title: string;
  type: 'up' | 'down';
  isActive: boolean;
}

export function TransactionTypeButton({ 
  title, 
  type,
  isActive,  
  ...rest
} : Props) {
  return (
    <Container type={type}{...rest} isActive={isActive}>
      <Icon name={icon[type]} type={type}/>
      <Title>{title}</Title>
    </Container>
  )
}