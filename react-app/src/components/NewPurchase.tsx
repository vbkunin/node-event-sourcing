import React, { useState } from 'react'
import { Autocomplete, Box, Button, Stack, TextField, Typography } from '@mui/material'
import User from '../models/User'
import { format } from 'date-fns'
import Client from '../api/Client'
import Purchase from '../models/Purchase'
import { SaveAlt } from '@mui/icons-material'

interface PurchaseFormData {
  title: string,
  amount: string,
  date: string
  debtors: User[]
}

interface NewPurchaseProps {
  currentUser: User
  users: User[]
}

export default function NewPurchase(props: NewPurchaseProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [purchaseFormData, setPurchaseFormData] = useState<PurchaseFormData>({
    title: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
    debtors: [props.currentUser],
  })

  const handleChange = (e: React.BaseSyntheticEvent) => {
    // console.log(e.target.name, e.target.value)
    setPurchaseFormData(prevState => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }

  const handleChangeDebtors = (e: React.BaseSyntheticEvent, debtors: User[]) => {
    // console.log(e)
    setPurchaseFormData(prevState => {
      return { ...prevState, debtors }
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const newPurchase: Purchase = {
      title: purchaseFormData.title.trim(),
      amount: Number(purchaseFormData.amount),
      date: purchaseFormData.date ? new Date(purchaseFormData.date) : new Date(),
      payer: props.currentUser,
    }

    Client.createPurchase(newPurchase, props.currentUser, purchaseFormData.debtors)
      .then(res => console.log('created', res))
      .then(res => setPurchaseFormData(prevState => {
          return {
            ...prevState,
            title: '',
            amount: '',
            date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
          }
        },
      ))
      .finally(() => setIsLoading(false))
  }

  return (<Box sx={{ mt: 2, mb: 2 }}>
    <Typography component='h2' variant='h5' sx={{ mb: 2 }}>
      New purchase
    </Typography>
    <Stack spacing={3} component='form' onSubmit={handleSubmit}>
      <TextField id='title' required label='Title' name='title' value={purchaseFormData.title}
                 onChange={handleChange}
                 disabled={isLoading} />
      <TextField id='amount' required label='Amount' name='amount' value={purchaseFormData.amount}
                 onChange={handleChange} disabled={isLoading}
                 inputProps={{ inputMode: 'numeric', pattern: '[^0][0-9]*' }} />
      <Autocomplete
        multiple
        id='debtors'
        options={props.users}
        getOptionLabel={(option: User) => option.username === props.currentUser.username ? 'me' : option.username}
        isOptionEqualToValue={(option: User, value: User) => option.id === value.id}
        defaultValue={[props.currentUser]}
        value={purchaseFormData.debtors}
        filterSelectedOptions
        autoHighlight
        disabled={isLoading}
        // ChipProps={}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Debtors'
            helperText='Who is this purchase for?'
            placeholder='Select debtors'
          />
        )}
        onChange={handleChangeDebtors}
      />
      <TextField id='date' label='Date' name='date' type='datetime-local' value={purchaseFormData.date}
                 onChange={handleChange} disabled={isLoading} />
      <Button type='submit' fullWidth variant='contained' size='large'
              startIcon={<SaveAlt />}
              disabled={isLoading}>
        Save
      </Button>
    </Stack>
  </Box>)
}