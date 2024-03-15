import { Stack, TextField, Typography } from "@mui/material";
import { count } from "console";
import React from "react";

interface IProps {
  isLoading: boolean;
  depth: number;
  handleDepthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DepthInput = ({ isLoading, depth, handleDepthChange }: IProps) => {
  return (
    <>
      <Stack direction="row">
        <TextField
          disabled={isLoading}
          aria-label="Enter depth for the search"
          placeholder="Choose depth"
          label="Depth of search"
          type="number"
          value={depth}
          onChange={handleDepthChange}
        />
        <div
          style={{
            marginTop: "1rem",
            marginLeft: "1rem",
            color: "#4f4c4c",
          }}
        >
          <Typography id="users-slider" fontSize={14} gutterBottom>
            {`Searching ${count} users using depth of ${depth}`}
          </Typography>
        </div>
      </Stack>
    </>
  );
};

export default DepthInput;
