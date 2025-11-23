"use client";
import React, { useEffect, useState } from "react";
import * as he from "he";

type WPComment = {
  id: number;
  parent: number;
  author_name: string;
  date: string;
  content: { rendered: string };
};

export default function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<WPComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [form, setForm] = useState({ author_name: "", author_email: "", content: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadComments() {
    setLoading(true);
    try {
      const res = await fetch(`https://cms.indiagraphs.com/wp-json/wp/v2/comments?post=${postId}&orderby=date&order=asc`);
      const data = await res.json();
      if (Array.isArray(data)) setComments(data);
      else setComments([]);
    } catch (e) {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!postId) return;
    loadComments();
  }, [postId]);

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.author_name || !form.author_email || !form.content) {
      setError("Please fill in name, email and comment.");
      return;
    }

    setSending(true);

    const payload = {
      post: postId,
      parent: replyTo || 0,
      author_name: form.author_name,
      author_email: form.author_email,
      content: form.content,
    };

    try {
      const res = await fetch("/api/comment-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error || "Failed to submit comment");
        setSending(false);
        return;
      }

      setSuccess("Your comment was submitted and is awaiting moderation.");
      setForm({ author_name: "", author_email: "", content: "" });
      setReplyTo(null);
      loadComments();
    } catch (err) {
      setError("Failed to submit comment");
    } finally {
      setSending(false);
    }
  }

  const buildThread = (parentId = 0) =>
    comments
      .filter((c) => c.parent === parentId)
      .map((c) => (
        <div key={c.id} className={`mt-6 ${parentId ? "ml-6 border-l pl-4" : ""}`}>
          <div className="text-sm font-semibold">{c.author_name}</div>
          <div className="text-xs text-gray-500 mb-1">{new Date(c.date).toLocaleString()}</div>
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: he.decode(c.content.rendered) }} />
          <button className="text-indigo-600 text-xs mt-2" onClick={() => setReplyTo(c.id)}>
            Reply
          </button>
          {buildThread(c.id)}
        </div>
      ));

  return (
    <div className="mt-20">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {loading ? (
        <p>Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet - be first!</p>
      ) : (
        <div>{buildThread(0)}</div>
      )}

      <form onSubmit={submitComment} className="mt-10 p-6 border rounded-xl bg-gray-50 shadow-sm">
        <h3 className="font-semibold mb-2">{replyTo ? `Replying to #${replyTo}` : "Leave a Comment"}</h3>

        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">{success}</p>}

        <div className="flex gap-4 mb-4">
          <input
            className="flex-1 border px-3 py-2 rounded"
            placeholder="Name"
            required
            value={form.author_name}
            onChange={(e) => setForm({ ...form, author_name: e.target.value })}
          />
          <input
            className="flex-1 border px-3 py-2 rounded"
            placeholder="Email"
            type="email"
            required
            value={form.author_email}
            onChange={(e) => setForm({ ...form, author_email: e.target.value })}
          />
        </div>

        <textarea
          className="w-full border px-3 py-2 rounded h-28"
          placeholder="Your comment..."
          value={form.content}
          required
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        {replyTo && (
          <button type="button" className="text-xs text-gray-500 mt-1" onClick={() => setReplyTo(null)}>
            Cancel Reply
          </button>
        )}

        <button type="submit" disabled={sending} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 disabled:opacity-50">
          {sending ? "Posting…" : "Post Comment"}
        </button>
      </form>
    </div>
  );
}