import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function DeleteBook() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState<string>('삭제 중...');

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    fetch(`/api/book?id=${id}`, {
      method: 'DELETE'
    })
      .then((res) => res.json())
      .then((data: { message?: string }) => {
        if (data.message) {
          setMessage('삭제 완료되었습니다.');
          setTimeout(() => {
            router.push('/booklist');
          }, 1500);
        } else {
          setMessage('삭제에 실패했습니다.');
        }
      })
      .catch((err) => {
        console.error('삭제 중 오류 발생:', err);
        setMessage('삭제 중 오류 발생.');
      });
  }, [id]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>도서 삭제</h1>
      <p>{message}</p>
    </div>
  );
}

