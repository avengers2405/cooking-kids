import React from 'react'
import {Routes, Route} from 'react-router-dom' 
import home from './pages/home'
import deleteUser from './pages/deleteUser'
import updateUser from './pages/updateUser'
import showUser from './pages/showUsers'
import createUser from './pages/addRecord'


const App = () => {
  return (
    //returns different different routes for each request
    <Routes>
      <Route path='/' element={<home />} />
      <Route path='/user/add' element={<deleteUser />} />
      <Route path='' element={} />
      <Route path='' element={} />
      <Route path='' element={} />
    </Routes>
  )
}

export default App