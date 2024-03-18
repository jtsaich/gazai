'use client';

import { useEffect, useState } from 'react';

import InfiniteScrollCard from './_components/infinite-scroll-card';


type Image = {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
  links: {
    html: string;
  };
};

export default function IndexPage() {
  const [images, setImages] = useState<Image[]>([]);
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
    setImages((prev: Image[]) => [...prev, ...results]);
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  return (
    <main className="p-12 lg:px-20">
      <h1 className="text-4xl font-bold mb-4">Start making art!</h1>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image: Image, index: number) => (
          <InfiniteScrollCard
            key={image.id}
            imgSrc={image.urls.regular}
            imgAlt={image.alt_description}
            shotBy={image.user.name}
            isLast={index === images.length - 1}
            newLimit={() => setPage(page + 1)}
          />
        ))}
      </div>
    </main>
  );
}
