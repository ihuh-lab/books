import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BookFormData {
  id: number;
  title: string;
  author: string;
  publisher: string;
  published_date: string;
  isbn: string;
  description: string;
  description2: string;
  category: string;
  price: string;
  pages: string;
  language: string;
}

interface Book {
  id: number;
  [key: string]: any;
}

export default function BookForm() {
  const [form, setForm] = useState<BookFormData>({
    id: 0,
    title: '',
    author: '',
    publisher: '',
    published_date: '',
    isbn: '',
    description: '',
    description2: '',
    category: '',
    price: '',
    pages: '',
    language: ''
  });

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/book?id=${id}`)
        .then(res => res.json())
        .then((data: Book) => {
          if (data && data.id) {
            setForm({
              id: data.id,
              title: data.title || '',
              author: data.author || '',
              publisher: data.publisher || '',
              published_date: data.published_date || '',
              isbn: data.isbn || '',
              description: data.description || '',
              description2: data.description2 || '',
              category: data.category || '',
              price: data.price?.toString() || '',
              pages: data.pages?.toString() || '',
              language: data.language || ''
            });
          }
        });
    } else {
      fetch('/api/book')
        .then(res => res.json())
        .then((data: Book[]) => {
          const usedIds = new Set(data.map(book => book.id));
          let minFreeId = 1;
          while (usedIds.has(minFreeId)) minFreeId++;
          setForm(prev => ({ ...prev, id: minFreeId }));
        });
    }
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert('책명이 없습니다.');
      return;
    }
    if (!form.author.trim()) {
      alert('저자가 없습니다.');
      return;
    }

    const now = new Date().toISOString().split('T')[0];

    const payload = {
      ...form,
      published_date: form.published_date || now,
      price: form.price || 0,
      pages: form.pages || 0,
      description: form.description || '',
      description2: form.description2 || '',
      category: form.category || '',
      language: form.language || ''
    };

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.id) {
        alert('등록되었습니다.');
        setForm({
          id: form.id + 1,
          title: '',
          author: '',
          publisher: '',
          published_date: '',
          isbn: '',
          description: '',
          description2: '',
          category: '',
          price: '',
          pages: '',
          language: ''
        });
      }
    } catch (err) {
      console.error('등록 중 오류:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>도서 등록</h1>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/booklist"><button>목록으로</button></Link>
      </div>
      <form onSubmit={handleSubmit}>
        <label>ID<span style={{ color: 'red' }}>*</span>: <input type="text" value={form.id} disabled readOnly style={{ backgroundColor: '#f0f0f0' }} /></label><br /><br />
        <label>책명<span style={{ color: 'red' }}>*</span>: <input type="text" name="title" value={form.title} onChange={handleChange} /></label><br /><br />
        <label>저자<span style={{ color: 'red' }}>*</span>: <input type="text" name="author" value={form.author} onChange={handleChange} /></label><br /><br />
        <label>출판사: <input type="text" name="publisher" value={form.publisher} onChange={handleChange} /></label><br /><br />
        <label>출판일: <input type="date" name="published_date" value={form.published_date} onChange={handleChange} /></label><br /><br />
        <label>ISBN: <input type="text" name="isbn" value={form.isbn} onChange={handleChange} /></label><br /><br />
        <label>분류: <input type="text" name="category" value={form.category} onChange={handleChange} /></label><br /><br />
        <label>가격: <input type="number" name="price" value={form.price} onChange={handleChange} /></label><br /><br />
        <label>페이지 수: <input type="number" name="pages" value={form.pages} onChange={handleChange} /></label><br /><br />
        <label>언어: <input type="text" name="language" value={form.language} onChange={handleChange} /></label><br /><br />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ flex: 1 }}>설명:<br /><textarea name="description" rows={4} style={{ width: '100%' }} value={form.description} onChange={handleChange} /></label>
          <label style={{ flex: 1 }}>상세설명:<br /><textarea name="description2" rows={6} style={{ width: '100%' }} value={form.description2} onChange={handleChange} /></label>
        </div><br />
        <button type="submit">등록</button>
      </form>
    </div>
  );
}

