import React, { useState, useEffect, useCallback } from 'react'

import { useFocusEffect } from '@react-navigation/native';

import  AsyncStorage  from '@react-native-async-storage/async-storage'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'


import { 
  Container,
  Header, 
  UserInfo,
  Photo,
  User,
  UserGreenting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton
} from './styles'

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const [data, setData] = useState<DataListProps[]>([]) 

  async function loadTransactions(){
    const dataKey = '@gofinances:transactions'
    const response = await AsyncStorage.getItem(dataKey)

    const transactions = response ? JSON.parse(response) : []

    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps )=> {
      const amount = Number(item.amount)
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })

      const date =Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date))

      return {
        id: item.id,
        title: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      }
    })

    setData(transactionsFormatted)
  }

  useEffect(() => {
    loadTransactions()
  },[])

  /*useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, []),
  );*/
 
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/51929648?v=4'}} />

            <User>
              <UserGreenting>Olá,</UserGreenting>
              <UserName>Elvis Felix</UserName>
            </User>

          </UserInfo>

          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard 
          type="up"
          title="Entradas" 
          amount="R$17.400,00" 
          lastTransaction="Última entrada dia 11 de agosto" 
        />
        <HighlightCard 
          type="down"
          title="Saídas" 
          amount="R$1.259,00" 
          lastTransaction="Última saida dia 03 de agosto" 
        />
        <HighlightCard 
          type="total"
          title="Total" 
          amount="R$16.141,00" 
          lastTransaction="01 à 16 de agosto" 
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => 
            <TransactionCard  data={item}/>
          }
         
        />
      </Transactions>
    </Container>
  )
}