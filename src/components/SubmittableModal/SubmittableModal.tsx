import React, { FunctionComponent, useState } from "react";
import { Alert, Button, Modal, Row, Spinner } from "react-bootstrap";
import "./SubmittableModal.css"

export interface ISubmittableModalProps {
    modalTitle: string,
    show: boolean,
    variant?: "primary" | "danger",
    closeOnClickOutside?: boolean,
    handleClose: () => void,
    submit: () => Promise<any>
}

export const SubmittableModal: FunctionComponent<ISubmittableModalProps> = props => {

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const submit = async () => {
        try {
            setSubmitting(true);
            await props.submit();
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else if (typeof (e) === "string") {
                setError(e);
            } else {
                setError("Something went wrong while submitting.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal show={props.show} onHide={props.handleClose} backdrop={props.closeOnClickOutside ? undefined : "static"}>
            <Modal.Header closeButton>
                <Modal.Title>{props.modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                <Row>
                    <Button className="mr-2" variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button variant={props.variant} onClick={submit}>
                        {submitting && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{"Save Note"}
                    </Button>
                </Row>
                {error &&
                    <Row className="modal-error">
                        <Alert variant="danger" onClose={() => setError("")} dismissible>
                            <Alert.Heading>Error Submitting!</Alert.Heading>
                            <p>{error}</p>
                        </Alert>
                    </Row>}
            </Modal.Footer>
        </Modal >);
}