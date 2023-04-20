import React, { useState, useEffect } from 'react';
import styles from '../styles/Coments.module.css';

interface CommentListProps {
  comments: object
  postId: string;
  response:object // new prop for the URL id
}

const CommentList: React.FC<CommentListProps> = ({ comments, postId, response }) => {
  const [commentList, setCommentList] = useState(comments.data); // estado para guardar a lista de comentários atualizada
  const [replyCommentId, setReplyCommentId] = useState(""); // estado para guardar o ID do comentário que está sendo respondido
  const [showReplyForm, setShowReplyForm] = useState(""); // estado para mostrar ou ocultar o formulário de resposta
  const [responsesList, setResponsesList] = useState(response)

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

  const handleReply = (id) => {
    setReplyCommentId(id);
    setShowReplyForm(id);
  };

  const submitReplyComment = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const content = event.target.content.value;
    try {
      const response = await fetch('http://localhost:3000/api/posts/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, content, commentId: replyCommentId })
      });
      const data = await response.json();
      if (data.success) {
        const updatedResponses = [...responsesList.data, { ...data.data }]; // adiciona a nova resposta na lista de respostas
        setResponsesList({ data: updatedResponses }); // atualiza a lista de respostas
        const updatedComments = commentList.map(comment => { // atualiza a lista de comentários, adicionando a nova resposta ao comentário correspondente
          if (comment._id === replyCommentId) {
            return { ...comment, responses: [ data.data._id] };
          } else {
            return comment;
          }
        });
        setCommentList(updatedComments);
        setShowReplyForm(""); // oculta o formulário de resposta
      } else {
        console.error(data.error);
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
            <div>
              <button className={styles.like_button} onClick={() => handleLike(comment._id)}>{comment.likes} Likes</button>
              <button className={styles.like_button}  onClick={() => handleReply(comment._id)}>Reply</button>
            </div>
            {showReplyForm === comment._id && (
              <form onSubmit={submitReplyComment}>
                <input type="email" name="email" placeholder="Email" />
                <textarea name="content" placeholder="Content"></textarea>
                <button type="submit">Submit</button>
              </form>
            )}
            <p>Respostas:</p>
            {/* Filtra as respostas correspondentes ao comentário atual */}
            {responsesList.data.filter((response) => response.commentId === comment._id).map((response) => (
              <div key={response._id} className={styles.comment_item}>
                <p>
                  {response.email}
                </p>
                <p>{response.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
    
export default CommentList;