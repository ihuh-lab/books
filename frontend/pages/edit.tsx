import React, { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BookFormData {
  id: string;
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
}

export default function EditBook() {
  const [form, setForm] = useState<BookFormData>({
    id: '',
    title: '',
    author: '',
    publisher: '',
    published_date: '',
    isbn: '',
    category: '',
    price: '',
    pages: '',
    language: '',
    description: '',
    description2: ''
  });

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/book?id=${id}`)
        .then(res => res.json())
        .then((data: BookFormData) => {
          if (data && data.id) {
            setForm({
              ...data,
              published_date: data.published_date || new Date().toISOString().split('T')[0]
            });
          }
        });
    }
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert('책명이 없습니다.');
      return;
    }
    if (!form.author.trim()) {
      alert('저자가 없습니다.');
      return;
    }

    const payload = {
      ...form,
      published_date: form.published_date?.trim()
        ? form.published_date
        : new Date().toISOString().split('T')[0]
    };

    const res = await fetch('/api/book', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      router.push('/booklist');
    } else {
      alert('수정 실패');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>도서 수정</h1>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/booklist"><button>목록으로</button></Link>
      </div>
      <div><label><span style={{ color: 'red' }}>*</span>ID: </label>{form.id}</div>
      <div><label><span style={{ color: 'red' }}>*</span>책명: </label><input name="title" value={form.title} onChange={handleChange} /></div>
      <div><label><span style={{ color: 'red' }}>*</span>저자: </label><input name="author" value={form.author} onChange={handleChange} /></div>
      <div><label>출판사: </label><input name="publisher" value={form.publisher} onChange={handleChange} /></div>
      <div><label><span style={{ color: 'red' }}>*</span>출판일: </label><input type="date" name="published_date" value={form.published_date} onChange={handleChange} /></div>
      <div><label>ISBN: </label><input name="isbn" value={form.isbn} onChange={handleChange} /></div>
      <div><label>분류: </label><input name="category" value={form.category} onChange={handleChange} /></div>
      <div><label>가격: </label><input name="price" value={form.price} onChange={handleChange} /></div>
      <div><label>페이지 수: </label><input name="pages" value={form.pages} onChange={handleChange} /></div>
      <div><label>언어: </label><input name="language" value={form.language} onChange={handleChange} /></div>
      <div>
        <label>설명:</label><br />
        <textarea name="description" rows={4} cols={60} value={form.description} onChange={handleChange} />
      </div>
      <div>
        <label>상세설명:</label><br />
        <textarea name="description2" rows={6} cols={60} value={form.description2} onChange={handleChange} />
      </div>
      <button onClick={handleSubmit}>수정</button>
    </div>
  );
}

