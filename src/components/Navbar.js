import React from "react";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavbarComponent() {

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
    }

    return (
        <Navbar expand="lg">
            <Navbar.Brand href="/home">Book Hotel</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    {localStorage.getItem('currentUser') ? (
                        <NavDropdown title={JSON.parse(localStorage.getItem('currentUser')).name} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                            <NavDropdown.Item href="#" onClick={logout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    ) : (
                        <>
                            <Nav.Link href="/register">Register</Nav.Link>
                            <Nav.Link href="/login">Login</Nav.Link>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavbarComponent;
