import React, { useState } from 'react'
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
  handleAction: (user: User, acton: DebtActionType, debtIds: string[], onSuccess: () => void) => void
}

export default function DebtSummaryListItem(props: DebtSummaryItemProps): React.ReactElement {
  const [disabled, setDisabled] = useState(false)

  const actionTitle = props.actionType === DebtActionEnum.pay ? 'Pay off' : 'Accept'
  const actionIcon = props.actionType === DebtActionEnum.pay ? <AttachMoney /> : <PriceCheck />
  const clickHandler = () => props.handleAction(props.debtUser, props.actionType, props.debtIds, () => setDisabled(true))
  const action = <IconButton title={actionTitle} disabled={disabled}
                             onClick={clickHandler}>{actionIcon}</IconButton>

  return (
    <ListItem secondaryAction={action} disabled={disabled}>
      <ListItemIcon>
        <Avatar><ReceiptLong /></Avatar>
      </ListItemIcon>
      <ListItemText primary={`${currencyFormatter().format(props.remains)} – ${props.debtUser.username}`}
                    secondary={`${props.debtIds.length} debt(s)`} />
    </ListItem>
  )
}