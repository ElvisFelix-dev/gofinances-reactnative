import React, { useState, useEffect } from 'react'
import { 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert
} from 'react-native'

import  AsyncStorage  from '@react-native-async-storage/async-storage'

import { useNavigation } from '@react-navigation/native'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import uuid from 'react-native-uuid'
import { useForm } from 'react-hook-form'


import { Button } from '../../components/Forms/Button'
import { InputForm } from '../../components/Forms/InputForm'
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton'
import {  CategorySelectButton } from '../../components/Forms/CategorySelectButton'

import { CategorySelect } from '../CategorySelect'
import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes
} from './styles'

interface FormData {
  name: string;
  amount: string
}

type NavigationProps = {
  navigate:(screen:string) => void;
}

const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('Nome é obrigatório'),
  amount: Yup
  .number()
  .typeError('Informe um valor númerico')
  .positive('O valor não pode ser negativo')
})

export function Register() {
  const [ transactionType, setTransactionType ] = useState('')
  const [ categoryModalOpen, setCategoryModalOpen] = useState(false)

  const dataKey = '@gofinances:transactions'

  const navigation = useNavigation<NavigationProps>()

  const [ category, setCategory ] = useState({
    key: 'category',
    name: 'Categoria',
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  async function handleRegister(form: FormData) {
    if(!transactionType)
      return Alert.alert('Selecione o tipo da transação')

    if(category.key === 'category')
      return Alert.alert('Selecione a categoria')

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
      date: new Date()
    }
    try {
      const dataKey = '@gofinances:transactions'

      const data = await AsyncStorage.getItem(dataKey)
      const currentData = data ? JSON.parse(data) : []

      const dataFormatted = {
        ...currentData,
        newTransaction
      }

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset()
      setTransactionType('')
      setCategory({
        key: 'category',
        name: 'Categoria'
      })

      navigation.navigate('Listagem')

    } catch (error) {
      console.log(error)
      Alert.alert("Não foi possível salvar")
    }
  }

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type)
  }

  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true)
  }
  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false)
  }

  /*useEffect(() => {
    async function loadData() {
      const data = await AsyncStorage.getItem(dataKey)
      console.log(JSON.parse(data!))
    }

    loadData()
    
    
    /*async function removeAll() {
      await AsyncStorage.removeItem(dataKey)
    }
    removeAll()*/
  //}, [])*/

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm 
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control} 
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionTypes>
              <TransactionTypeButton
                type="up" 
                title="Income" 
                onPress={() => handleTransactionTypeSelect('up')}
                isActive={transactionType === 'up'}
              />
              <TransactionTypeButton 
                type="down"
                title="Outcome" 
                onPress={() => handleTransactionTypeSelect('down')}
                isActive={transactionType === 'down'}
              />
            </TransactionTypes>

            <CategorySelectButton 
            title={category.name}
            onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button
            onPress={handleSubmit(handleRegister)} 
            title="Enviar" 
          />
        </Form> 

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal} 
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}