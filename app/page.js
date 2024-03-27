"use client"

import styles from "./page.module.css";
import { useState } from 'react';

export default function Home() {
  const [fileName, setFileName] = useState('');
  const [fileTypeError, setFileTypeError] = useState(false);
  const [chatLog, setChatLog] = useState('');
  const [userWordCounts, setUserWordCounts] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.name.endsWith('.txt')) {
        setFileName(file.name);
        setFileTypeError(false);
        const reader = new FileReader();
        reader.onload = (e) => {
            setChatLog(e.target.result);
            setFileTypeError(false);
        };
        reader.readAsText(file);
      } else {
          setFileName('');
          setFileTypeError(true);
      }
    } else {
        setFileName('');
    }
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.name.endsWith('.txt')) {
        setFileName(file.name);
        setFileTypeError(false);
        const reader = new FileReader();
        reader.onload = (e) => {
            setChatLog(e.target.result);
            setFileTypeError(false);
        };
        reader.readAsText(file);
    } else {
        setFileName('');
        setFileTypeError(true);
    }
    } else {
        setFileName('');
    }
};

const parseChatLog = () => {
  const wordCounts = {};
  const lines = chatLog.trim().split('\n');

  lines.forEach(line => {
      const matches = line.match(/<([^>]+)>(.+)/);
      if (matches && matches.length === 3) {
          const user = matches[1];
          const message = matches[2].trim();
          const words = message.split(/\s+/);
          const wordCount = words.length;

          if (user in wordCounts) {
            wordCounts[user] += wordCount;
          } else {
            wordCounts[user] = wordCount;
          }
      }
  });

  // Sort
  const sortedWordCounts = Object.fromEntries(
    Object.entries(userWordCounts).sort(([, countA], [, countB]) => countB - countA)
  );

  setUserWordCounts(sortedWordCounts);
};

  return (
    <main>
      <h1 style={{ margin: '1rem', textAlign: 'center' }}>Log file reader</h1>
      <div className={styles.main}>
        <div className={styles.gridContainer}>
          <div className={styles.grid1}>
            <h3>Upload a log file (.txt)</h3>
            <div className={styles.container} onDragOver={handleDragOver} onDrop={handleDrop}>
                <input type="file" id="file-input" accept=".txt" className={styles['file-input']} onChange={handleFileChange} />
                <label className={styles['file-label']} htmlFor="file-input">Click or Drag and drop your file here</label>
            </div>
            {fileTypeError && <p style={{ color: 'red' }}>Only .txt file allowed for upload</p>}
            {fileName && (<div className={styles.uploadedFile}>
              <p>Uploaded File: {fileName}</p>
              <button className={styles['file-label']} onClick={parseChatLog} disabled={!chatLog}>Parse</button>
            </div>
            )}

          </div>
          <div className={styles.grid2}>
            <h3>Results</h3>
            <div className={styles.resultsContainer}>
              {userWordCounts ? (
                  <div>
                      <ul>
                          {Object.keys(userWordCounts).map(user => (
                              <li key={user}>{user} - {userWordCounts[user]} words</li>
                          ))}
                      </ul>
                  </div>
              ) : <></>}
          </div>
          </div>
        </div>
      </div>

    </main>
  );
}
