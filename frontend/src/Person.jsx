import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Person() {
  const [file, setFile] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [student, Setstudent] = useState();
  const [studentsPerPage] = useState(5);
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (columnName) => {
    setSortBy(columnName);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const storedPage = localStorage.getItem("currentPage");
    setCurrentPage(storedPage ? parseInt(storedPage, 10) : 1);
  }, []);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (id) => {
    const formdata = new FormData();
    formdata.append("image", file);
    formdata.append("id", id);
    axios
      .post(`http://localhost:5000/upload`, formdata)
      .then((res) => {
        if (res.data.Status === "Success") {
          console.log("Succeeded");
          localStorage.setItem("currentPage", currentPage.toString());
          window.location.reload();
        } else {
          console.log("Failed");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000")
      .then((res) => {
        console.log("Personres", res);
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
          navigate("/person");
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/userdata")
      .then((res) => Setstudent(res.data))
      .catch((err) => console.log(err));
  }, []);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem("currentPage", pageNumber.toString());
  };

  const handleDelete = () => {
    axios
      .get("http://localhost:5000/logout")
      .then((res) => {
        window.location.reload(true);
      })
      .catch((err) => console.log(err));
  };

  // Filter and sort students
  const filteredStudents = (student || [])?.filter(
    (data) =>
      data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const factor = sortOrder === "asc" ? 1 : -1;
    switch (sortBy) {
      case "id":
        return factor * (a.id - b.id);
      case "name":
        return factor * a.name.localeCompare(b.name);
      case "email":
        return factor * a.email.localeCompare(b.email);
      // Add more cases for other sortable columns if needed
      default:
        return 0;
    }
  });

  // Get current students
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents?.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  return (
    <div className="container mt-4">
      {auth ? (
        <div>
          <div className="d-flex justify-content-between">
            <div>
              <h3 style={{ color: "blue" }}>You Are Authorized - {name}</h3>
            </div>
            <button className="btn btn-danger" onClick={handleDelete}>
              Logout
            </button>
          </div>
          <div className="d-flex vh-80 justify-content-center align-items-center p-3">
            <div className="w-8 bg-white rounded">
              <div>
                <div className="form-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("id")}>S.No</th>
                    <th onClick={() => handleSort("image")}>ShowImage</th>
                    <th onClick={() => handleSort("name")}>Name</th>
                    <th onClick={() => handleSort("email")}>Email</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents?.map((data, index) => (
                    <tr key={data.id}>
                      <td>{data.id}</td>
                      <td>
                        <img
                          style={{ width: "50px", height: "50px" }}
                          src={`http://localhost:5000/uploads/${data.image}`}
                          alt=""
                        />
                      </td>
                      <td>{data.name}</td>
                      <td>{data.email}</td>
                      <td>
                        <input
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          onChange={handleFile}
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleUpload(data.id)}
                        >
                          Upload
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <ul className="pagination mt-3">
                {Array.from(
                  { length: Math.ceil(sortedStudents?.length / studentsPerPage) },
                  (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h3>{message}</h3>
          <h3>Login Now</h3>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default Person;
