import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { putUpdateUser } from "../services/UserServices";


const ModalEditUser = (props) => {
    const { show, handleClose, dataUserEdit, handleEditUserFromModal } = props;
    const [name, setName] = useState("");
     const [job, setJob] = useState("");

     const handleEditUser = async () => {
       let res = await putUpdateUser(name, job);
       if(res && res.updatedAt) { // res.update mình check nếu có thì thành công, chạy vô cái if này
            //success
               console.log("check:", res)
            handleEditUserFromModal({
                first_name: name,
                id: dataUserEdit.id
            })
            handleClose();
            toast.success("Update user success")
       }
     }

     useEffect(() => {
        if(show) {
            setName(dataUserEdit.first_name)
        }

     }, [dataUserEdit]);
    
    return (
        <>
        <Modal   
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <div className="body-add-new">
                        <div className="mb-3">
                            <label className="form-lable">Name</label>
                            <input type="text" className="form-control"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Job</label>
                            <input type="text" className="form-control"
                                value={job}
                                onChange={(event) => setJob(event.target.value)}
                            />
                        </div>
                    </div>
                </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={() => handleEditUser()}>
               Confirm
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default ModalEditUser;

