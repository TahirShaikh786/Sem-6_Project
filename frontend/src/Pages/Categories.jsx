import React from 'react'
import { Helmet } from 'react-helmet'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import Videos from '../Components/Videos'

const Categories = () => {
  return (
    <>
        <Helmet>
            <title>Categories - Cine World</title>
        </Helmet>

        <Header />

        <Videos title={"Categories"} />

        <Footer />
    </>
  )
}

export default Categories