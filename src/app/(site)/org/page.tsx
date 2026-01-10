import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/domains/user/db";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await getCurrentUser();
  
  if (user?.organisationId) {
    redirect(`/org/${user.organisationId}`);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p className="text-muted-foreground mt-2">
        You are not part of an organisation yet.
      </p>
    </div>
  );
}
