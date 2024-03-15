import React, { useEffect } from "react";

import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CircularProgressWithLabel from "@/pages/Home/CircularProgressWithLabel";
import { Navigate } from "react-router-dom";
import {
  useHandleCancel,
  useHandleSubmit,
} from "@/pages/Home/buttonEventHooks";
import useSocket from "@/pages/Home/useSocket";
import { selectAllUsers } from "@/pages/Home/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAllHomeStates, setIsLoading } from "@/pages/Home/homeSlice";
import { clearError } from "@/pages/Home/homeSlice";
import { clearInfoMessages } from "@/redux/infoSlice";
import ErrorList from "@/pages/Home/ErrorList";
import UserHandleInput from "@/pages/Home/UserHandleInput";
import SearchButton from "@/pages/Home/SearchButton";
import CancelButton from "@/pages/Home/CancelButton";
import UsersList from "@/pages/Home/UsersList";
import CountInput from "@/pages/Home/CountInput";
import DepthInput from "@/pages/Home/DepthInput";

function Body({ isLoggedIn }: { isLoggedIn: boolean }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [count, setCount] = useState<number>(10);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [depth, setDepth] = useState<number>(20);
  useSocket({ count, depth });

  const [descriptionInput, setDescriptionInput] = useState<string>("");
  // const [estimation, setEstimation] = useState<string>("");

  const users = useSelector(selectAllUsers);
  const success = useSelector(selectAllHomeStates).success;
  const isLoading = useSelector(selectAllHomeStates).isLoading;
  const progress = useSelector(selectAllHomeStates).progress;
  const inputError = useSelector(selectAllHomeStates).error;

  const dispatch = useDispatch();

  const { handleCancel } = useHandleCancel();
  const { handleSubmit } = useHandleSubmit(descriptionInput, count, depth);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(clearError());
    dispatch(clearInfoMessages());
    setDescriptionInput(e.target.value);
  };

  const handleDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.valueAsNumber;
    setDepth(newValue);
  };

  // useEffect(() => {
  //   const milliseconds = depth * 3474;
  //   const timeString = formatTime(milliseconds);

  //   setEstimation(timeString);
  // }, [depth]);

  useEffect(() => {
    if (users.length === 0 && success) dispatch(setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, success]);

  if (!isLoggedIn) {
    return <Navigate to="/DAOMatcher/login" />;
  }

  return (
    <center>
      <Container maxWidth="lg">
        <Box sx={{ margin: "5rem 0" }}>
          <Container maxWidth="md">
            <Typography variant="h5">
              Search for people with similar interests
            </Typography>

            <ErrorList inputError={inputError} success={success} />

            <Box sx={{ height: "2rem" }} />

            <UserHandleInput />

            <Box sx={{ height: "1rem" }} />

            <Box>
              <TextField
                id="outlined-textarea"
                label="Search description"
                // placeholder="Placeholder"
                rows={2}
                multiline
                fullWidth
                value={descriptionInput}
                onChange={handleDescriptionChange}
                size="small"
              />
            </Box>

            <Box sx={{ height: "1rem" }} />

            <CountInput
              isLoading
              count={count}
              handleChange={(_: Event, v: number | number[]) => {
                setCount(v as number);
                setDepth((v as number) * 2);
              }}
            />

            <DepthInput
              isLoading
              depth={depth}
              handleDepthChange={handleDepthChange}
            />

            <Box sx={{ height: "2rem" }} />

            <SearchButton isLoading={isLoading} handleSubmit={handleSubmit} />
            <CancelButton isLoading={isLoading} handleCancel={handleCancel} />
            <CircularProgressWithLabel
              style={{ margin: "1rem" }}
              value={progress}
              isLoading={isLoading}
            />
          </Container>
        </Box>

        <UsersList users={users} />
      </Container>
    </center>
  );
}

export default Body;
