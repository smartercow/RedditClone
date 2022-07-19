import { Button } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";
import { AuthModalState } from "../../../atoms/authModalAtom";

const AuthButtons: React.FC = () => {
  const setAuthModalState = useSetRecoilState(AuthModalState)
  return (
    <>
      <Button
        variant="outline"
        height="28px"
        width={{ base: "70px", md: "110px" }}
        display={{ base: "none", sm: "flex" }}
        mr={2}
        onClick={() => {setAuthModalState({ open: true, view: 'login'})}}
      >
        Log in
      </Button>
      <Button
        height="28px"
        width={{ base: "70px", md: "110px" }}
        display={{ base: "none", sm: "flex" }}
        mr={2}
        onClick={() => {setAuthModalState({ open: true, view: 'signup'})}}
      >
        Sign up
      </Button>
    </>
  );
};
export default AuthButtons;
