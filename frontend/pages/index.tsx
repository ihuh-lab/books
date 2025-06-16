import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/booklist'); // URL 경로 변경 없이 리디렉션
  }, [router]);

  return null; // 화면에 아무것도 표시하지 않음
}
