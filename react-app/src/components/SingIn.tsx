import React from 'react'
import logo from './../logo.svg'
import { Container, Avatar, Box, CssBaseline, Typography, TextField, Button, Grid, Link } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme()

interface SignInProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}


function SignIn(props: SignInProps): React.ReactElement {

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='sm'>
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Typography component='h1' variant='h3' fontWeight='bold'>
            Buns With Raisins
          </Typography>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 192, height: 192 }} src={logo} alt='BWR Logo' />
          <Box component='form' onSubmit={props.handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography component='h2' variant='h5'>
              Sign in
            </Typography>
            <TextField margin='normal' required fullWidth id='username' label='Username' name='username'
                       autoComplete='username' autoFocus />
            <TextField margin='normal' required fullWidth name='password' label='Password' type='password' id='password'
                       autoComplete='current-password' />
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
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
      </Container>
    </ThemeProvider>
  )
}

export default SignIn
