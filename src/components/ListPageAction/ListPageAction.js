import PropTypes from "prop-types";
import qs from "query-string";
import { RestartAlt as RestartAltIcon } from "@mui/icons-material";
import { Box, Button, Menu, MenuItem, Switch, TablePagination, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ListPageAction({
  leftAction,
  showCols,
  setShowCols,
  showTableColsMenu,
  setShowTableColsMenu,
  reset,
  setIsReset,
  createDefaultValues,
  columns,
  setValue,
  loadData,
  watch,
  count
}) {
  const navigate = useNavigate();
  const { t } = useTranslation("components", { keyPrefix: "ListPageAction" });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { md: "row", xs: "column" },
        justifyContent: "space-between",
        alignItems: { md: "center", xs: "flex-start" }
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <Button
          variant="outlined"
          onClick={(event) => {
            // console.log("event.currentTarget: ", event.currentTarget);
            setShowTableColsMenu(event.currentTarget);
          }}
        >
          {t("button.showMenuColumns")}
        </Button>
        <Button
          color="inherit"
          onClick={() => {
            reset(createDefaultValues());
            setIsReset((prev) => !prev);
          }}
          sx={{
            display: { md: "none", xs: "flex" }
          }}
        >
          {t("button.reset")}
          <RestartAltIcon />
        </Button>
        {leftAction}
        <Menu
          anchorEl={showTableColsMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          open={Boolean(showTableColsMenu)}
          onClose={() => {
            setShowTableColsMenu(null);
          }}
          sx={{
            maxHeight: 250
          }}
        >
          {columns
            .filter((column) => column.id in showCols)
            .map((column) => {
              return (
                <MenuItem
                  key={column.id}
                  sx={{
                    px: 2,
                    py: 0
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Typography fontSize={10}>{column.label}</Typography>

                    <Switch
                      size="small"
                      checked={showCols[column.id] === true}
                      onChange={() => {
                        setShowCols((prev) => ({
                          ...prev,
                          [column.id]: !prev[column.id]
                        }));
                      }}
                    />
                  </Box>
                </MenuItem>
              );
            })}
        </Menu>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <Button
          color="inherit"
          onClick={() => {
            reset(createDefaultValues());
            setIsReset((prev) => !prev);
          }}
          sx={{
            display: {
              md: "flex",
              xs: "none"
            }
          }}
        >
          {t("button.reset")}
          <RestartAltIcon />
        </Button>

        <TablePagination
          component="div"
          count={count}
          page={count === 0 ? 0 : watch().page - 1}
          onPageChange={(e, page) => {
            const newPage = page + 1;
            setValue("page", newPage);
            const params = { ...watch(), page: newPage };
            const searchParams = qs.stringify(params);
            navigate(`?${searchParams}`);
            loadData({ page: newPage });
          }}
          rowsPerPageOptions={[1, 10, 20, 50, 100]}
          rowsPerPage={watch().limit}
          onRowsPerPageChange={(e) => {
            const newLimit = parseInt(e.target.value, 10);
            setValue("limit", newLimit);
          }}
          sx={{
            p: 0,
            mb: 0
          }}
        />
      </Box>
    </Box>
  );
}

ListPageAction.defaultProps = {
  leftAction: undefined,
  showTableColsMenu: null
};

ListPageAction.propTypes = {
  leftAction: PropTypes.node,
  showCols: PropTypes.object.isRequired,
  setShowCols: PropTypes.func.isRequired,
  showTableColsMenu: PropTypes.object,
  setShowTableColsMenu: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  setIsReset: PropTypes.func.isRequired,
  createDefaultValues: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  setValue: PropTypes.func.isRequired,
  loadData: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired
};

export default ListPageAction;
