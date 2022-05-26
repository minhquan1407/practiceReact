import axios from "axios";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { fetchAllUser } from "../services/UserServices";
import ReactPaginate from 'react-paginate';


const TableUsers = (props) => {

    const [listUsers, setListUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {  
        
            //call apis
           getUsers(1); 
    }, [])

    const getUsers = async (page) => {
        let res = await fetchAllUser(page);//page ở đây nghĩa là lấy số lượng phần tử tại trang đầu tiên
        if(res && res.data) {
            console.log("check data: ", res)
            setTotalUsers(res.total)
            setListUsers(res.data)
            setTotalPages(res.total_pages);
        }
    }
        const handlePageClick = (event) => { // event này làm theo trên thư viên
            console.log("event lib: ", event)
            getUsers(+event.selected + 1);// getUsers click vào trang nào lấy dữ liệu trang đấy
            // dấu cộng ở đây là convert kiểu string sang number(khi kb kiểu dữ liệu là 1 trong 2  cái kia)
        }
    return (<>
        <Table striped bordered hover>
            <thead>
                <tr>
                <th>ID</th>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                </tr>
            </thead>
            <tbody>
                {listUsers && listUsers.length > 0 && 
                
                listUsers.map((item, index) => {
                    return (
                            <tr key={`users-${index}`}>
                                <td>{item.id}</td>
                                <td>{item.email}</td>
                                <td>{item.first_name}</td>
                                <td>{item.last_name}</td>
                            </tr>
                    )
                })
                }
            
            </tbody>
        </Table>
         <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPages}
            previousLabel="< previous"
            renderOnZeroPageCount={null}

            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
      />
    </>)
}

export default TableUsers;