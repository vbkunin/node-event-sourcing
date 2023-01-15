import React, { useState } from 'react'
import { Container, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import SingIn from './components/SingIn'
import User from './models/User'
import Home from './components/Home'
import { UserContext } from './context'

const theme = createTheme()

function App() {

  const [user, setUser] = useState<User>({ id: '', username: '' })

  const handleSingIn = (user: User): void => {
    setUser(user)
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='sm'>
        <CssBaseline />
        <UserContext.Provider value={user}>
          {!user.id
            ? <SingIn onSignedIn={handleSingIn}></SingIn>
            : <Home/>
          }
        </UserContext.Provider>
      </Container>
    </ThemeProvider>
  )
}

export default App
