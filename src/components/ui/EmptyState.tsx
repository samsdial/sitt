type Props = { title: string; description?: string };
export function EmptyState({ title, description }: Props) {
  return (
    <div className="text-center text-gray-500 my-10">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {description && <p className="mt-2">{description}</p>}
    </div>
  );
}
