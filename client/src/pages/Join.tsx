import * as React from "react";
import { redirectGame } from "../actions";
import Button from "../components/Button";
import Center from "../components/Center";
import Input from "../components/Input";
import { Blurb, Title } from "../components/Text";
import { dispatch } from "../model";

const Join = () => {
  const [code, setCode] = React.useState("");

  return (
    <Center>
      <Title>Join Game</Title>
      <Blurb>
        Ask around for the <br /> secret code
      </Blurb>
      <form
        onSubmit={e => {
          dispatch(redirectGame)(code);
          e.preventDefault();
        }}
      >
        <Input
          type="text"
          placeholder="Room code"
          onChange={e => setCode(e.target.value)}
        />
        <Button type="submit">Join</Button>
      </form>
    </Center>
  );
};

export default Join;
