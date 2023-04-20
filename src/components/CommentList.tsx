import React from 'react';
import styles from '../styles/Article.module.css';

interface CommentListProps {
  comments: {
    _id: string;
    email: string;
    content: string;
    id_notice: string;
    createdAt: string;
    __v: number;
  }[];
  id: string; // new prop for the URL id
}

const CommentList: React.FC<CommentListProps> = ({ comments, postId }) => {

  const filteredComments = comments.data.filter(comment => comment.id_notice === postId);

  return (
    <div className={styles.comment_list}>
      {filteredComments.map((comment) => (
        <div key={comment._id} className={styles.comment_item}>
          <p>
            <strong>{comment.email}</strong>
          </p>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;