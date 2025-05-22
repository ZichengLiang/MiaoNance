export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="relative w-full p-6 flex items-center text-center">
      <p className="w-full">My Post uuid: {id} <br/>(Notebook page will appear here)</p>
    </div>
  );
}
