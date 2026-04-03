type DocumentPreviewPageProps = {
  params: {
    id: string;
  };
};

export default function DocumentPreviewPage({
  params,
}: DocumentPreviewPageProps) {
  return (
    <main>
      <h1>Preview {params.id}</h1>
      <p>Use this route for PDF and image preview experiences.</p>
    </main>
  );
}
