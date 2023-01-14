import React from 'react'
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { AttachMoney, Done, DoneAll, HourglassBottom, PriceCheck } from '@mui/icons-material'

interface DebtListItemProps {
  id: string
  purchase: string
  date: Date
  amount: number
  remains: number
  accepted: boolean
  creditor?: string
  debtor?: string
  handleAction: (debtId: string, actionType: 'pay'|'accept') => void
}

export default function DebtListItem(props: DebtListItemProps): React.ReactElement {

  const action = props.accepted
    ? null
    : props.remains === 0
      ? <IconButton title='Accept' onClick={() => props.handleAction(props.id, 'accept')}><PriceCheck /></IconButton>
      : <IconButton title='Pay' onClick={() => props.handleAction(props.id, 'pay')}><AttachMoney /></IconButton>

  const icon = props.accepted
    ? <DoneAll color='success' />
    : props.remains === 0
      ? <Done color='warning' />
      : <HourglassBottom color='primary' />

  const primaryText = `${props.amount} – ${props.purchase}`
  let secondaryText = `${props.date.toLocaleDateString()} ${props.date.toLocaleTimeString()}`
  // if (props.creditor && props.debtor) {
  //   secondaryText += ` ${props.debtor} owes ${props.creditor}`
  // }

  return (
    <ListItem secondaryAction={action}>
      <ListItemIcon>
        <Avatar>{icon}</Avatar>
      </ListItemIcon>
      <ListItemText primary={primaryText}
                    secondary={secondaryText} />
    </ListItem>
  )
}