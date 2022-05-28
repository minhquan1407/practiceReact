import axios from "axios";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { fetchAllUser } from "../services/UserServices";
import ReactPaginate from "react-paginate";
import ModalAddNew from "./ModalAddNew";
import ModalEditUser from "./ModalEditUser";
import _, { debounce } from "lodash";
import ModalConfirm from "./ModalConfirm";
import "./TableUser.scss";
import { CSVLink } from "react-csv";

const TableUsers = (props) => {
  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);

  const [isShowModalEdit, setIsShowModalEdit] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState({});

  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [dataUserDelete, setDataUserDelete] = useState({});

  const [sortBy, setSortBy] = useState("asc");
  const [sortField, setSortField] = useState("id");

  // const [keyword, setKeyword] = useState("");
  const [dataExport, setDataExport] = useState([]);

  const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
  };
  const handleUpdateTable = (user) => {
    setListUsers([user, ...listUsers]);
    // console.log("check user: ", user)
  };

  const handleEditUserFromModal = (user) => {
    let cloneListUser = _.cloneDeep(listUsers); // nó sẽ trỏ tới hai địa chỉ bộ nhớ khác nhau
    //nên cái mảng cũ vẫn giữ nguyên first_name, mảng mới đc clone ra thì đã thay đổi
    let index = listUsers.findIndex((item) => item.id === user.id);
    cloneListUser[index].first_name = user.first_name;
    setListUsers(cloneListUser);

    console.log(listUsers, cloneListUser);
  };
  const handleDeleteUser = (user) => {
    setIsShowModalDelete(true);
    setDataUserDelete(user);
  };
  useEffect(() => {
    //call apis
    getUsers(1);
  }, []);

  const getUsers = async (page) => {
    let res = await fetchAllUser(page); //page ở đây nghĩa là lấy số lượng phần tử tại trang đầu tiên
    if (res && res.data) {
      console.log("check data: ", res);
      setTotalUsers(res.total);
      setListUsers(res.data);
      setTotalPages(res.total_pages);
    }
  };
  const handlePageClick = (event) => {
    // event này làm theo trên thư viên
    // console.log("event lib: ", event)
    getUsers(+event.selected + 1); // getUsers click vào trang nào lấy dữ liệu trang đấy
    // dấu cộng ở đây là convert kiểu string sang number(khi kb kiểu dữ liệu là 1 trong 2  cái kia)
  };

  const handleEditUser = (user) => {
    setDataUserEdit(user);
    setIsShowModalEdit(true);
  };
  const handleDeleteUserFromModal = (user) => {
    let cloneListUser = _.cloneDeep(listUsers); // nó sẽ trỏ tới hai địa chỉ bộ nhớ khác nhau
    //nên cái mảng cũ vẫn giữ nguyên first_name, mảng mới đc clone ra thì đã thay đổi
    cloneListUser = cloneListUser.filter((item) => item.id !== user.id);
    setListUsers(cloneListUser);
  };

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);

    let cloneListUser = _.cloneDeep(listUsers);
    // cloneListUser = cloneListUser.sort((a,b) => a[sortField] - b[sortField]);
    cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy]);
    setListUsers(cloneListUser);

    console.log(cloneListUser);
    // đáng lẻ là a.last_nom nhưng vì chúng ta kh biết sort cái trường gì nên làm ri
  };
  // console.log("check sort:", sortBy, sortField);

  const handleSearch = debounce((event) => {
    // search: lodash debounce call apis

    let term = event.target.value;
    console.log("Check Call", term); // handle đc số lần ngừi dùng search, hạn chế khi dùng vs APi, call quá nhìu kh ổn
    if (term) {
      let cloneListUser = _.cloneDeep(listUsers);
      cloneListUser = cloneListUser.filter((item) => item.email.includes(term)); //String.prototype.includes()
      setListUsers(cloneListUser);
    } else {
      getUsers(1); // khi mà để rỗng thì fetch lại danh sách user
      // fetch lại bởi vì nếu nhập mỗi chuỗi nào đó mà kh có trong danh sách or có thì sau khi xóa đoạn text đó
      // khỏi input nó phải trả lại cái danh sách cho ta, nêu kh fetch lại thì nó sẽ kh trả ra lại d/s
    }
  }, 500);
  // có cái bug khi search, khi mà xóa ngược lại mà nó kh ra là do mình search phía client
  // khi mà mình search cái kết quả nó kh ra thì khi đấy nó set cái ListUsers bằng rỗng
  // thì khi set bằng rỗng thì cho dù search 1 kqua nó đã có trc đó rồi thì nó sẽ tìm trong cái mảng rỗng nên dĩ nhiên là kh có

  const getUsersExport = (event, done) => {
    let result = [];
    if (listUsers && listUsers.length > 0) {
      result.push(["Id", "Email", "First name", "Last name"]); // build lạo cục data header, xong build thằng body ở dưới
      listUsers.map((item, index) => {
        let arr = [];
        arr[0] = item.id; // lặp qua từng phần tử của mảng này lấy 4 thằng này ứng với header chúng ta
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        result.push(arr); //sau khi tạo ra arr rồi sẽ đẩy tiếp vào mảng chúng ta
      });
      setDataExport(result); // sau khi xong rồi cập nhật trạng thái thằng react
      done(); // và gọi hàm done thì thằng thư viên sẽ biết mày gọi cái hàm này rồi ta sẽ render
    }
  };
  return (
    <>
      <div className="my-3 add-new">
        <span>
          <b>List User: </b>
        </span>
        <div className="group-btns">
          <label htmlFor="test" className="btn btn-warning">
            <i className="fa-solid fa-file-import"></i> Import
          </label>
          <input id="test" type="file" hidden />
          <CSVLink
            filename={"users.csv"}
            className="btn btn-primary"
            data={dataExport} // data của chúng ta dùng thằng react quản lí là dataExport(3)
            asyncOnClick={true} // dùng thằng này để báo thư viên get data(1)
            onClick={getUsersExport} // nó sẽ chờ hàm onClick này thực hiện xong nó mới nạp data đầu vào(2)
          >
            <i className="fa-solid fa-file-arrow-down"></i> Export
          </CSVLink>

          <button
            className="btn btn-success"
            onClick={() => setIsShowModalAddNew(true)}
          >
            <i className="fa-solid fa-circle-plus"></i> Add new
          </button>
        </div>
      </div>
      <div className="col-4 my-3">
        <input
          className="form-control"
          placeholder="Search user by email..."
          // value={keyword}
          // kh cần tạo state keyword, bởi vì khi mà mình tạo cái nút bên cạnh ô input, mình kick vào cái ô đó
          // thì gọi đến cái state của thằng react thì mới biết đc giá trị trong ô input là gì
          onChange={(event) => handleSearch(event)}
          //papaparse là convert file phía client
          //react csv láy dữ liệu từ react export ra file csv
        />
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <div className="sort-header">
                <span>ID</span>
                <span>
                  <i
                    className="fa-solid fa-arrow-down-long"
                    onClick={() => handleSort("desc", "id")}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up-long"
                    onClick={() => handleSort("asc", "id")}
                  ></i>
                </span>
              </div>
            </th>
            <th className="sort-header">Email</th>
            <th>
              <div className="sort-header">
                <span>First Name </span>
                <span>
                  <i
                    className="fa-solid fa-arrow-down-long"
                    onClick={() => handleSort("desc", "first_name")}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up-long"
                    onClick={() => handleSort("asc", "first_name")}
                  ></i>
                </span>
              </div>
            </th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listUsers &&
            listUsers.length > 0 &&
            listUsers.map((item, index) => {
              return (
                <tr key={`users-${index}`}>
                  <td>{item.id}</td>
                  <td>{item.email}</td>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>
                    <button
                      className="btn btn-warning mx-3"
                      onClick={() => handleEditUser(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteUser(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
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
      <ModalAddNew
        show={isShowModalAddNew}
        handleClose={handleClose}
        handleUpdateTable={handleUpdateTable}
      />
      <ModalEditUser
        show={isShowModalEdit}
        handleClose={handleClose}
        dataUserEdit={dataUserEdit}
        handleEditUserFromModal={handleEditUserFromModal}
      />

      <ModalConfirm
        show={isShowModalDelete}
        handleClose={handleClose}
        dataUserDelete={dataUserDelete}
        handleDeleteUserFromModal={handleDeleteUserFromModal}
      />
    </>
  );
};

export default TableUsers;
