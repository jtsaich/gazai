'use client';

import LogoutButton from '@/components/auth/logout-button';
import InfiniteScrollCard from './_components/infinite-scroll-card';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/20/solid';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function IndexPage() {
  const [images, setImages] = useState<any>([]);
  const [page, setPage] = useState(1);

  const fetchImages = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_UNSPLASH_BASE_URL}?query=anime&page=${page}`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    const { results } = await response.json();
    setImages((prev: any) => [...prev, ...results]);
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  return (
    <main className="p-12 lg:px-20">
      <h1 className="text-4xl font-bold mb-4">Start making art!</h1>

      <div className="flex overflow-hidden rounded-md gap-4">
        <Link className="btn btn-primary" href="/text-to-image">
          Image Generation
        </Link>
        <Link className="btn btn-primary" href="/sketch-to-image">
          Magic Paint
        </Link>
        <LogoutButton>
          <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
          Logout
        </LogoutButton>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image: any, index: number) => (
          <InfiniteScrollCard
            key={image.id}
            imgSrc={image.urls.regular}
            imgAlt={image.alt_description}
            shotBy={image.user.name}
            creditUrl={image.links.html}
            isLast={index === images.length - 1}
            newLimit={() => setPage(page + 1)}
          />
        ))}
      </div>
    </main>
  );
}
