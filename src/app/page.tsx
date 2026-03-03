import { getContent } from "@/lib/content";
import { HomePage } from "./home-page";

export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getContent();
  return <HomePage content={content} />;
}
