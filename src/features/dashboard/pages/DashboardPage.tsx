import { useMe } from "@/features/auth";

export function DashboardPage() {
  const { data: user } = useMe();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome{user ? `, ${user.first_name}` : ""}!
        </h2>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of the Sound of Hope Foundation platform.
        </p>
      </div>

      {/* Placeholder stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Participants", value: "—" },
          { label: "Active Programmes", value: "—" },
          { label: "Staff Members", value: "—" },
          { label: "Upcoming Events", value: "—" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border bg-card p-5 shadow-sm space-y-1"
          >
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
