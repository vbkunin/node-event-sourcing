import React, { useState } from 'react'
import logo from './../logo.svg'
import { Avatar, Box, Typography, TextField, Button, Grid, Link } from '@mui/material'
import User from '../models/User'
import Client, { ClientError } from '../api/Client'

interface SignInProps {
  onSignedIn: (user: User) => void
}

function SignIn(props: SignInProps): React.ReactElement {

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const data = new FormData(event.currentTarget)
    const username = data.get('username') as string
    Client.authUser(username)
      .then(props.onSignedIn)
      .catch(err => {
        // todo: toast
        if (err instanceof ClientError) {
          console.log(err.error.message)
        } else {
          console.log('Something went wrong...')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography component='h1' variant='h3' fontWeight='bold'>
        Buns With Raisins
      </Typography>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 192, height: 192 }} src={logo} alt='BWR Logo' />
      <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Typography component='h2' variant='h5'>
          Sign in
        </Typography>
        <TextField margin='normal' required fullWidth id='username' label='Username' name='username'
                   autoComplete='username' autoFocus />
        <TextField margin='normal' required fullWidth name='password' label='Password' type='password' id='password'
                   autoComplete='current-password' />
        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href='#' variant='body2'>
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href='#' variant='body2'>
              {'Sign Up'}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default SignIn
