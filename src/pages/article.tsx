import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Article.module.css";
import Header from "../components/Nav";
import CommentList from '../components/CommentList';

interface Comment {
  likes: number;
  id: number;
  id_notice: string;
  email: string;
  content: string;
}

interface Response {
  id: number;
  post: number;
  email: string;
  content: string;
}

interface ArticleProps {
  id: number;
  title: string;
  content: string;
  comments: Comment[];
  responses: Response[];
  author: string;
}

const Article: NextPage<ArticleProps> = ({ id, title, content, author, comments, responses }) => {
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState(comments);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const response = await fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        content: comment,
        id_notice: id,
      }),
    });
  
    const data = await response.json();
    console.log(data);
  
    // Limpar os campos de email e comentário após enviar o post
    setEmail("");
    setComment("");
    
    // Atualizar a lista de comentários
    const res = await fetch(`http://localhost:3000/api/posts`);
    const newComments = await res.json();
    setCommentList(newComments);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        <p>{author}</p>
        <p className={styles.comment}>{content}</p>
        <h2 className={styles.h2}>Comentários:</h2>
        <CommentList comments={commentList} postId={id} response={responses} likes={commentList.data.likes} />
        <h2 className={styles.h2}>Adicionar comentário:</h2>
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="email" className={styles.form_label}>Email:</label>
            <input
              type="email"
              id="email"
              className={styles.form_input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="comment" className={styles.form_label}>Comentário:</label>
            <textarea
              id="comment"
              className={styles.form_textarea}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>
          <button type="submit" className={styles.button}>Enviar</button>
        </form>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ArticleProps> = async ({
  query,
}) => {
  const id = query.id as string;
  const [articleRes, commentsRes, resComments] = await Promise.all([
    fetch(`https://news-api.lublot.dev/api/posts/${id}`),
    fetch(`http://localhost:3000/api/posts`),
    fetch('http://localhost:3000/api/posts/responses'),
  ]);
  const article = await articleRes.json();
  const comments = await commentsRes.json();
  const responses = await resComments.json();

  return {
    props: {
      id: article.id,
      title: article.title,
      content: article.content,
      author: article.author,
      comments,
      responses,
    },
  };
};

export default Article;