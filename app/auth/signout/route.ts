import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Verify if a user is currently logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // This securely clears the auth cookies
    await supabase.auth.signOut();
  }

  // Clear the router cache so protected pages don't show stale data
  revalidatePath("/", "layout");

  // Redirect the user back to the login portal
  return NextResponse.redirect(new URL("/login", req.url), {
    status: 302,
  });
}
