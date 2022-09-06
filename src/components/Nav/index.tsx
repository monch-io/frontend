import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NavLink } from "react-router-dom";

import { GiMeal, GiFruitBowl } from "react-icons/gi";
import { BiHome } from "react-icons/bi";
import { CgNotes } from "react-icons/cg";
import { IconType } from "react-icons";

interface LinkItemProps {
  text: string;
  to: string;
  Icon: IconType;
}

const LinkItem = ({ text, to, Icon }: LinkItemProps) => {
  return (
    <NavLink to={to} style={{ textDecoration: "none", color: "inherit" }}>
      {({ isActive }) => (
        <ListItem>
          <ListItemButton selected={isActive}>
            <ListItemIcon>
              <Icon size={24} />
            </ListItemIcon>
            <ListItemText sx={{ textDecoration: "none" }} primary={text} />
          </ListItemButton>
        </ListItem>
      )}
    </NavLink>
  );
};

const Nav = () => {
  return (
    <List
      component={"nav"}
      sx={{
        width: "100%",
        maxWidth: 240,
        bgcolor: "background.paper",
      }}
    >
      <LinkItem to={"/"} text={"Home"} Icon={BiHome} />
      <LinkItem to={"/meals"} text={"Meals"} Icon={GiMeal} />
      <LinkItem to={"/recipes"} text={"Recipe"} Icon={CgNotes} />
      <LinkItem to={"/ingredients"} text={"Ingredients"} Icon={GiFruitBowl} />
    </List>
  );
};

export default Nav;
