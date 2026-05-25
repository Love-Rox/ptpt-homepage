import BlogIndexView from "@/components/views/blog-index";

export default async function Page() {
  return <BlogIndexView locale="en" />;
}

export const getConfig = async () => ({ render: "dynamic" }) as const;
