"use client";

import { Button, Stack, Text, TextInput } from "@mantine/core";

import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup } from "./actions";
import "./styles.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSignUp = async () => {
    const { success } = await signup(name, email, password);

    if (!success) {
      notifications.show({
        title: "Sign-Up Error",
        message: "Please Try Again",
        position: "top-right",
        color: "red",
      });
    } else {
      notifications.show({
        title: "Success",
        message: "Please check your email to confirm your account",
        position: "top-right",
        color: "green",
      });

      router.push("/login");
    }
  };

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
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <TextInput
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />

            <Button
              onClick={handleSignUp}
              bg="gold"
              className="rounded-md w-full"
            >
              Register
            </Button>
            <Button
              type="submit"
              variant="transparent"
              c="blue"
              fw="normal"
              className="self-center"
              onClick={() => router.push("/login")}
            >
              Already have an account? Login
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
