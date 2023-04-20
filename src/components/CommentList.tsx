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
  const [commentList, setCommentList] = useState(comments.data); // estado para guardar a lista de comentários atualizada

  useEffect(() => {
    // Carrega a lista de comentários inicial
    setCommentList(comments.data);
  }, []);

  const handleLike = async (id) => {
    try {
      const response = await fetch(`/api/posts/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id: id })
      });
      const data = await response.json();
      if (data.success) {
        // Atualiza o número de curtidas no objeto de comentário correspondente
        const updatedComments = commentList.map(comment => {
          if (comment._id === id) {
            return { ...comment, likes: comment.likes + 1 };
          } else {
            return comment;
          }
        });
        setCommentList(updatedComments); // atualiza a lista de comentários
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.comment_list}>
      {commentList.filter((comment) => comment.id_notice === postId).map((comment) => (
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