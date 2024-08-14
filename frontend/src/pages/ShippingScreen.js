import React, { useContext, useEffect, useState } from 'react';
//import { Helmet } from 'react-helmet-async';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAddress from '../hooks/useAddress';
import CheckoutSteps from '../components/CheckoutSteps';
import useCartContext from '../hooks/useCartContext';
import LoadingBox from '../components/LoadingBox';

//import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = ({ history }) => {
    const navigate = useNavigate();
    //const shippingAddress = {}
    const { setAddress, updateAddress, createAddress } = useAddress()
    const { shippingAddress } = useCartContext()


    /*const { 
        fullBox,
        userInfo,
        cart: { shippingAddress },
    } = state;*/


    const [mailingInfo, setMailingInfo] = useState({
        fullName: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    })

    //prevents form from being blank on refresh 
    useEffect(() => {
        if (!shippingAddress) {

            setAddress()

        } else {
            setMailingInfo({
                fullName: shippingAddress.fullName || '',
                address: shippingAddress.address || '',
                city: shippingAddress.city || '',
                state: shippingAddress.state || '',
                postalCode: shippingAddress.postalCode || '',
                country: shippingAddress.country || ''
            });
        }

    }, [shippingAddress])

    /*const [mailingInfo, setMailingInfo] = useState({
        fullName: shippingAddress.fullName || '',
        address: shippingAddress.address || '',
        city: shippingAddress.city || '',
        postalCode: shippingAddress.postalCode || '',
        country: shippingAddress.country || ''
    })*/

    const submitHandler = (e) => {
        e.preventDefault();

        ((Object.keys(shippingAddress).length === 0) ?
            createAddress({ ...mailingInfo }) : updateAddress({ ...mailingInfo }));
        navigate("/payment")


    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMailingInfo(prevValue => {
            return ({ ...prevValue, [name]: value })
        })
    }

    /*useEffect(() => {
        ctxDispatch({ type: 'SET_FULLBOX_OFF' });
    }, [ctxDispatch, fullBox]);*/

    return (
        <div>
            <div className="container small-container">
                <h1 className="my-3">Shipping </h1>
                <CheckoutSteps step1 step2></CheckoutSteps>


                {//!(Object.keys(shippingAddress).length === 0) 
                    shippingAddress ?

                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-3" controlId="fullName">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    name="fullName"
                                    value={mailingInfo.fullName}
                                    placeholder="Enter full name"
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="address">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    placeholder="Enter address"
                                    name="address"
                                    value={mailingInfo.address}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="city">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    placeholder="Enter city"
                                    name="city"
                                    value={mailingInfo.city}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="state">
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                    placeholder="Enter state"
                                    name="state"
                                    value={mailingInfo.state}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="postalCode">
                                <Form.Label>Postal Code</Form.Label>
                                <Form.Control
                                    placeholder="Enter postal code"
                                    name="postalCode"
                                    value={mailingInfo.postalCode}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="country">
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                    placeholder="Enter country"
                                    name="country"
                                    value={mailingInfo.country}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>


                            <div className="mb-3">
                                <Button variant="primary" type="submit">
                                    Continue
                                </Button>
                            </div>
                        </Form> : <LoadingBox />}
            </div>
        </div>
    );
}
export default ShippingScreen