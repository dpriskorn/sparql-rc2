// ./src/components/NoticeLink.tsx
import { Link } from "react-router-dom";

export default function NoticeLink() {
  const today = new Date();
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + 1); // 1 month from now

  // Only show if today is before expiry
  if (today > expiry) return null;

  return (
    <div className="alert alert-info mt-3">
      Check out the new{" "}
      <Link to="/validate" className="alert-link">
        Validation Page
      </Link>
      !
    </div>
  );
}
