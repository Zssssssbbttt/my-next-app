"use client";

import styles from "./CommentList.module.css";
import { useState } from "react";
import { deleteComment } from "../actions";

interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
}

export default function CommentList({
  comments,
  postId,
}: {
  comments: Comment[];
  postId: string;
}) {
  const [isDeleting, setDeleting] = useState(false);

  const handleDelete = async (commentId: string) => {


    if (!confirm("确定要删除这条评论吗？")) {
      return;
    }

    setDeleting(commentId);

    const formData = new FormData();
    formData.append("commentId", commentId);
    formData.append("postId", postId);

    await deleteComment({ formData });
    setDeleting(null);
  };

  if (comments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>暂无评论，快来添加一条吧......</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>评论 {comments.length}</h3>

      <div className={styles.list}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentHeader}>
              <div>
                <strong className={styles.author}>{comment.author}</strong>
                <span className={styles.email}>{comment.email}</span>
              </div>

              <div className={styles.commentActions}>
                <span className={styles.date}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>

                <button
                  onClick={() => handleDelete(comment.id)}
                  className={styles.deleteBtn}
                  disabled={isDeleting === comment.id}
                >
                  {isDeleting === comment.id ? "删除中..." : "删除"}
                </button>
              </div>
            </div>

            <p className={styles.content}>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
