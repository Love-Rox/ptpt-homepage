import type { PageProps } from "waku/router";
import BlogPostView from "@/components/views/blog-post";

export default async function Page({ slug }: PageProps<"/blog/[slug]">) {
  return <BlogPostView locale="en" slug={slug} />;
}

export const getConfig = async () => ({ render: "dynamic" }) as const;
