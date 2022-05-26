import { useState } from 'react';
import { Container } from 'react-bootstrap';
import './App.scss';
import Header from './component/Header';
import ModalAddNew from './component/ModalAddNew';
import TableUsers from './component/TableUsers';

function App() {

  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);

  const handleClose = () => {
    setIsShowModalAddNew(false);
  }
  return (
    <div className='app-container'>
          <Header/>
          <Container>
            <div className='my-3 add-new'>
             <span><b>List User: </b></span>
              <button className='btn btn-success' onClick={() => setIsShowModalAddNew(true)}
              >Add new user</button>
            </div>
            <TableUsers/>
          </Container>

          <ModalAddNew 
            show={isShowModalAddNew}
            handleClose={handleClose}
          />
    </div>
  );
}

export default App;
