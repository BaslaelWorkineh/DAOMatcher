import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface IProps extends CircularProgressProps {
  value: number;
  isLoading: boolean;
}

export default function CircularProgressWithLabel({
  value,
  isLoading,
  ...props
}: IProps) {
  return (
    <>
      {isLoading ? (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          {/* <CircularProgress color="success" /> */}
          <CircularProgress variant="determinate" value={value} {...props} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "blue",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >{`${Math.round(value)}%`}</Typography>
          </Box>
        </Box>
      ) : null}
    </>
  );
}
