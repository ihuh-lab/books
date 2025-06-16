import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  published_date: string;
  isbn: string;
  category: string;
  price: string;
  pages: string;
  language: string;
  description: string;
  description2: string;
  quantity: string;
}

export default function BookView() {
  const [book, setBook] = useState<Book | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/book?id=${id}`)
        .then(res => res.json())
        .then((data: Book) => {
          if (data && data.id) setBook(data);
        });
    }
  }, [id]);

  if (!book) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <p>도서를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>도서 정보</h1>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/booklist"><button>목록으로</button></Link>
      </div>
      <p><strong>ID:</strong> {book.id}</p>
      <p><strong>책명:</strong> {book.title}</p>
      <p><strong>저자:</strong> {book.author}</p>
      <p><strong>출판사:</strong> {book.publisher}</p>
      <p><strong>출판일:</strong> {book.published_date}</p>
      <p><strong>ISBN:</strong> {book.isbn}</p>
      <p><strong>분류:</strong> {book.category}</p>
      <p><strong>가격:</strong> {book.price}</p>
      <p><strong>페이지 수:</strong> {book.pages}</p>
      <p><strong>언어:</strong> {book.language}</p>
      <p><strong>수량:</strong> {book.quantity}</p>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
        <div style={{ flex: 1 }}>
          <p><strong>설명:</strong></p>
          <div style={{ whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '1rem' }}>{book.description}</div>
        </div>
        <div style={{ flex: 1 }}>
          <p><strong>상세설명:</strong></p>
          <div style={{ whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '1rem' }}>{book.description2}</div>
        </div>
      </div>
    </div>
  );
}

