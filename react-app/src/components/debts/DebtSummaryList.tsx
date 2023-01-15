import React from 'react'
import Debt from '../../models/Debt'
import { Box, List, Typography } from '@mui/material'
import User from '../../models/User'
import DebtSummaryListItem from './DebtSummaryListItem'
import { DebtActionEnum, DebtActionType } from './DebtActionType'
import { DebtUserRole, DebtUserRoleEnum } from './DebtUserRole'
import { currencyFormatter } from '../../helpers/formatters'

interface DebtSummaryListProps {
  title: string
  currentUser: User // todo: get from context
  currentUserRole: DebtUserRole
  debts: Debt[]
}

// todo: we need to return the summary from the api to avoid
//  calculating large lists of debts with paginated data.
export default function DebtSummaryList(props: DebtSummaryListProps): React.ReactElement {
  let totalRemains = 0
  const summary = props.debts
    .filter(debt => props.currentUser.id === debt[props.currentUserRole].id)
    .reduce<{ user: User, remains: number, debtIds: string[] }[]>(
      (summary, debt) => {
        if (!debt.remains || debt.accepted) return summary
        const debtUser = props.currentUserRole === DebtUserRoleEnum.creditor ? debt.debtor : debt.creditor
        const entry = summary.find(e => e.user.id === debtUser.id)
        if (!entry) {
          summary.push({ user: debtUser, remains: debt.remains, debtIds: [debt.id] })
        } else {
          entry.remains += debt.remains
          entry.debtIds.push(debt.id)
        }
        totalRemains += debt.remains
        return summary
      }, [])
  // console.log(summary)

  const actionHandler = (debtUserId: string, actionType: DebtActionType, debtIds: string[]) => {
    console.log('user', debtUserId, actionType, debtIds)
  }

  return (<Box sx={{ mt: 2, mb: 5 }} >
    <Typography component='h2' variant='h5'>
      {props.title} {currencyFormatter().format(totalRemains)}
    </Typography>
    <List>
      {
        summary.map(e =>
          <DebtSummaryListItem
            key={e.user.id}
            debtUser={e.user}
            remains={e.remains}
            debtIds={e.debtIds}
            actionType={props.currentUserRole === DebtUserRoleEnum.creditor ? DebtActionEnum.accept : DebtActionEnum.pay}
            handleAction={actionHandler} />,
        )
      }
    </List>
  </Box>)
}