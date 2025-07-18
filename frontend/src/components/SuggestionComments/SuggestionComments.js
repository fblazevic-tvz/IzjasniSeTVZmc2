import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import CommentItem from "../CommentItem/CommentItem";
import { useAuth } from "../../context/AuthContext";
import { createComment } from "../../services/commentService";
import "./SuggestionComments.css";
import { Link, useLocation } from 'react-router-dom';

function SuggestionComments({ suggestionId, initialComments = [] }) {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const location = useLocation();

  useEffect(() => {
    const sortedInitial = [...initialComments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setComments(sortedInitial);
  }, [initialComments]);

  const handleNewCommentChange = (event) => {
    setNewCommentContent(event.target.value);
    setSubmitError("");
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!newCommentContent.trim()) {
      setSubmitError("Komentar ne može biti prazan.");
      return;
    }
    if (!suggestionId || !isAuthenticated) {
      setSubmitError("Dogodila se greška. Molimo osvježite stranicu.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const commentData = {
        content: newCommentContent.trim(),
        suggestionId: suggestionId,
        parentCommentId: null,
      };
      const createdComment = await createComment(commentData);
      setComments((prevComments) =>
        [createdComment, ...prevComments].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
      setNewCommentContent("");
    } catch (err) {
      setSubmitError(err.message || "Slanje komentara nije uspjelo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentUpdated = useCallback((updatedComment) => {
    const updateRecursively = (commentsArray) => {
      return commentsArray.map((c) => {
        if (c.id === updatedComment.id) {
          return updatedComment;
        } else if (c.replies && c.replies.length > 0) {
          return { ...c, replies: updateRecursively(c.replies) };
        }
        return c;
      });
    };
    setComments((prevComments) => {
      const updatedList = updateRecursively(prevComments);
      return updatedList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    });
  }, []);

  const handleCommentDeleted = useCallback(
    (deletedComment) => {
      handleCommentUpdated(deletedComment);
    },
    [handleCommentUpdated]
  );

  const handleReplyAdded = useCallback((newReply, parentId) => {
    const addReplyRecursively = (commentsArray, replyToAdd, targetParentId) => {
      return commentsArray.map((comment) => {
        if (comment.id === targetParentId) {
          const updatedReplies = comment.replies
            ? [...comment.replies, replyToAdd]
            : [replyToAdd];
          updatedReplies.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          return { ...comment, replies: updatedReplies };
        } else if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: addReplyRecursively(
              comment.replies,
              replyToAdd,
              targetParentId
            ),
          };
        }
        return comment;
      });
    };
    setComments((prevComments) => addReplyRecursively(prevComments, newReply, parentId));
  }, []);

  const topLevelComments = comments.filter((comment) => !comment.parentCommentId);

  return (
    <section className="suggestion-comments">
      <h2>Komentari ({comments?.length || 0})</h2>

      {isAuthenticated ? (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            placeholder="Napišite komentar..."
            rows="3"
            value={newCommentContent}
            onChange={handleNewCommentChange}
            disabled={isSubmitting}
            aria-label="Novi komentar"
            required
          />
          {submitError && <p className="comment-error" role="alert">{submitError}</p>}
          <button
            type="submit"
            className="button-primary comment-submit-button"
            disabled={isSubmitting || !newCommentContent.trim()}
          >
            {isSubmitting ? "Slanje..." : "Pošalji komentar"}
          </button>
        </form>
      ) : (
        <p className="login-prompt">
          Morate biti prijavljeni da biste komentirali. <Link to="/login" state={{ from: location }}>Prijavi se</Link>
        </p>
      )}

      <ol className="comment-list">
        {topLevelComments.length > 0 ? (
          topLevelComments.map((comment) => (
            <li key={comment.id}>
              <CommentItem
                comment={comment}
                suggestionId={suggestionId}
                onCommentUpdated={handleCommentUpdated}
                onCommentDeleted={handleCommentDeleted}
                onReplyAdded={handleReplyAdded}
              />
            </li>
          ))
        ) : (
          <p className="no-comments-message">
            Nema komentara za ovaj prijedlog. Budite prvi!
          </p>
        )}
      </ol>
    </section>
  );
}

SuggestionComments.propTypes = {
  suggestionId: PropTypes.number,
  initialComments: PropTypes.arrayOf(PropTypes.object),
};

export default SuggestionComments;