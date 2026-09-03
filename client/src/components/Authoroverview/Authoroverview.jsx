import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaCircleCheck,
  FaFileLines,
  FaComments,
  FaEye,
  FaPenNib,
} from "react-icons/fa6";
import "./AuthorOverview.css";

const API_URL = "http://localhost:5000/api";

export default function AuthorOverview() {
  // --------------------------------------------------
  // Stats
  // --------------------------------------------------

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // --------------------------------------------------
  // Recent stories
  // --------------------------------------------------

  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);

        const response = await fetch(
          `${API_URL}/me/author-stats`,
          { credentials: "include" },
        );

        const result = await response.json();

        if (response.ok && result.success !== false) {
          setStats(result.data);
        }
      } catch (err) {
        console.error(
          "Failed to fetch author stats:",
          err,
        );
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchStories = async () => {
      try {
        setStoriesLoading(true);

        const response = await fetch(
          `${API_URL}/stories/mine`,
          { credentials: "include" },
        );

        const result = await response.json();

        if (response.ok && result.success !== false) {
          setStories((result.data || []).slice(0, 5));
        }
      } catch (err) {
        console.error(
          "Failed to fetch recent stories:",
          err,
        );
      } finally {
        setStoriesLoading(false);
      }
    };

    fetchStats();
    fetchStories();
  }, []);

  const formatDate = (value) => {
    if (!value) return "";

    try {
      return new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="author-overview">

      <div className="author-overview__header">
        <div>
          <h2>Welcome back</h2>
          <p>Here's how your writing is doing.</p>
        </div>

        <Link to="/add-story" className="btn btn-primary">
          <FaPenNib />
          Write a new story
        </Link>
      </div>

      <div className="author-overview__stats">

        <div className="author-stat-card">
          <span className="author-stat-card__icon author-stat-card__icon--purple">
            <FaBookOpen />
          </span>

          <div>
            <strong>
              {statsLoading ? "…" : stats?.storyCount ?? 0}
            </strong>
            <span>Total stories</span>
          </div>
        </div>

        <div className="author-stat-card">
          <span className="author-stat-card__icon author-stat-card__icon--gold">
            <FaCircleCheck />
          </span>

          <div>
            <strong>
              {statsLoading
                ? "…"
                : stats?.publishedCount ?? 0}
            </strong>
            <span>Published</span>
          </div>
        </div>

        <div className="author-stat-card">
          <span className="author-stat-card__icon author-stat-card__icon--terracotta">
            <FaFileLines />
          </span>

          <div>
            <strong>
              {statsLoading ? "…" : stats?.draftCount ?? 0}
            </strong>
            <span>Drafts</span>
          </div>
        </div>

        <div className="author-stat-card">
          <span className="author-stat-card__icon author-stat-card__icon--purple">
            <FaComments />
          </span>

          <div>
            <strong>
              {statsLoading
                ? "…"
                : stats?.totalComments ?? 0}
            </strong>
            <span>Comments</span>
          </div>
        </div>

        <div className="author-stat-card">
          <span className="author-stat-card__icon author-stat-card__icon--gold">
            <FaEye />
          </span>

          <div>
            <strong>
              {statsLoading ? "…" : stats?.totalViews ?? 0}
            </strong>
            <span>Total views</span>
          </div>
        </div>

      </div>

      <div className="author-overview__recent">
        <div className="author-overview__recent-head">
          <h3>Recent stories</h3>
          <Link to="/author/stories">View all</Link>
        </div>

        {storiesLoading && (
          <p className="author-overview__empty">
            Loading...
          </p>
        )}

        {!storiesLoading && stories.length === 0 && (
          <p className="author-overview__empty">
            You haven't written any stories yet.
          </p>
        )}

        {!storiesLoading && stories.length > 0 && (
          <ul className="author-overview__list">
            {stories.map((story) => (
              <li key={story._id}>
                <div>
                  <strong>{story.title}</strong>
                  <span>
                    {formatDate(story.createdAt)} ·{" "}
                    {story.views || 0} views
                  </span>
                </div>

                <span
                  className={`dashboard-pill ${
                    story.published
                      ? "dashboard-pill--published"
                      : "dashboard-pill--draft"
                  }`}
                >
                  {story.published ? "Published" : "Draft"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}