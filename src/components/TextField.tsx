import React, { FC } from "react";
import { TextField as Input, TextFieldProps, Theme } from "@mui/material";

import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: `${theme.spacing(2)} !important`,
    },
  })
);

const TextField: FC<TextFieldProps> = ({ ...props }) => {
  const classes = useStyles();

  return (
    <Input
      classes={{
        root: classes.root,
      }}
      {...props}
    />
  );
};

export default TextField;
