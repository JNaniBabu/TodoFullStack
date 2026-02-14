import "./ProfileBio.css";
import { fetchWithRefresh } from "./authenticate";

import { useState, useRef, useEffect, useContext } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaFire,
  FaBullseye,
  FaChartLine,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { AuthenticationContext } from "./auth";
import { ThemeContext } from "./theme";

const API= "https://web-production-b7c02.up.railway.app";


function ProfileBio({ HandleBack, HandleLogout }) {
  const icons = [<FaBullseye />, <FaCheckCircle />, <FaChartLine />, <FaFire />];
  const Matter = [" Total Tasks", " Tasks Completion", "Completion Rate", " Streak"];
  const Display = ["no_of_tasks", "totalcompletion", " ", "streak"];

  const [isEdit, setIsEdit] = useState(false);
  const [preview, setPreview] = useState(null);

  const { theme, toggleTheme } = useContext(ThemeContext);
  const { RegisterCheck } = useContext(AuthenticationContext);

  const [ProfileData, setProfileData] = useState({
    name: "",
    bio: "",
    no_of_tasks: 0,
    totalcompletion: 0,
    streak: 0,
    profile_pic: null,
  });

  const fileRef = useRef(null);

  const openFilePicker = () => {
    if (isEdit) fileRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleChangeInput = (key, value) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await fetchWithRefresh(`${API}/profile/`, {method: "GET",});

        if (!response.ok) throw new Error("Failed to fetch profile");
        const result = await response.json();
        console.log(result.data);
        
        setProfileData(result.data);

      } catch (error) {
        console.error(error);
      }
    };

    if (!RegisterCheck) fetchProfile();
  }, [RegisterCheck]);

 const handleSave = async () => {
  try {
    const formData = new FormData();
    formData.append("name", ProfileData.name);
    formData.append("bio", ProfileData.bio);

    if (fileRef.current.files[0]) {
      formData.append("profile_pic", fileRef.current.files[0]);
    }
    const response = await fetchWithRefresh(`${API}/update-profile/`, {
      method: "PUT",
      body: formData,
    });
   
    if (!response.ok) throw new Error("Failed to update profile");
    const data = await response.json();
     if (data.profile_pic) {
      console.log(data.profile_pic);
      
    setPreview(data.profile_pic);
   }
    setProfileData(data);

  } catch (error) {
    console.error(error);
  }
};


  const getFeedback = () => {
    const percent = ProfileData.no_of_tasks
      ? (ProfileData.totalcompletion / ProfileData.no_of_tasks) * 100
      : 0;

    if (percent === 0) return <p>Let’s begin! Start with your first task.</p>;
    if (percent < 40) return <p>Good start. Keep the momentum going!</p>;
    if (percent < 80) return <p>Great progress! You’re doing well.</p>;
    if (percent < 100) return <p>Almost there! Finish strong.</p>;
    return <p>Excellent! All tasks completed today 🎉</p>;
  };

  return (
    <div className="ProfileBio">
      <div className="line">
        <h3>
          <FaArrowLeft onClick={HandleBack} />
        </h3>
      </div>

      <div className="dummy">
        <h3 onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </h3>

        <div className="ProfileBasics">
          <img
            src={preview || ProfileData?.profile_pic || null}
            onClick={openFilePicker}
            alt="profile"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleImageChange}
            hidden
          />

          <div className="separate">
            <div className="separatechilds">
              <label>Name</label>
              <input
                type="text"
                readOnly={!isEdit}
                value={ProfileData.name}
                onChange={(e) => handleChangeInput("name", e.target.value)}
              />
            </div>

            <div className="separatechilds">
              <label>Bio</label>
              <input
                type="text"
                readOnly={!isEdit}
                value={ProfileData.bio}
                onChange={(e) => handleChangeInput("bio", e.target.value)}
              />
            </div>
          </div>

          
        </div>
        {!isEdit && <h6 onClick={() => setIsEdit(true)}>Edit</h6>}
          {isEdit && (
            <h5
              onClick={async () => {
                await handleSave();
                setIsEdit(false);
              }}
            >
              Save
            </h5>
          )}
      </div>

      <div className="ProfileAnalytics">
        <div className="profileDummy">
          <div className="done">
            <h1>Achievements</h1>
            <div className="section">
              {icons.map((Ic, I) => (
                <div className="sectionOne" key={I}>
                  <h6>
                    {Ic}
                    {Matter[I]}
                  </h6>
                  <h6>
                    {Display[I].trim()
                      ? ProfileData[Display[I]]
                      : ProfileData.no_of_tasks
                      ? (
                          (ProfileData.totalcompletion /
                            ProfileData.no_of_tasks) *
                          100
                        ).toFixed(1) + "%"
                      : "0%"}
                  </h6>
                </div>
              ))}
            </div>
            <p>Complete 6 tasks/day to save streak</p>
          </div>

          <div className="improvements">
            <h1>Improvements</h1>
            {getFeedback()}
          </div>
        </div>

        <h3 style={{ cursor: "pointer" }} onClick={HandleLogout}>
          LogOut
        </h3>
      </div>
    </div>
  );
}

export default ProfileBio;
