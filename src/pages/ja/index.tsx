import LandingView from "@/components/views/landing";

export default async function Page() {
  return <LandingView locale="ja" />;
}

export const getConfig = async () => ({ render: "static" }) as const;
