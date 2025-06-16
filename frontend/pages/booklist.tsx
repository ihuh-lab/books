import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  published_date: string;
  isbn: string;
  description: string;
  [key: string]: any; // 예외 처리 (추가 필드용)
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/book')
      .then((res) => res.json())
      .then((data: Book[]) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching books:', err);
        setLoading(false);
      });
  }, []);

  const cell: React.CSSProperties = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left'
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>도서 목록</h1>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/bookform">
          <button>등록</button>
        </Link>
      </div>
      {loading ? (
        <p>불러오는 중...</p>
      ) : books.length === 0 ? (
        <p>도서가 없습니다.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={cell}>ID</th>
              <th style={cell}>제목</th>
              <th style={cell}>저자</th>
              <th style={cell}>출판사</th>
              <th style={cell}>출판일</th>
              <th style={cell}>ISBN</th>
              <th style={cell}>설명</th>
              <th style={cell}>작업</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book: Book) => (
              <tr key={book.id}>
                <td style={cell}>{book.id}</td>
                <td style={cell}>{book.title}</td>
                <td style={cell}>{book.author}</td>
                <td style={cell}>{book.publisher}</td>
                <td style={cell}>{book.published_date}</td>
                <td style={cell}>{book.isbn}</td>
                <td style={cell}>{book.description}</td>
                <td style={cell}>
                  <Link href={`/view?id=${book.id}`}><button>보기</button></Link>{' '}
                  <Link href={`/edit?id=${book.id}`}><button>수정</button></Link>{' '}
                  <Link href={`/delete?id=${book.id}`}><button>삭제</button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

