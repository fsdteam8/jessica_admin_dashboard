// app/(your-folder)/edit/[id]/page.tsx
'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import EditDocument from '../../_components/EditDocument';

const Page = () => {
  const { id } = useParams();

  if (!id || typeof id !== 'string') return <div>Invalid document ID</div>;

  return (
    <div className="p-4">
      <EditDocument id={id} />
    </div>
  );
};

export default Page;
