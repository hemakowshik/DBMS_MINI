import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>IPOWatch Intelligence | Next.js Terminal (MARK4)</title>
        <meta name="description" content="DBMS Level 3 Next.js Terminal - Polyglot RDBMS, NoSQL, and Vector DB" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
