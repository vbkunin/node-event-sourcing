import React, { useContext, useEffect, useState } from 'react'
import { Avatar, Box, Skeleton, Typography } from '@mui/material'
import DebtSummaryList from './debts/DebtSummaryList'
import { DebtUserRoleEnum } from './debts/DebtUserRole'
import FaceIcon from '@mui/icons-material/Face'
import Debt from '../models/Debt'
import { UserContext } from '../context'

export default function Home(): React.ReactElement {
  const user = useContext(UserContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [debts, setDebts] = useState<Debt[]>([])
  const [credits, setCredits] = useState<Debt[]>([])

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.REACT_APP_QUERY_API_URL}/v1/debt?accept=false&creditor-id=${user.id}`)
        .then(res => res.json())
        .then(json => setCredits(json.entries)),
      fetch(`${process.env.REACT_APP_QUERY_API_URL}/v1/debt?accept=false&debtor-id=${user.id}`)
        .then(res => res.json())
        .then(json => setDebts(json.entries)),
    ]).then(() => setIsLoading(false))

  }, [user.id])

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
      <Skeleton variant='rectangular' height='8em' sx={{ mt: 2, mb: 5}} />
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