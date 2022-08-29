import type { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import document from 'next/document';
import styles from '../styles/Home.module.css';



const Home: NextPage = () => {
  const router = useRouter();

  /**
   * Application get roomId from latest path section
   */
  const createRoom = () => {
    // Do not use the symbol "_" in room address
    router.push(`/room-${new Date().getTime()}?uid=1` );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button type="button" onClick={createRoom}>
        Create room
      </button>
    </div>
  );
};

export default Home;
