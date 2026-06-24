import { Button } from "@/components/ui/button";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type ConnectionStatus =
  | { state: "not-configured" }
  | { state: "connected"; message: string }
  | { state: "error"; message: string };

async function checkSupabase(): Promise<ConnectionStatus> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { state: "not-configured" };
  }

  const { data, error } = await supabase
    .from("health_check")
    .select("message")
    .eq("id", 1)
    .single();

  if (error || !data) {
    return { state: "error", message: error?.message ?? "No health_check row found." };
  }

  return { state: "connected", message: data.message };
}

function StatusCard({ status }: { status: ConnectionStatus }) {
  const meta = {
    "not-configured": {
      dot: "bg-amber-500",
      title: "Waiting for Supabase",
      detail: "Add your project URL and anon key to .env.local, then reload.",
    },
    connected: {
      dot: "bg-emerald-500",
      title: "Supabase connected",
      detail: status.state === "connected" ? status.message : "",
    },
    error: {
      dot: "bg-red-500",
      title: "Supabase error",
      detail: status.state === "error" ? status.message : "",
    },
  }[status.state];

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left">
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} />
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-card-foreground">{meta.title}</p>
        {meta.detail ? (
          <p className="text-sm text-muted-foreground break-words">{meta.detail}</p>
        ) : null}
      </div>
    </div>
  );
}

export default async function Home() {
  const status = await checkSupabase();

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            M1 · pipeline check
          </p>
          <h1 className="text-5xl font-semibold tracking-tight">Please</h1>
          <p className="text-balance text-lg text-muted-foreground">
            Structured community feedback — turn scattered requests into votable
            Issues &amp; Solutions.
          </p>
        </div>

        <StatusCard status={status} />

        <div className="flex justify-center">
          <Button disabled>Browse Spaces — coming soon</Button>
        </div>
      </div>
    </main>
  );
}
