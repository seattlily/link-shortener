import { redirect } from "next/navigation";
import { db } from "~/server/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const link = await db.link.findUnique({ where: { slug } });

  if (!link) redirect("/");

  await db.link.update({
    where: { slug },
    data: { clicks: { increment: 1 } },
  });

  redirect(link.url);
}
