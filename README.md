# Холбоо – суулгах заавар
1. supabase.com дээр бүртгүүлж шинэ project үүсгэнэ.
2. Supabase → SQL Editor → `supabase/schema.sql`-ийн агуулгыг хуулж Run дарна.
3. Supabase → Project Settings → API: URL болон anon key-г хуулна.
4. `.env.example`-ийг `.env.local` болгон нэрийг нь солиод 2 утгаа бөглөнө.
5. Компьютер дээрээ: `npm install` дараа нь `npm run dev` → http://localhost:3000
6. Зар батлах: Supabase → Table Editor → jobs → `approved` талбарыг true болгоно.
7. Нийтлэх: GitHub-д байршуулж, vercel.com дээр Import хийж, 2 утгыг Environment Variables-д оруулна.

## Netlify дээр нийтлэх бол
Файл чирж оруулахын оронд GitHub-тай холбож (Add new site → Import from Git) нийтэлнэ.
Site configuration → Environment variables хэсэгт `NEXT_PUBLIC_SUPABASE_URL` болон `NEXT_PUBLIC_SUPABASE_ANON_KEY`-г нэмээд Deploy дахин ажиллуулна.
