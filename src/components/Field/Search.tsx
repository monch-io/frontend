import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface SearchProps {
  text?: string;
  onChange: (value: string) => void;
}

const Search = ({ text = "Search", onChange }: SearchProps) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    onChange(input);
  }, [input]);

  return (
    <Autocomplete
      sx={{ width: 300 }}
      open={open}
      freeSolo
      options={[]}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      inputMode={"search"}
      inputValue={input}
      openOnFocus
      disableCloseOnSelect={false}
      clearOnEscape
      onInputChange={(_, value) => setInput(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          className=""
          variant="outlined"
          size="small"
          placeholder={text}
          sx={{ background: "white" }}
        />
      )}
    />
  );
};

export default Search;
