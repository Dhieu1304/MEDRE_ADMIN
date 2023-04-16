import { CssBaseline, Box } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import { CustomDrawerHeader } from "../../components/CustomDrawer";
import Header from "../components/Header/Header";
import SideBar from "../components/SideBar";

export default function DefaultLayout({ children }) {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header open={open} handleDrawerOpen={handleDrawerOpen} />
      <SideBar open={open} handleDrawerClose={handleDrawerClose} />

      <Box
        component="main"
        sx={{
          width: "100%",
          height: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          px: {
            md: 6,
            sm: 4,
            xs: 2
          },
          overflow: "hidden"
        }}
        py={4}
      >
        <CustomDrawerHeader />

        {children}
      </Box>
    </Box>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired
};

// import { Box } from "@mui/material";
// import PropTypes from "prop-types";
// import Header from "../components/Header";

// function DefaultLayout({ children }) {
//   return (
//     <Box sx={{ width: "100vw", minHeight: "100vh" }}>
//       <Header />
//       <Box sx={{ width: "100%", height: "100%" }}>{children}</Box>;
//     </Box>
//   );
// }

// export default DefaultLayout;
