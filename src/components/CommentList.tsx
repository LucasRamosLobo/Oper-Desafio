import React, { useState, useEffect } from 'react';
import styles from '../styles/Coments.module.css';

interface CommentListProps {
  comments: object
  postId: string;
  response:object 
}

const CommentList: React.FC<CommentListProps> = ({ comments, postId, response }) => {
  const [commentList, setCommentList] = useState(comments.data); 
  const [replyCommentId, setReplyCommentId] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(""); 
  const [responsesList, setResponsesList] = useState(response);
  

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
        const updatedResponses = commentList.map(comment => {
          if (comment._id === id) {
            return { ...comment, likes: comment.likes + 1 };
          } else {
            return comment;
          }
        });
        setCommentList(updatedResponses); // atualiza a lista de comentários
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
  const handleLike2 = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/responses/`, { // PUT request to update the likes of a response
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      const data = await response.json();
      if (data.success) {
        const updatedResponses = responsesList.data.map(response => {
          if (response._id === id) {
            return { ...response, likes: response.likes + 1 };
          } else {
            return response;
          }
        });
        setResponsesList({ data: updatedResponses }); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredComments = comments.data.filter(comment => comment.id_notice === postId);

  return (
    <>
      <div className={styles.comment_list}>
        {filteredComments.map((comment) => {
          const likesUpdated = commentList.filter(comment2 => comment2.id_notice === postId && comment2._id === comment._id);
          
          return (
            <div key={comment._id} className={styles.comment_item}>
              <p>
                <strong>{comment.email}</strong>
              </p>
              <p>{comment.content}</p>
              <span>{comment.createdAt}</span>
              <div>
                {likesUpdated.map((comment2) => (
                  <button className={`${styles.like_button} ${comment2.isLiked ? 'clicked' : ''}`} onClick={() => handleLike(comment2._id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart">
                    <path d="M20.84 4.83a5.5 5.5 0 0 0-7.78 0L12 5.68l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.78l8.84-8.83a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {comment2.likes}
                </button>
                ))}
                <button className={styles.reply_button} onClick={() => handleReply(comment._id)}>
                  Reply
                </button>
              </div>
              {showReplyForm === comment._id && (
                <form onSubmit={submitReplyComment}>
                  <label htmlFor="email" className={styles.form_label}>
                    Email:
                  </label>
                  <input className={styles.form_input} type="email" name="email" placeholder="Email" />
                  <label htmlFor="comment" className={styles.form_label}>
                    Reply:
                  </label>
                  <textarea className={styles.form_textarea} name="content" placeholder="Content"></textarea>
                  <button className={styles.like_button} type="submit">
                    Submit
                  </button>
                </form>
              )}
              <p>Respostas:</p>
              {/* Filtra as respostas correspondentes ao comentário atual */}
              {responsesList.data
                .filter((response) => response.commentId === comment._id)
                .map((response) => (
                  <div key={response._id} className={styles.comment_item}>
                    <p>{response.email}</p>
                    <p>{response.content}</p>
                    <span>{response.createdAt}</span><br></br>
                    <button className={styles.like_button} onClick={() => handleLike2(response._id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart">
                    <path d="M20.84 4.83a5.5 5.5 0 0 0-7.78 0L12 5.68l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.78l8.84-8.83a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                    {response.likes}
                  </button>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </>
  );
  };
    
export default CommentList;