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
import Papa from "papaparse";
import { toast } from "react-toastify";

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

  const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
  };
  const handleUpdateTable = (user) => {
    setListUsers([user, ...listUsers]);
    // console.log("check user: ", user)
  };

  const handleEditUser = (user) => {
    setDataUserEdit(user);
    setIsShowModalEdit(true);
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

  const handleDeleteUserFromModal = (user) => {
    let cloneListUser = _.cloneDeep(listUsers); // nó sẽ trỏ tới hai địa chỉ bộ nhớ khác nhau
    //nên cái mảng cũ vẫn giữ nguyên first_name, mảng mới đc clone ra thì đã thay đổi
    cloneListUser = cloneListUser.filter((item) => item.id !== user.id);
    setListUsers(cloneListUser);
  };

  const handleSort = (sortBy, sortField) => {
    // js array sort desc
    setSortBy(sortBy);
    setSortField(sortField);

    let cloneListUser = _.cloneDeep(listUsers);
    // cloneListUser = cloneListUser.sort((a,b) => a[sortField] - b[sortField]);
    // đáng lẻ là a.last_nom nhưng vì chúng ta kh biết sort cái trường gì nên làm ri
    cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy]);
    setListUsers(cloneListUser);

    console.log(cloneListUser);
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

  const handleImportCSV = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0]; // search: html get input file react
      console.log("check file upload", file);

      if (file.type !== "text/csv") {
        toast.error("Only accept csv files...");
        return;
      }

      // Parse local CSV file
      Papa.parse(file, {
        // header: true, //ờ ma zing, nếu truyền 1 cái props là header thì nó sẽ tự lấy cái Header của chúng ta là key
        // của các phần tử tiếp theo vd: id, first_name..., và trả về object thì quá tiện
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            if (rawCSV[0] && rawCSV[0].length === 3) {
              //rawCSV lấy phần tử đầu tiên, nếu lấy rawCSV kh thì tổng tất cả các raw mà đọc đc
              //length = 3 là để ép import cái định dạng file cho nó đúng, chứ triền miên sai hết định dạng thì kh đọc đc data
              if (
                rawCSV[0][0] !== "email" || // mảng 2 chìu vào đc data rồi lấy thằng header đầu tiên là email
                rawCSV[0][1] !== "first_name" ||
                rawCSV[0][2] !== "last_name"
              ) {
                toast.error("Wrong format Header CSV file!");
              } else {
                let result = [];

                rawCSV.map((item, index) => {
                  if (index > 0 && item.length === 3) {
                    // nếu dữ liệu sai kh có thì còn biết
                    let obj = {};
                    obj.email = item[0];
                    obj.first_name = item[1];
                    obj.last_name = item[2];
                    result.push(obj); // mỗi lần mà chúng ta lấy đc 1 thằng thì nó sẽ push thèn obj
                  }
                });
                setListUsers(result);
                console.log("check result: ", result);
              }
            } else {
              toast.error("Wrong format CSV file!");
            }
          } else toast.error("Not found data on CSV file!");
        },
      });
    }
  };
  return (
    <>
      <div className="my-3 add-new d-sm-flex">
        <span>
          <b>List User: </b>
          <div className="group-btns mt-sm-0 mt-2"></div>
        </span>
        <div className="group-btns">
          <label htmlFor="test" className="btn btn-warning">
            <i className="fa-solid fa-file-import"></i> Import
          </label>
          <input
            id="test"
            type="file"
            hidden
            onChange={(event) => handleImportCSV(event)}
          />
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
      <div className="col-12 col-sm-4 my-3">
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

      <div className="customize-table">
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
      </div>

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
