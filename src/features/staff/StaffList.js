import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function StaffList() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        const staffId = 1;
        navigate(`/staff/${staffId}`);
      }}
    >
      StaffList
    </Button>
  );
}

export default StaffList;
