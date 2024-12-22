import React from 'react'
import "../assets/CSS/pages.css"
import Helmet from "react-helmet"
import {useAuth} from "../Service/auth"
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import UserProfile from '../Components/UserProfile';
import { Col, Container, Row } from 'react-bootstrap';

const Profile = () => {
    const {user} = useAuth();
  return (
    <>
    <Helmet>
        <title>
            {user.userName} Profile - Cine World
        </title>
    </Helmet>

    <Header />

    <section className='bg-black'>
        <Container className='m-0 p-0'>
            <Row className='m-0 p-0 d-flex justify-content-center'>
                <Col md={4}>
                    <div className="profile">
                        <UserProfile />
                    </div>
                </Col>
            </Row>
        </Container>
    </section>

    <Footer />
    </>
  )
}

export default Profile