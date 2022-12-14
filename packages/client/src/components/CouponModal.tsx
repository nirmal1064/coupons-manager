import { CouponType, ErrorMessageType } from "@coupons-manager/common";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AxiosError, AxiosResponse } from "axios";
import React, { useState } from "react";
import API from "../api";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addCoupon, updateCoupon } from "../redux/slices/couponSlice";

type AddCouponModalType = {
  open: boolean;
  coupon?: CouponType;
  action: "add" | "edit";
  handleClose: () => void;
};

const style = { width: "250px" };

const CouponModal = ({
  open,
  handleClose,
  coupon,
  action
}: AddCouponModalType) => {
  const title = action === "edit" ? "Edit Coupon" : "Add Coupon";
  const buttonText = action === "edit" ? "Update" : "Add";
  const user = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const [errorMsg, setErrorMsg] = useState("");
  const [msg, setMsg] = useState("");

  const getFormBody = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const body: { [key: string]: string } = {};
    formData.forEach((value, key) => (body[key] = value.toString()));
    body["userId"] = user.id as string;
    return body;
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body: { [key: string]: string } = getFormBody(e);
    const requestBody = JSON.stringify(body);
    API.post("/coupon/add", requestBody)
      .then((res: AxiosResponse<CouponType>) => {
        const { data } = res;
        dispatch(addCoupon(data));
        setMsg("Success! Coupon Added");
      })
      .catch((err: AxiosError<ErrorMessageType>) => {
        const msg = err.response?.data.msg as string;
        setErrorMsg(msg);
      });
    e.currentTarget.reset();
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body: { [key: string]: string } = getFormBody(e);
    const couponId = coupon?.id as string;
    body["id"] = couponId;
    const requestBody = JSON.stringify(body);
    API.post("/coupon/update", requestBody)
      .then((res: AxiosResponse<CouponType>) => {
        const { data } = res;
        dispatch(updateCoupon(data));
        setMsg("Success! Coupon Updated");
      })
      .catch((err: AxiosError<ErrorMessageType>) => {
        const msg = err.response?.data.msg as string;
        setErrorMsg(msg);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    action === "add" ? handleAdd(e) : handleUpdate(e);

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography style={{ textAlign: "center", fontSize: "24px" }}>
            {title}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 10, top: 15 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            style={{ flexWrap: "wrap", justifyContent: "space-around" }}>
            <TextField
              style={style}
              required
              fullWidth
              defaultValue={coupon?.title ? coupon.title : ""}
              id="title"
              label="Title"
              margin="normal"
              name="title"
              autoFocus
            />
            <TextField
              style={style}
              required
              fullWidth
              defaultValue={coupon?.provider ? coupon.provider : ""}
              id="provider"
              label="Provider"
              margin="normal"
              name="provider"
            />
            <TextField
              style={style}
              required
              fullWidth
              defaultValue={coupon?.targetApp ? coupon.targetApp : ""}
              id="targetApp"
              label="Target App"
              margin="normal"
              name="targetApp"
            />
            <TextField
              style={style}
              fullWidth
              defaultValue={coupon?.couponCode ? coupon.couponCode : ""}
              id="couponCode"
              margin="normal"
              name="couponCode"
              label="Coupon Code"
            />
            <TextField
              style={style}
              type="date"
              required
              fullWidth
              defaultValue={
                coupon?.expiryDate
                  ? coupon.expiryDate.toString().slice(0, 10)
                  : ""
              }
              id="expiryDate"
              label="Expiry Date"
              margin="normal"
              name="expiryDate"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              style={style}
              type="date"
              fullWidth
              defaultValue={coupon?.usedDate ? coupon?.usedDate : ""}
              id="usedDate"
              label="Used Date"
              margin="normal"
              name="usedDate"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
          {msg && (
            <Alert onClose={() => setMsg("")} severity="success">
              {msg}
            </Alert>
          )}
          {errorMsg && (
            <Alert onClose={() => setErrorMsg("")} severity="error">
              {errorMsg}
            </Alert>
          )}
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button variant="contained" color="error" onClick={handleClose}>
            Close
          </Button>
          {action === "add" && (
            <Button variant="contained" color="warning" type="reset">
              Reset
            </Button>
          )}
          <Button variant="contained" type="submit">
            {buttonText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CouponModal;
