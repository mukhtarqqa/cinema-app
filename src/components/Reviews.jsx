import React, { useState, useEffect, useCallback } from 'react';
import { addReview, getReviews, deleteReview } from '../services/reviewService.js';

export default function Reviews({ itemId, currentUser }) {
  let [reviews, setReviews] = useState([]);
  let [text, setText] = useState('');
  let [rating, setRating] = useState(5);
  let [loading, setLoading] = useState(false);

  let fetchReviews = useCallback(async () => {
    try {
      let data = await getReviews(itemId);
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  }, [itemId]);

  useEffect(() => {
    if (itemId) {
      fetchReviews();
    }
  }, [itemId, fetchReviews]);

  let handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentUser) return;
    setLoading(true);
    try {
      await addReview(itemId, currentUser.uid, text, rating);
      setText('');
      setRating(5);
      await fetchReviews();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  let handleDelete = async (review) => {
    let canDelete = currentUser && (currentUser.uid === review.userId || currentUser.role === 'admin');
    if (!canDelete) return;
    try {
      await deleteReview(review.id);
      await fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="reviews-section">
      <h3>Reviews</h3>
      
      {currentUser && (
        <form onSubmit={handleSubmit} className="review-form">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your review here..."
            required
            rows="4"
          />
          <div className="review-form-controls">
            <label>
              Rating:
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Terrible</option>
              </select>
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => {
            let canDelete = currentUser && (currentUser.uid === review.userId || currentUser.role === 'admin');
            return (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span className="review-rating">⭐ {review.rating}</span>
                  <span className="review-date">
                    {review.createdAt
                      ? (review.createdAt.toDate
                          ? review.createdAt.toDate()
                          : new Date(review.createdAt)
                        ).toLocaleString('ru-RU', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })
                      : ''}
                  </span>
                </div>
                <p className="review-text">{review.text}</p>
                {canDelete && (
                  <button onClick={() => handleDelete(review)} className="delete-review-btn">
                    Delete
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
