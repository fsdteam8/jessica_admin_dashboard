"use client";

import { useParams } from "next/navigation";
import Editcontent from "./_components/editcontent";

export default function Page() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) {
    return <div>Id param is missing</div>;
  }

  return (
    <div>
      <Editcontent id={id} />
    </div>
  );
}
