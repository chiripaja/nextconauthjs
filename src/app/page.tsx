
import { auth, signOut } from "@/auth";
import { LogoutBtn } from "@/components";

export default async function Home() {
  const session = await auth();
  if (!session) {
    return <div>Not authenticated</div>;
  }
  return (
    <div className="container">
    <pre>{JSON.stringify(session, null, 2)}</pre>
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  </div>
  );
}
