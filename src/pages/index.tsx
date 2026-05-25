export default async function Page() {
  return <main>PTPT_ISOLATION_TEST_OK — if this text is server-rendered, RSC works.</main>;
}

export const getConfig = async () => ({ render: "static" }) as const;
