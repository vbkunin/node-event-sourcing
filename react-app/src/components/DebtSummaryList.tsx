import React from 'react'
import Debt from '../models/Debt'
import { Box, List, Typography } from '@mui/material'
import User from '../models/User'
import DebtSummaryListItem from './DebtSummaryListItem'
import { DebtActionEnum, DebtActionType } from './DebtActionType'
import { DebtUserRole, DebtUserRoleEnum } from './DebtUserRole'

interface DebtSummaryListProps {
  title: string
  currentUser: User // todo: get from context
  currentUserRole: DebtUserRole
  debts: Debt[]
}

// todo: we need to return the summary from the api to avoid
//  calculating large lists of debts with paginated data.
export default function DebtSummaryList({
                                          title,
                                          currentUser,
                                          currentUserRole,
                                          debts,
                                        }: DebtSummaryListProps): React.ReactElement {
  const summary = debts
    .filter(debt => currentUser.id === debt[currentUserRole].id)
    .reduce<{ user: User, remains: number, debtIds: string[] }[]>(
      (summary, debt) => {
        if (!debt.remains || debt.accepted) return summary
        const debtUser = currentUserRole === DebtUserRoleEnum.creditor ? debt.debtor : debt.creditor
        const entry = summary.find(e => e.user.id === debtUser.id)
        if (!entry) {
          summary.push({ user: debtUser, remains: debt.remains, debtIds: [debt.id] })
        } else {
          entry.remains += debt.remains
          entry.debtIds.push(debt.id)
        }
        return summary
      }, [])
  console.log(summary)

  const actionHandler = (debtUserId: string, actionType: DebtActionType, debtIds: string[]) => {
    console.log('user', debtUserId, actionType, debtIds)
  }

  return (<Box>
    <Typography component='h2' variant='h5'>
      {title}
    </Typography>
    <List>
      {
        summary.map(e =>
          <DebtSummaryListItem
            key={e.user.id}
            debtUser={e.user}
            remains={e.remains}
            debtIds={e.debtIds}
            actionType={currentUserRole === DebtUserRoleEnum.creditor ? DebtActionEnum.accept : DebtActionEnum.pay}
            handleAction={actionHandler} />,
        )
      }
    </List>
  </Box>)
}