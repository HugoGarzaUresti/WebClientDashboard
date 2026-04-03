type DocumentPageProps = {
  params: {
    id: string;
  };
};

export default function DocumentPage({ params }: DocumentPageProps) {
  return (
    <main>
      <h1>Document {params.id}</h1>
      <p>Document metadata, actions, and history can be rendered here.</p>
    </main>
  );
}
