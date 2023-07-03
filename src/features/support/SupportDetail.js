import { Avatar, Button, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

// import { useAuthStore } from "../../store/AuthStore";
import images from "../../assets/images";
import "./SupportPage.css";

export default function SupportDetail() {
  // const authStore = useAuthStore();
  const { t } = useTranslation("supportPage");
  function createData(avatar, name, description) {
    return { avatar, name, description };
  }

  const chatDatas = [
    createData(images.logo, "Thanh", "Dau dau qua"),
    createData(images.logo, "Hieu", "Mua thuoc di"),
    createData(images.logo, "Thanh", "Dau rang qua"),
    createData(images.logo, "Hieu", "Di kham rang di"),
    createData(images.logo, "Thanh", "Dau hong qua"),
    createData(images.logo, "Hieu", "Mua thuoc ho di")
  ];
  const [question, setQuestion] = useState("");
  const changeQuestion = (e) => {
    setQuestion(e.target.value);
  };
  const sendQuestion = () => {
    // alert(question);
  };
  return (
    <>
      <div className="support-detail-title">
        <h2>
          <b>
            {t("detail.form-detail").toUpperCase()} {question}
          </b>
        </h2>
        <Button variant="contained" className="back-btn" href="../../support">
          {t("detail.back").toUpperCase()}
        </Button>
      </div>
      <div className="chatting-info">
        {chatDatas.map((chatData) => (
          <div className="chatting-group">
            <div>
              <Avatar alt="Bệnh nhân" src={chatData.avatar} />
            </div>
            <div>
              <h3>{chatData.name}</h3>
              <h4>{chatData.description}</h4>
            </div>
          </div>
        ))}
      </div>
      <div className="input-question">
        <TextField fullWidth id="question" onChange={changeQuestion} />
        <Button onClick={sendQuestion}>
          <SendIcon sx={{ fontSize: 40 }} />
        </Button>
      </div>
    </>
  );
}
