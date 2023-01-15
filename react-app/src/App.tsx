import React, { useState } from 'react'
import { Container, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import SingIn from './components/SingIn'
import User from './models/User'
import { USERS } from './data'
import Home from './components/Home'

const theme = createTheme()

function App() {

  const [user, setUser] = useState<User>()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    console.log({
      username: data.get('username'),
      password: data.get('password'),
    })

    setUser(USERS.find(user => user.username === data.get('username') as string))
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='sm'>
        <CssBaseline />
        {!user
          ? <SingIn handleSubmit={handleSubmit}></SingIn>
          : <>
            <Home user={user}></Home>
          </>
        }
      </Container>
    </ThemeProvider>
  )
}

export default App
