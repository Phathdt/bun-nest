export function MutationError({ error }: { error: Error | null }) {
  if (!error) {
    return null;
  }

  return (
    <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error.message}</p>
  );
}
