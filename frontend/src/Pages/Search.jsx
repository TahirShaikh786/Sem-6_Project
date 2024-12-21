import React from 'react'
import { Helmet } from 'react-helmet'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { Container, Row } from 'react-bootstrap'
import SearchModal from '../Components/SearchModal'

const Search = () => {
  return (
    <>
        <Helmet>
            <title>Search - Cine World</title>
        </Helmet>

        <Header />

        <section className='bg-black py-5'>
            <Container>
                <Row>
                    <h1 className='text-center text-white fst-italic'>Search - <span className='text-decoration-underline'>Movies</span></h1>
                </Row>
                <Row className='d-flex align-items-center jusitfy-content-center py-5'>
                    <SearchModal />
                </Row>
            </Container>
        </section>

        <Footer />
    </>
  )
}

export default Search