import React from 'react'
import Debt from '../models/Debt'
import { Box, List, Typography } from '@mui/material'
import DebtListItem from './DebtListItem'

interface DebtListProps {
  title: string
  debts: Debt[]
}

export default function DebtList({ title, debts }: DebtListProps): React.ReactElement {

  const actionHandler = (id: string, actionType: 'pay' | 'accept') => {
    console.log('debt', id, actionType)
  }

  return (
    <Box>
      <Typography component='h2' variant='h5'>
        {title}
      </Typography>
      <List>
        {debts.map(debt => <DebtListItem key={debt.id}
                                         id={debt.id}
                                         date={new Date(debt.purchaseDate)}
                                         purchase={debt.purchaseTitle}
                                         accepted={debt.accepted}
                                         remains={debt.remains}
                                         amount={debt.amount}
                                         creditor={debt.creditor.username}
                                         debtor={debt.debtor.username}
                                         handleAction={actionHandler}></DebtListItem>)}
      </List>
    </Box>
  )
}