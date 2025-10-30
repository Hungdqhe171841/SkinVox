import { useState, useEffect } from 'react'
import { Star, ThumbsUp, Reply, Trash2, Send } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function BlogComments({ blogId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    loadComments()
  }, [blogId])

  const loadComments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/blogs/${blogId}/comments`)
      const data = await response.json()
      if (data.success) {
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    if (!user) {
      alert('Bạn cần đăng nhập để bình luận!')
      return
    }

    if (!newComment.trim()) {
      alert('Vui lòng nhập nội dung bình luận!')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          comment: newComment,
          rating: newRating > 0 ? newRating : null
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setComments([data.comment, ...comments])
        setNewComment('')
        setNewRating(0)
        alert('Bình luận đã được gửi!')
      } else {
        alert(data.message || 'Có lỗi xảy ra!')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Có lỗi xảy ra khi gửi bình luận!')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = async (commentId) => {
    if (!user) {
      alert('Bạn cần đăng nhập để trả lời!')
      return
    }

    if (!replyText.trim()) {
      alert('Vui lòng nhập nội dung trả lời!')
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blog/blogs/${blogId}/comments/${commentId}/reply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ comment: replyText })
        }
      )

      const data = await response.json()
      
      if (data.success) {
        loadComments()
        setReplyingTo(null)
        setReplyText('')
        alert('Trả lời đã được gửi!')
      }
    } catch (error) {
      console.error('Error replying:', error)
      alert('Có lỗi xảy ra khi gửi trả lời!')
    }
  }

  const handleDelete = async (commentId) => {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blog/blogs/${blogId}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      const data = await response.json()
      
      if (data.success) {
        setComments(comments.filter(c => c._id !== commentId))
        alert('Bình luận đã được xóa!')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Có lỗi xảy ra khi xóa bình luận!')
    }
  }

  const handleHelpful = async (commentId) => {
    if (!user) {
      alert('Bạn cần đăng nhập!')
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blog/blogs/${blogId}/comments/${commentId}/helpful`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      const data = await response.json()
      
      if (data.success) {
        loadComments()
      }
    } catch (error) {
      console.error('Error marking helpful:', error)
    }
  }

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= (interactive ? (hoverRating || newRating) : rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Bình luận ({comments.length})
      </h2>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8 bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá của bạn (tùy chọn)
            </label>
            {renderStars(newRating, true, setNewRating)}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bình luận *
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
          </button>
        </form>
      ) : (
        <div className="mb-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-blue-800">
            Vui lòng <a href="/login" className="font-medium underline">đăng nhập</a> để bình luận và đánh giá bài viết.
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-white p-6 rounded-lg shadow">
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-semibold">
                      {comment.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{comment.username}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                {comment.rating && renderStars(comment.rating)}
              </div>

              {/* Comment Content */}
              <p className="text-gray-700 mb-4">{comment.comment}</p>

              {/* Comment Actions */}
              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => handleHelpful(comment._id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-pink-600"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Hữu ích ({comment.helpful?.length || 0})
                </button>
                <button
                  onClick={() => setReplyingTo(comment._id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-pink-600"
                >
                  <Reply className="w-4 h-4" />
                  Trả lời
                </button>
                {user && (user.id === comment.user._id || user.role === 'admin') && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                )}
              </div>

              {/* Reply Form */}
              {replyingTo === comment._id && (
                <div className="mt-4 ml-6 border-l-2 border-pink-200 pl-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Nhập câu trả lời..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(comment._id)}
                      className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700 text-sm"
                    >
                      Gửi
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyText('')
                      }}
                      className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300 text-sm"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-200 pl-4">
                  {comment.replies.map((reply, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-semibold">
                            {reply.username?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{reply.username}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(reply.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{reply.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

