import { useState, useEffect, useContext, useRef } from "react";
import "./App.css";
import ProfileBio from "./ProfileBio";
import RegisterSection from "./Register";
import { AuthenticationContext, TodoListContext } from "./auth.jsx";
import MainInput from "./MainInput.jsx";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { BsFillSave2Fill } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



function App() {
  const { Todolist, setTodolist } = useContext(TodoListContext);
  const { RegisterCheck, setRegisterCheck } = useContext(AuthenticationContext);

  const [activityData, setactivityData] = useState({});
  const [ProfileNotCheck, setProfileNotCheck] = useState([0]);
  const [Edit, setEdit] = useState([]);
  const [DateAlert, setDateAlert] = useState([]);

  const [ProfilePic, setProfilePic] = useState(() => {
    const pic = localStorage.getItem("profile_pic");
    return pic ? `http://127.0.0.1:8000${pic}` : null;
  });

  useEffect(() => {
    if (localStorage.getItem("access")) {
        RESET();
        GetList();
      }
  }, []);


  const RESET = async () => {
    const today = new Date().toISOString().split("T")[0];
    const storedDate = localStorage.getItem("today");

    const token = window.localStorage.getItem("access");

    if (!window.localStorage.getItem("access")) {
      return;
    }
    if (!storedDate) {
      return localStorage.setItem(
        "today",
        new Date().toISOString().split("T")[0],
      );
    }
    if (today == storedDate) {
      return;
    }

    await fetch("http://127.0.0.1:8000/reset/", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      credentials: "include",
    });

    window.localStorage.setItem("today", today);

    GetList();
  };

  function HandleBack() {
    return setProfileNotCheck([0]);
  }

  async function HandleLogout() {
    await fetch("http://127.0.0.1:8000/logout/", {
      method: "POST",
      credentials: "include",
    });

    localStorage.clear();

    setRegisterCheck(true);
    setProfileNotCheck([0]);
    setProfilePic("");
  }

  useEffect(() => {
    function CheckRegister() {
      if (window.localStorage.getItem("access")) {
        return setRegisterCheck(false);
      }
      return setRegisterCheck(true);
    }
    const storedPic = localStorage.getItem("profile_pic");
    if (storedPic) {
      setProfilePic(`http://127.0.0.1:8000${storedPic}`);
    }

    CheckRegister();
  }, []);

  async function handleImageUpdation(profile_pic_path) {
    
    await GetList();
    const full = `http://127.0.0.1:8000${profile_pic_path}`;
    localStorage.setItem("profile_pic", profile_pic_path);
    setProfilePic(full);
  }

  async function GetList() {
    const token = localStorage.getItem("access");
    if (!token) return;
    let response = await fetch("http://127.0.0.1:8000/todolist/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const Result = await response.json();
    setTodolist(Result ? Result : []);
  }

  async function Delete(id) {
    await fetch(`http://127.0.0.1:8000/delete/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      credentials: "include",
    });

    await GetList();
  }

  async function DoneTodo(id, DateD, i) {
    const now = new Date().getTime();
    const selected = new Date(DateD).getTime();

    if ((selected > now ) && !DateAlert.includes(i)) {
      setDateAlert([i]);
      return;
    }
    

    await fetch(`http://127.0.0.1:8000/DoneToDo/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      credentials: "include",
    });

    await GetList();
  }

  async function SaveTodo(id, i) {
  if (!Edit.includes(i)) return;
  const Data = {
    activity: activityData[i],
  };

  await fetch(`http://127.0.0.1:8000/save/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
    body: JSON.stringify(Data),
    credentials: "include",
  });

  await GetList();
}

  async function UpdationOFlist() {
    await GetList();
  }

  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <div className="parent">
      {ProfileNotCheck.includes(0) && (
        <div className="Home">
          <div className="header">
            <h2>Let's.</h2>
            <div
              className="profileImage"
              onClick={() => {
                if (!RegisterCheck) setProfileNotCheck([1]);
                return;
              }}
            >
              {ProfilePic && <img src={ProfilePic} alt="" />}
            </div>
          </div>

          <div className="child">
            <MainInput UpdationOFlist={UpdationOFlist}></MainInput>

            <div className="contentList">
              {RegisterCheck && (
                <h6>
                  Please{" "}
                  <span
                    onClick={() => {
                      setProfileNotCheck([2]);
                    }}
                  >
                    Register
                  </span>{" "}
                  to Use.
                </h6>
              )}
              {RegisterCheck == false && Todolist.length == 0 && (
                <h6>“Your goals don’t care about your mood.”</h6>
              )}
              {!RegisterCheck &&
                Array.isArray(Todolist) &&
                Todolist.length > 0 && (
                  <div className="contentChild">
                    {Todolist.map((item, i) => (
                      <div className="content" key={item.id || i}>
                        <div className="todoRow">
                          <textarea
                            ref={(el) => autoGrow(el)}
                            value={
                              !Edit.includes(i)
                                ? item.activity
                                : activityData[String(i)]
                                  ? activityData[String(i)]
                                  : item.activity
                            }
                            readOnly={!Edit.includes(i)}
                            onChange={(e) => {
                              setactivityData((p) => ({
                                ...p,
                                [i]: e.target.value,
                              }));
                              autoGrow(e.target);
                            }}
                            rows={1}
                            style={
                              item.done ? { backgroundColor: "#5dec5d" } : {}
                            }
                          />
                          <div className="dateicons">
                            <div className="dateTime">
                              {new Date(item.dateTime).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                              (
                              <span>
                                {new Date(item.dateTime).toLocaleString(
                                  "en-IN",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  },
                                )}
                              </span>
                              )
                            </div>

                            <div className="contentIcons">
                              <span className="iconBtn" data-tooltip="Done">
                                <FaCheck
                                  onClick={() =>{
                                    setDateAlert([])
                                    DoneTodo(item["id"], item.dateTime, i)
                                  }
                                  }
                                  style={item.done ? { color: "green" } : {}}
                                />
                              </span>

                              <span className="iconBtn" data-tooltip="Edit">
                                <FaEdit onClick={() => setEdit([i])} />
                              </span>

                              <span className="iconBtn" data-tooltip="Save">
                                <BsFillSave2Fill
                                  onClick={() => {
                                    SaveTodo(item["id"], i);
                                    setEdit((prev) =>
                                      prev.filter((id) => id !== i),
                                    );
                                  }}
                                />
                              </span>

                              <span className="iconBtn" data-tooltip="Delete">
                                <FaTrash onClick={() => Delete(item["id"])} />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="DateAlert"
                          style={
                            (!DateAlert.includes(i) || item['done']) ? {display: "none"} : {  }
                          }
                        >
                          <h6>
                            Activity Not Scheduled At This Moment , Are sure to
                            mark Done ?
                          </h6>

                          <div className="DateAlertsub">
                            <button onClick={() => setDateAlert([])}>No</button>
                            <button
                              style={{ background: "green", color: "white" }}
                              onClick={() => {
                                setDateAlert([]);
                                 DoneTodo(item["id"], item.dateTime, i)

                              }}
                            >
                              Yes
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
      {ProfileNotCheck.includes(1) && (
        <ProfileBio
          HandleBack={HandleBack}
          HandleLogout={HandleLogout}
        ></ProfileBio>
      )}
      {ProfileNotCheck.includes(2) && (
        <RegisterSection
          HandleBack={HandleBack}
          handleImageUpdation={handleImageUpdation}
        ></RegisterSection>
      )}
    </div>
  );
}

export default App;
