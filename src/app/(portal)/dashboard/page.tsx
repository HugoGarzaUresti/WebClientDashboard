export default function DashboardPage() {
    async function uploadFile(formData: FormData) {
    'use server'
    const file = formData.get('myFile') as File
    
    if (!file) return
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    console.log(`Uploaded: ${file.name}`)

    type Inputs = {
        ownerId: string;
        displayName: string;
        contentType: string;
        storageKey: string;
        originalFilename?: string;
        size?: number;
    };
    
      async function handleDocumentUpload(data: Inputs) {
        console.log(data);
        const res = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.status === 200 || res.status == 201) console.log("Document created");
        else {
          const body = await res.json();
        }
      }
    
  }

  return (
    <form action={uploadFile}>
      <input type="file" name="myFile" />
      <button type="submit">Upload</button>
    </form>
  )
}

