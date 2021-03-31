import React from "react";
import { Row, Col, Container } from "react-bootstrap";

const Page404 = () => {
    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md="8">
                    <div className="card">
                        <div className="card-header">Page not found 404</div>

                        <div className="card-body">
                            <p>Sorry page not found...</p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Page404;
