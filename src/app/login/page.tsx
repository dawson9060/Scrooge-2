"use client";

import { Button, Stack, Text, TextInput } from "@mantine/core";
import { login, signup } from "./actions";

import "./styles.css";

export default function LoginPage() {
  return (
    <section style={{ overflowY: "hidden" }}>
      <Stack
        className="w-screen h-screen overflow-hidden"
        justify="center"
        align="center"
      >
        <form>
          <Stack className="w-80 p-5 rounded-md shadow-md bg-white">
            <Text size="25px" my="sm" c="#fabf1b" className="text-center">
              Scrooge
            </Text>
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
            />
            <TextInput
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
            />
            <Button
              type="submit"
              formAction={login}
              bg="gold"
              className="rounded-md w-full"
            >
              Log In
            </Button>
            <Button
              type="submit"
              variant="transparent"
              c="blue"
              fw="normal"
              formAction={signup}
              className="self-center"
            >
              Sign Up
            </Button>
          </Stack>
        </form>
      </Stack>
      <div className="air air1"></div>
      <div className="air air2"></div>
      <div className="air air3"></div>
      <div className="air air4"></div>
    </section>
  );
}
