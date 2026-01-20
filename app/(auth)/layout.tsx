import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  // If user is already logged in, redirect to workspace
  if (data.user) {
    redirect("/paths");
  }

  return <>{children}</>;
}

