import React, { useState, useEffect, ChangeEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
import TextCard from '../textcard/TextCard';
import styles from './styles.module.css'
import Scrollbar from '../scrollbar/Scrollbar';

interface Text {
  _id: string;
  text: string;
  description: string;
  date: string;
  value: Float32Array;
}

const TextForm: React.FC = () => {
  const [text, setText] = useState('');
  const [texts, setTexts] = useState<Text[]>([]);

  useEffect(() => {
    // Fetch existing texts from the server on component mount
    axios.get<Text[]>('http://localhost:3001/devs').then((response: AxiosResponse<Text[]>) => {
      setTexts(response.data);
    });
  }, []);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const RemoveText = (_id: string) => {
    // Send a DELETE request to remove a text
    axios
      .delete(`http://localhost:3001/deleteDev/${_id}`)
      .then(() => {
        // Remove the deleted text from the state
        setTexts(texts.filter((textItem) => textItem._id !== _id));
      })
      .catch((error) => {
        console.error("Error deleting text:", error);
      });
  };

  const handleSubmit = () => {
    // Send a POST request to add a new text
    axios
      .post<Text>('http://localhost:3001/addDev', { text })
      .then((response: AxiosResponse<Text>) => {
        // Add the new text to the state
        setTexts([...texts, response.data]);
        setText('');
      })
      .catch((error) => {
        console.error("Error adding text:", error);
      });
  };

  return (
    <div>
      <Scrollbar/>
      <div className={styles.Form}>
        <input type="text" placeholder="text" value={text} onChange={handleTextChange} />
        <button onClick={handleSubmit}>Add</button>
      </div>
      <div className={styles.texts}>
        {texts.map((textItem: Text) => (
          <TextCard key={textItem._id}>
            <h1>text: {textItem.text}</h1>
            <button onClick={() => RemoveText(textItem._id)} className={styles.RemoveButton}>Remove</button>
          </TextCard>
        ))}
      </div>
    </div>
  );
};

export default TextForm;