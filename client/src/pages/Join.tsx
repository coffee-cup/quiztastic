import * as React from "react";
import { ButtonLink } from "../components/Button";
import Center from "../components/Center";
import Input from "../components/Input";
import { Blurb, Title } from "../components/Text";

const Join = () => (
  <Center>
    <Title>Join Game</Title>
    <Blurb>
      Ask around for the <br /> secret code
    </Blurb>
    <Input placeholder="Room code" />
    <ButtonLink to="/ready">Join</ButtonLink>
  </Center>
);

export default Join;
