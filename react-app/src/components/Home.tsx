import React, { useContext, useEffect, useState } from 'react'
import { Avatar, Box, Skeleton, Typography } from '@mui/material'
import DebtSummaryList from './debts/DebtSummaryList'
import { DebtUserRoleEnum } from './debts/DebtUserRole'
import FaceIcon from '@mui/icons-material/Face'
import Debt from '../models/Debt'
import { UserContext } from '../context'
import Client, { ClientError } from '../api/Client'
import User from '../models/User'

export default function Home(): React.ReactElement {
  const user = useContext<User>(UserContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [debts, setDebts] = useState<Debt[]>([])
  const [credits, setCredits] = useState<Debt[]>([])

  useEffect(() => {
    Promise.all([
      Client.getUserCredits(user).then(setCredits),
      Client.getUserDebts(user).then(setDebts),
    ])
      .catch(err => {
        // todo: toast
        if (err instanceof ClientError) {
          console.log(err.error.message)
        } else {
          console.log('Something went wrong...')
        }
      })
      .finally(() => setIsLoading(false))
  }, [user])

  return (<>
    <Box sx={{ mt: 3, mb: 5, display: 'flex', alignItems: 'center' }}>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: '3em', height: '3em' }} alt='User avatar'>
        <FaceIcon fontSize='large' />
      </Avatar>
      <Typography component='h1' variant='h4'>
        Hola, {user.username}!
      </Typography>
    </Box>
    {isLoading ? (
      <Skeleton variant='rectangular' height='8em' sx={{ mt: 2, mb: 5 }} />
    ) : (
      <>
        <DebtSummaryList title='You are owed' currentUserRole={DebtUserRoleEnum.creditor}
                         currentUser={user} debts={credits} />
        <DebtSummaryList title='You owe' currentUserRole={DebtUserRoleEnum.debtor}
                         currentUser={user} debts={debts} />
      </>
    )
    }
  </>)
}