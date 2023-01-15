import React from 'react'
import { Avatar, Box, Typography } from '@mui/material'
import { DEBTS } from '../data'
import DebtSummaryList from './debts/DebtSummaryList'
import { DebtUserRoleEnum } from './debts/DebtUserRole'
import User from '../models/User'
import FaceIcon from '@mui/icons-material/Face'

interface HomeProps {
  user: User
}

export default function Home({ user }: HomeProps): React.ReactElement {
  return (<>
    <Box sx={{ mt: 3, mb: 5,  display: 'flex', alignItems: 'center' }}>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: '3em', height: '3em' }} alt='User avatar'>
        <FaceIcon fontSize='large' />
      </Avatar>
      <Typography component='h1' variant='h4'>
        Hola, {user.username}!
      </Typography>
    </Box>
    <Box sx={{ mt: 2, mb: 5 }}>
      <DebtSummaryList title='You are owed'
                       currentUserRole={DebtUserRoleEnum.creditor}
                       currentUser={user}
                       debts={DEBTS} />
    </Box>
    <Box sx={{ mt: 2, mb: 5 }}>
      <DebtSummaryList title='You owe'
                       currentUserRole={DebtUserRoleEnum.debtor}
                       currentUser={user}
                       debts={DEBTS} />
    </Box>
  </>)
}