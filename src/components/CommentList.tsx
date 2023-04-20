import React, { useState, useEffect } from 'react';
import styles from '../styles/Article.module.css';

interface CommentListProps {
  comments: {
    _id: string;
    email: string;
    content: string;
    id_notice: string;
    likes: number;
    createdAt: string;
    __v: number;
  }[];
  id: string; // new prop for the URL id
}

const CommentList: React.FC<CommentListProps> = ({ comments, postId }) => {
  const [likes, setLikes] = useState<number>(0); // estado para guardar o valor de likes

  useEffect(() => {
    // Carrega o valor inicial de likes
    const commentLikes = comments.data.filter((comment) => comment.id_notice === postId)[0]?.likes;
    if (commentLikes) {
      setLikes(commentLikes);
    }
  }, []);

  const handleLike = async (id) => {
    
    try {
      const response = await fetch(`/api/posts/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id:id })
      });
      const data = await response.json();
      console.log(id)
      if (data.success) {
        setLikes((prevLikes) => prevLikes + 1); // atualiza o estado de likes
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.comment_list}>
      {comments.data.filter((comment) => comment.id_notice === postId).map((comment) => (
        <div key={comment._id} className={styles.comment_item}>
          <p>
            <strong>{comment.email}</strong>
          </p>
          <p>{comment.content}</p>
          <div className={styles.like_button}>
            <button onClick={() => handleLike(comment._id)}>{comment.likes} likes</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;