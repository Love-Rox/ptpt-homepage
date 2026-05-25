import type { ReactNode } from "react";

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>ptpt — isolation test</title>
      </head>
      <body>{children}</body>
    </html>
  );
}

export const getConfig = async () => {
  return { render: "dynamic" } as const;
};
