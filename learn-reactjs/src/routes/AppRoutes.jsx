import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import BikeStyle from '../pages/Bikestyle'
import Prioritize from '../pages/Prioritize'
import Criterion from '../pages/Criterion'
import Result from '../pages/Result'
import Info from '../pages/Info'
import Contact from '../pages/Contact'
import AdminBo from '../pages/AdminBo'
import AdminPage from '../pages/AdminPage'
import AdminUserPage from '../pages/AdminUserPage'
import AdminEdit from '../pages/AdminEdit'
import UserEdit from '../pages/UserEdit'
import BikeTypeEdit from '../pages/BikeTypeEdit'
import BikeTypeAdd from '../pages/BikeTypeAdd'
import BikeTypeModify from '../pages/BikeTypeModify'
import BikeList from '../pages/BikeList'
import BikeListAdd from '../pages/BikeListAdd'
import BikeListEdit from '../pages/BikeListEdit'
import BikeAll from '../pages/BikeAll'
import BikeCard from '../components/BikeCard'
import ProfileUser from '../pages/ProfileUser'
import Statistic from '../pages/Statistic'
import AdminMessage from '../pages/AdminMessage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Bikestyle" element={<BikeStyle />} />
        <Route path="/Prioritize" element={<Prioritize />} />
        <Route path="/Criterion" element={<Criterion />} />
        <Route path="/Result" element={<Result />} />
        <Route path="/Info" element={<Info />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/AdminBo" element={<AdminBo />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        <Route path="/AdminUserPage" element={<AdminUserPage />} />
        <Route path="/AdminEdit/:id" element={<AdminEdit />} />
        <Route path="/UserEdit/:id" element={<UserEdit />} />
        <Route path="/BikeTypeEdit/" element={<BikeTypeEdit />} />
        <Route path="/BikeTypeAdd" element={<BikeTypeAdd />} />
        <Route path="/BikeTypeModify/:id" element={<BikeTypeModify />} />
        <Route path="/BikeList" element={<BikeList />} />
        <Route path="/BikeListAdd" element={<BikeListAdd />} />
        <Route path="/BikeListEdit/:id" element={<BikeListEdit />} />
        <Route path="/BikeAll" element={<BikeAll />} />
        <Route path="/BikeCard" element={<BikeCard />} />
        <Route path="/ProfileUser" element={<ProfileUser />} />
        <Route path="/Statistic" element={<Statistic />} />
        <Route path="/AdminMessage" element={<AdminMessage />} />
      </Routes>
    </BrowserRouter>
  )
}

