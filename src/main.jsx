import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Navbar from './Navbar/Navbar';
import Layout from './Layout/Layout';
import Home from './Layout/Home/Home';
import SinglePage from './Collection/SinglePage';
import CollectionPage from './Collection/CollectionPage';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import ContextProvider from './Provider/ContextProvider';
import UserProfile from './UserProfile/UserProfile';
import About from './About/About';
import ErrorPage from './ErrorPage/ErrorPage';
import Checkout from './Checkout/Checkout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateProfile from './UserProfile/UpdateProfile';
import Dashboard from './Dashboard/Dashboard';
import AddProducts from './Collection/AddProducts';
import UpdateProduct from './Collection/UpdateProduct';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import PaymentSuccess from './Payment/PaymentSuccess';
import PaymentFailed from './Payment/PaymentFailed';
import PaymentCancelled from './Payment/PaymentCancelled';
import NewArrivals from './Collection/FeaturedProducts';
import CategoryCollection from './Collection/CategoryCollection';
import AddCategory from './Collection/AddCategory';
import SingleCollection from './Collection/SingleCollection';
import ContactUs from './ContactUs/ContactUs';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home></Home>
      },

      {
        path: "/products/:id",
        element: <SinglePage></SinglePage>
      },
      {
        path: "/products",
        element: <CollectionPage></CollectionPage>
      },
      {
        path: "/new-arrivals",
        element: <NewArrivals></NewArrivals>
      },
      {
        path: "/categories",
        element: <CategoryCollection></CategoryCollection>
      },
      {
        path: "/category/:categoryId",
        element: <SingleCollection></SingleCollection>
      },

      {
        path: "/login",
        element: <Login></Login>
      },
      {
        path: "/signup",
        element: <SignUp></SignUp>
      },
      {
        path: "/user-profile",
        element: <UserProfile></UserProfile>
      },
      {
        path: "/about",
        element: <About></About>
      },
      {
        path: "/contact",
        element: <ContactUs></ContactUs>
      },
      {
        path: "/checkout",
        element: <Checkout></Checkout>
      },
      {
        path: "/update-profile",
        element: <UpdateProfile></UpdateProfile>
      }, {
        path: "/add-products",
        element: <AddProducts></AddProducts>
      }, {
        path: "/add-category",
        element: <AddCategory></AddCategory>
      }, {
        path: "update-products/:id",
        element: <UpdateProduct></UpdateProduct>
      }, {
        path: "/payment/success",
        element: <PaymentSuccess></PaymentSuccess>
      }, {
        path: "/payment/failed",
        element: <PaymentFailed></PaymentFailed>
      }, {
        path: "/payment/cancelled",
        element: <PaymentCancelled></PaymentCancelled>
      }

    ]
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    )
  }

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </ContextProvider>
  </StrictMode>,
)
