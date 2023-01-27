import React, { useState } from 'react'
import { Autocomplete, Box, Button, Stack, TextField, Typography } from '@mui/material'
import User from '../models/User'
import { format } from 'date-fns'

interface NewPurchaseFormData {
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

  const [purchase, setPurchase] = useState<NewPurchaseFormData>({
    title: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
    debtors: [props.currentUser],
  })

  const handleChange = (e: React.BaseSyntheticEvent) => {
    // console.log(e.target.name, e.target.value)
    setPurchase(prevState => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }

  const handleChangeDebtors = (e: React.BaseSyntheticEvent, debtors: User[]) => {
    // console.log(e)
    setPurchase(prevState => {
      return { ...prevState, debtors }
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const newPurchaseBody = {
      title: purchase.title.trim(),
      amount: Number(purchase.amount),
      date: purchase.date ? new Date(purchase.date) : new Date(),
      debtors: purchase.debtors,
    }
    console.log(newPurchaseBody)
    setIsLoading(false)
  }

  return (<Box sx={{ mt: 2, mb: 5 }}>
    <Typography component='h2' variant='h5' sx={{ mb: 2 }}>
      New purchase
    </Typography>
    <Stack spacing={3} component='form' onSubmit={handleSubmit}>
      <TextField id='title' label='Title' name='title' value={purchase.title} onChange={handleChange} />
      <TextField id='amount' required label='Amount' name='amount' value={purchase.amount} onChange={handleChange}
                 inputProps={{ inputMode: 'numeric', pattern: '[^0][0-9]*' }} />
      <Autocomplete
        multiple
        id='debtors'
        options={props.users}
        getOptionLabel={(option: User) => option.username === props.currentUser.username ? 'me' : option.username}
        isOptionEqualToValue={(option: User, value: User) => option.id === value.id}
        defaultValue={[props.currentUser]}
        value={purchase.debtors}
        filterSelectedOptions
        autoHighlight
        // getOptionDisabled={}
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
      <TextField id='date' label='Date' name='date' type='datetime-local' value={purchase.date}
                 onChange={handleChange} />
      <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        Create
      </Button>
    </Stack>
  </Box>)
}