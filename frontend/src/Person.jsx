import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Person() {
    const [file,setFile] = useState()
  const [currentPage, setCurrentPage] = useState(1);
  const [student, Setstudent] = useState();
  const [studentsPerPage] = useState(5);
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  axios.defaults.withCredentials = true;

   // Retrieve currentPage from local storage on component mount
   useEffect(() => {
    const storedPage = localStorage.getItem("currentPage");
    setCurrentPage(storedPage ? parseInt(storedPage, 10) : 1);
  }, []);

  const handleFile = (e) =>{
   
    setFile(e.target.files[0])
  }

  const handleUpload = (id)=>{
    
    const formdata= new FormData();
    formdata.append("image",file);
    formdata.append("id",id);
    axios.post(`http://localhost:5000/upload`,formdata).then(res=>{
        if(res.data.Status == "Success"){
          console.log("Succedded")
           // Save currentPage to local storage after successful upload
          localStorage.setItem("currentPage", currentPage.toString());
          window.location.reload();
        }else{
            console.log("Failed")
        }
    }).catch(err=> console.log(err))
  }
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
          // alert("Error")
        }
      })
      .then((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/userdata")
      .then((res) => Setstudent(res.data))
      //    console.log("result----->",res))
      .catch((err) => console.log(err));
  }, []);

  // Get current students
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = student?.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    
    localStorage.setItem("currentPage", pageNumber.toString());
  };

  console.log("data------------>", student);

  const handleDelete = () => {
    axios
      .get("http://localhost:5000/logout")
      .then((res) => {
        window.location.reload(true);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="container mt-4">
      {auth ? (
        <div >
         <div className="d-flex justify-content-between">
           <div><h3 style={{ color: 'blue' }}>You Are Authorized - {name}</h3></div>
          <button className="btn btn-danger" onClick={handleDelete}>
            Logout
          </button>
          </div>
          <div className="d-flex vh-80 justify-content-center align-items-center border border-danger p-3">
            <div className="w-8 bg-white rounded">
              {/* <button className="btn btn-primary">Add+</button> */}
              <table className="table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>ShowImage</th>
                    <th>Name</th>
                    <th>Email</th>
                    
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents?.map((data, index) => (
                    <tr key={data.id}>
                      <td>{data.id}</td>
                      <td><img style={{ width: '50px', height: '50px' }}  src={`http://localhost:5000/uploads/${data.image}`} alt=""/></td>
                      <td>{data.name}</td>
                      <td>{data.email}</td>
                      <td><input type="file" accept=".jpg, .jpeg, .png" onChange={handleFile}/></td>
                      <td><button className="btn btn-primary" onClick={()=>handleUpload(data.id)}>Upload</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <ul className="pagination mt-3">
                {Array.from(
                  { length: Math.ceil(student?.length / studentsPerPage) },
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
