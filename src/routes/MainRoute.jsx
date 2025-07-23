import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import UnauthWrapper from './UnauthWrapper'
import SearchBar from '../components/Searchbar'
import PaymentPage from '../page/order/PaymentPage'
import About from '../page/others/About'
import Studio from '../page/others/Studio'

const Home = lazy(() => import('../page/Home/Home')) 
const ProductList = lazy(() => import('../page/product/ProductList')) 
const Login = lazy(() => import('../page/AuthWork/Login')) 
const Register = lazy(() => import('../page/AuthWork/Register')) 
//const CreateProduct = lazy(() => import('../page/admin/CreateProduct')) 
const ProductDetail = lazy(() => import('../page/product/ProductDetail')) 
const EditProduct = lazy(() => import('../page/admin/EditProduct')) 
const UserProfile = lazy(() => import('../page/Users/UserProfile')) 
const UserInfo = lazy(() => import('../page/Users/UserInfo'))
const PageNotFound = lazy(() => import('../components/PageNotFound')) 
const AuthWrapper = lazy(() => import('./AuthWrapper'))
const Contact = lazy(() => import('../page/others/Contact'))
const AdminAuth = lazy(() => import('./AdminAuth'))
const Cart = lazy(() => import('../page/order/Cart')) ;
const Admin = lazy(() => import('../page/admin/Admin'))
const Order = lazy(() => import('../page/order/Order'))
const OrderDetail = lazy(() => import('../page/order/OrderDetail'))
const AdminDashboard = lazy(() => import('../page/admin/AdminDashboard'))


const MainRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/product' element={<ProductList/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/create-Product' element={<AdminAuth><Admin/></AdminAuth>}/>
        <Route path='/user' element={<UserProfile/>}/> 
        <Route path='/user/user-info' element={<UserInfo/>}/>
        <Route path='/contact' element={<Contact />}/>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path='/product/edit/:id' element={<AdminAuth><EditProduct /></AdminAuth>}/>
        <Route path='/user/user-profile' element={<AuthWrapper><UserProfile/></AuthWrapper>}/>
        <Route path='/user/user-info' element={<AuthWrapper><UserInfo/></AuthWrapper>}/>
        <Route path='/cart' element={<UnauthWrapper><Cart/></UnauthWrapper>}/>
        <Route path='*' element={<PageNotFound/>}/>
        <Route path='/search' element={<SearchBar/>}/>
        <Route path='/payment' element={<PaymentPage/>}/>
        <Route path='/order' element={<UnauthWrapper><Order /></UnauthWrapper>}/>
        <Route path="/order/:id" element={<OrderDetail />} />
        <Route path="/admin" element={<AdminAuth><AdminDashboard /></AdminAuth>} />
        <Route path='/about' element={<About/>}/>
        <Route path='/studio' element={<Studio/>}/>
    </Routes>
  )
}

export default MainRoutes