import React from 'react'
import { Avatar, IconButton, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import User from '../../models/User'
import { AttachMoney, PriceCheck, ReceiptLong } from '@mui/icons-material'
import { DebtActionEnum, DebtActionType } from './DebtActionType'
import { currencyFormatter } from '../../helpers/formatters'

interface DebtSummaryItemProps {
  debtUser: User
  remains: number
  actionType: DebtActionType
  debtIds: string[]
  handleAction: (userId: string, acton: DebtActionType, debtIds: string[]) => void
}

export default function DebtSummaryListItem(props: DebtSummaryItemProps): React.ReactElement {
  const actionTitle = props.actionType === DebtActionEnum.pay ? 'Pay' : 'Accept'
  const actionIcon = props.actionType === DebtActionEnum.pay ? <AttachMoney /> : <PriceCheck />
  const action = <IconButton title={actionTitle}
                             onClick={() => props.handleAction(props.debtUser.id, props.actionType, props.debtIds)}>{actionIcon}</IconButton>

  return (
    <ListItem secondaryAction={action}>
      <ListItemIcon>
        <Avatar><ReceiptLong /></Avatar>
      </ListItemIcon>
      <ListItemText primary={`${currencyFormatter().format(props.remains)} – ${props.debtUser.username}`}
                    secondary={`${props.debtIds.length} debt(s)`} />
    </ListItem>
  )
}