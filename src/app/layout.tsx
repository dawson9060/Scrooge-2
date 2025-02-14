import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import { Provider } from "jotai";

const inter = Inter({ subsets: ["latin"] });

import { theme } from "@/mantine/theme";
import { ColorSchemeScript, MantineProvider, Stack } from "@mantine/core";

export const metadata: Metadata = {
  title: "Scrooge",
  description: "Save Money with Scrooge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <ColorSchemeScript />
      </head>
      <body style={{ height: "100vh" }}>
        <MantineProvider theme={theme}>
          <Notifications />
          <Provider>
            <Stack className="min-h-screen">{children}</Stack>
          </Provider>
        </MantineProvider>
      </body>
    </html>
  );
}
