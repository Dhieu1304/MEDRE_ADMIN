import PropTypes from "prop-types";
import { Button, Collapse, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import CustomPageTitle from "./CustomPageTitle";

function ListPageTop({ title, filterFormNode }) {
  const [openFilterMobile, setOpenFilterMobile] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const { t } = useTranslation("components", { keyPrefix: "ListPageTop" });

  return (
    <>
      <CustomPageTitle
        title={title}
        right={
          isMobile && (
            <Button
              onClick={() => {
                setOpenFilterMobile((prev) => !prev);
              }}
            >
              {openFilterMobile ? t("button.hideFilterCollapse") : t("button.showFilterCollapse")}
            </Button>
          )
        }
      />

      <Collapse in={!isMobile || openFilterMobile}>{filterFormNode}</Collapse>
    </>
  );
}

ListPageTop.propTypes = {
  title: PropTypes.string.isRequired,
  filterFormNode: PropTypes.node.isRequired
};

export default ListPageTop;
